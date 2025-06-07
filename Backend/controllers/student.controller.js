import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";

// ===========================
// REGISTER STUDENT
// ===========================
export const registerStudent = async (req, res) => {
  try {
    const {
      email,
      name,
      student_class,
      age,
      gender,
      gurdian,
      gurdian_phone,
      password,
    } = req.body;

    if (!email || !name || !student_class || !age || !gender || !gurdian || !gurdian_phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingStudent = await Student.findOne({ email, school: req.user.schoolId });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      school: req.user.schoolId,
      email,
      name,
      student_class,
      age,
      gender,
      gurdian,
      gurdian_phone,
      password: hashedPassword,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: savedStudent,
    });
  } catch (error) {
    console.error("Student registration failed:", error);
    res.status(500).json({
      success: false,
      message: "Student registration failed.",
    });
  }
};

// ===========================
// LOGIN STUDENT
// ===========================
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ success: false, message: "Email is not registered." });
    }

    const isAuth = await bcrypt.compare(password, student.password);
    if (!isAuth) {
      return res.status(401).json({ success: false, message: "Password is incorrect." });
    }

    const token = jwt.sign(
      {
        id: student._id,
        schoolId: student.school,
        name: student.name,
        role: "STUDENT",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.header("Authorization", `Bearer ${token}`);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: student._id,
        schoolId: student.school,
        name: student.name,
        role: "STUDENT",
      },
    });
  } catch (error) {
    res.status(500).json({
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
    const filterQuery = { school: req.user.schoolId };

    if (req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.student_class) {
      filterQuery.student_class = req.query.student_class;
    }

    const students = await Student.find(filterQuery).select("-password");
    res.status(200).json({
      success: true,
      message: "Fetched students successfully.",
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error [All Student Data].",
    });
  }
};

// ===========================
// GET LOGGED-IN STUDENT (Own)
// ===========================
export const getStudentOwntData = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.user.id,
      school: req.user.schoolId,
    }).select("-password");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error [Own Student Data].",
    });
  }
};

// ===========================
// GET STUDENT BY ID (Admin View)
// ===========================
export const getStudentWithId = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      school: req.user.schoolId,
    }).select("-password");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error [Student by ID].",
    });
  }
};

// ===========================
// UPDATE STUDENT
// ===========================
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.user.id,
      school: req.user.schoolId,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const {
      name,
      email,
      student_class,
      age,
      gender,
      gurdian,
      gurdian_phone,
      password,
    } = req.body;

    // Check for duplicate email
    if (email && email !== student.email) {
      const emailExists = await Student.findOne({
        email,
        school: req.user.schoolId,
        _id: { $ne: student._id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Another student with this email already exists.",
        });
      }

      student.email = email;
    }

    student.name = name || student.name;
    student.student_class = student_class || student.student_class;
    student.age = age || student.age;
    student.gender = gender || student.gender;
    student.gurdian = gurdian || student.gurdian;
    student.gurdian_phone = gurdian_phone || student.gurdian_phone;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      student.password = hashed;
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
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      school: req.user.schoolId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or already deleted.",
      });
    }

    const students = await Student.find({ school: req.user.schoolId }).select("-password");

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
      students,
    });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student.",
    });
  }
};