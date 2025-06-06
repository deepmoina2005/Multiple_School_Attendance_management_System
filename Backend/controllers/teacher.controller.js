import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Teacher from "../models/teacher.model.js";

// ===========================
// REGISTER TEACHER
// ===========================
export const registerTeacher = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      const existing = await Teacher.findOne({ email: fields.email?.[0] });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email is already registered." });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(fields.password?.[0], salt);

      const newTeacher = new Teacher({
        school: req.user.schoolId,
        email: fields.email?.[0],
        name: fields.name?.[0],
        qualification: fields.qualification?.[0],
        age: fields.age?.[0],
        gender: fields.gender?.[0],
        password: hashedPassword,
      });

      const savedTeacher = await newTeacher.save();
      res.status(200).json({
        success: true,
        message: "Teacher registered successfully.",
        data: savedTeacher,
      });
    });
  } catch (error) {
    console.error("Register Teacher Error:", error);
    res.status(500).json({ success: false, message: "Teacher registration failed." });
  }
};

// ===========================
// LOGIN TEACHER
// ===========================
export const loginTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      const isMatch = bcrypt.compareSync(req.body.password, teacher.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            id: teacher._id,
            schoolId: teacher.school,
            name: teacher.name,
            role: "TEACHER",
          },
          process.env.JWT_SECRET
        );

        res.header("Authorization", token);
        res.status(200).json({
          success: true,
          message: "Login successful.",
          user: {
            id: teacher._id,
            schoolId: teacher.school,
            name: teacher.name,
            role: "TEACHER",
          },
        });
      } else {
        res.status(401).json({ success: false, message: "Incorrect password." });
      }
    } else {
      res.status(404).json({ success: false, message: "Email not registered." });
    }
  } catch (error) {
    console.error("Login Teacher Error:", error);
    res.status(500).json({ success: false, message: "Teacher login failed." });
  }
};

// ===========================
// GET ALL TEACHERS (by school)
// ===========================
export const getTeachersWithQuery = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const filterQuery = { school: schoolId };

    if (req.query.search) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }

    const teachers = await Teacher.find(filterQuery).select("-password");
    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully.",
      teachers,
    });
  } catch (error) {
    console.error("Get Teachers Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch teachers." });
  }
};

// ===========================
// GET OWN TEACHER PROFILE
// ===========================
export const getTeacherOwnData = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.user.id,
      school: req.user.schoolId,
    }).select("-password");

    if (teacher) {
      res.status(200).json({ success: true, teacher });
    } else {
      res.status(404).json({ success: false, message: "Teacher not found." });
    }
  } catch (error) {
    console.error("Get Own Teacher Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch teacher data." });
  }
};

// ===========================
// GET TEACHER BY ID
// ===========================
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.params.id,
      school: req.user.schoolId,
    }).select("-password");

    if (teacher) {
      res.status(200).json({ success: true, teacher });
    } else {
      res.status(404).json({ success: false, message: "Teacher not found." });
    }
  } catch (error) {
    console.error("Get Teacher By ID Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch teacher." });
  }
};

// ===========================
// UPDATE TEACHER
// ===========================
export const updateTeacher = async (req, res) => {
  try {
    const id = req.user.id;
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      if (err) {
        return res.status(400).json({ success: false, message: "Form parsing failed" });
      }

      const teacher = await Teacher.findOne({ _id: id, school: req.user.schoolId });
      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher not found." });
      }

      const newEmail = fields.email?.[0];
      if (newEmail && newEmail !== teacher.email) {
        const emailExists = await Teacher.findOne({
          email: newEmail,
          school: req.user.schoolId,
          _id: { $ne: id },
        });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Another teacher with this email already exists.",
          });
        }

        teacher.email = newEmail;
      }

      teacher.name = fields.name?.[0] || teacher.name;
      teacher.qualification = fields.qualification?.[0] || teacher.qualification;
      teacher.age = fields.age?.[0] || teacher.age;
      teacher.gender = fields.gender?.[0] || teacher.gender;

      if (fields.password?.[0]) {
        const salt = bcrypt.genSaltSync(10);
        teacher.password = bcrypt.hashSync(fields.password[0], salt);
      }

      const updatedTeacher = await teacher.save();
      res.status(200).json({
        success: true,
        message: "Teacher updated successfully.",
        teacher: updatedTeacher,
      });
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);
    res.status(500).json({ success: false, message: "Failed to update teacher." });
  }
};

// ===========================
// DELETE TEACHER
// ===========================
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.schoolId;

    const teacher = await Teacher.findOneAndDelete({ _id: id, school: schoolId });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    const teachers = await Teacher.find({ school: schoolId });
    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
      teachers,
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete teacher." });
  }
};