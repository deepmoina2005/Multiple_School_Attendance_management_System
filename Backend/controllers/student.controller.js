import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";

// ===========================
// REGISTER STUDENT
// ===========================
export const registerStudent = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      const Student = await Student.findOne({ email: fields.email[0] });
      if (Student) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already registered." });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(fields.password[0], salt);
        const newStudent = new Student({
          school: req.user.schoolId,
          email: fields.email[0],
          name: fields.name[0],
          student_class: fields.student_class[0],
          age: fields.age[0],
          gender: fields.gender[0],
          gurdian: fields.gurdian[0],
          genrdian_phone: fields.gurdian_phone[0],
          password: hashedPassword,
        });

        const savedStudent = await newStudent.save();
        res.status(200).json({
          success: true,
          data: savedStudent,
          message: "Student is Registered Successfully.",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Student Registered Failed" });
  }
};

// ===========================
// LOGIN STUDENT
// ===========================
export const loginStudent = async (req, res) => {
  try {
    const Student = await Student.findOne({ email: req.body.email });
    if (Student) {
      const isAuth = bcrypt.compareSync(req.body.password, Student.password);
      if (isAuth) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: Student._id,
            schoolId: Student.school,
            name: Student.name,
            role: "STUDENT",
          },
          jwtSecret
        );
        res.header("Authorization", token);
        res.status(200).json({
          success: true,
          message: "Success Login.",
          user: {
            id: Student._id,
            schoolId: Student.school,
            name: Student.name,
            role: "STUDENT",
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Password is Incorrect" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Email is not registered." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error [Student Login].",
      });
  }
};

// ===========================
// GET ALL STUDENTS (of a school)
// ===========================
export const getStudentsWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    const schoolId = req.user.schoolId;
    filterQuery["school"] = schoolId;

    if (req.query.hasOwnProperty("search")) {
      filterQuery["name"] = { $regex: req.query.search, $option: "i" };
    }

    if (req.query.hasOwnProperty("student_class")) {
      filterQuery["student_class"] = req.query.student_class;
    }

    const Students = await Student.find(filterQuery).select(["-password"]);
    res
      .status(200)
      .json({
        success: true,
        message: "Success in fetching all Students.",
        Students,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error [All Student Data].",
      });
  }
};

// ===========================
// GET SINGLE STUDENT
// ===========================
export const getStudentOwntData = async (req, res) => {
  try {
    const id = req.user.id;
    const schoolId = req.user.schoolId;
    const Student = await Student.findOne({ _id: id, school: schoolId }).select(
      ["-password"]
    );
    if (Student) {
      res.status(200).json({ success: false, message: "Student not found." });
    } else {
      res.status(404).json({ success: false, message: "Student Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error [OWN Student Data].",
      });
  }
};

// ===========================
// GET SINGLE STUDENT
// ===========================
export const getStudentWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    const Student = await Student.findOne({ _id: id, school: schoolId }).select(
      ["-password"]
    );
    if (Student) {
      res.status(200).json({ success: false, message: "Student not found." });
    } else {
      res.status(404).json({ success: false, message: "Student Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error [OWN Student Data].",
      });
  }
};

// ===========================
// UPDATE STUDENT
// ===========================
export const updateStudent = async (req, res) => {
  try {
    const id = req.user.id; // Authenticated student's ID
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      if (err) {
        return res.status(400).json({ success: false, message: "Form parsing error" });
      }

      const student = await Student.findOne({ _id: id, school: req.user.schoolId });

      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
      }

      // Check for email conflict if changed
      const newEmail = fields.email?.[0];
      if (newEmail && newEmail !== student.email) {
        const emailExists = await Student.findOne({
          email: newEmail,
          school: req.user.schoolId,
          _id: { $ne: id }, // Exclude self
        });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Another student with this email already exists.",
          });
        }

        student.email = newEmail;
      }

      // Update fields if provided
      student.name = fields.name?.[0] || student.name;
      student.student_class = fields.student_class?.[0] || student.student_class;
      student.age = fields.age?.[0] || student.age;
      student.gender = fields.gender?.[0] || student.gender;
      student.gurdian = fields.gurdian?.[0] || student.gurdian;
      student.gurdian_phone = fields.gurdian_phone?.[0] || student.gurdian_phone;

      // Update password if provided
      if (fields.password?.[0]) {
        const salt = bcrypt.genSaltSync(10);
        student.password = bcrypt.hashSync(fields.password[0], salt);
      }

      const updatedStudent = await student.save();

      res.status(200).json({
        success: true,
        message: "Student updated successfully.",
        data: {
          id: updatedStudent._id,
          email: updatedStudent.email,
          name: updatedStudent.name,
          student_class: updatedStudent.student_class,
        },
      });
    });
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating student.",
    });
  }
};

// ===========================
// DELETE STUDENT
// ===========================
export const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    await Student.findByIdAndDelete({_id:id, school:schoolId})
    const students = await Student.find({school:schoolId})
    res.status.json({success:true, message:"Student Deleted", students})
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student.",
    });
  }
};