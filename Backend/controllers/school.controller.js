import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import School from "../models/school.model.js";

// ===========================
// REGISTER SCHOOL
// ===========================

export const registerSchool = async (req, res) => {
  try {
    const { school_name, email, phone, admin_name, password } = req.body;
    // Validate input (optional but recommended)
    if (!school_name || !email || !phone || !admin_name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if school with same email already exists
    const existingSchool = await School.findOne({ email });
    if (existingSchool) {
      return res.status(409).json({
        success: false,
        message: "This email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new school to DB
    const newSchool = await School.create({
      school_name,
      email,
      phone,
      admin_name,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "School registered successfully.",
      data: {
        id: newSchool._id,
        school_name: newSchool.school_name,
        admin_name: newSchool.admin_name,
        email: newSchool.email,
        phone: newSchool.phone,
      },
    });
  } catch (error) {
    console.error("Register School Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while registering school.",
    });
  }
};


// ===========================
// LOGIN SCHOOL
// ===========================
export const loginSchool = async (req, res) => {
  try {
    const { email, password } = req.body;

    const school = await School.findOne({ email });
    if (!school) {
      return res.status(401).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const isAuth = bcrypt.compareSync(password, school.password);
    if (!isAuth) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "defaultsecretkey";
    const token = jwt.sign(
      {
        id: school._id,
        role: "SCHOOL",
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Optional: Set token in header
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: school._id,
        admin_name: school.admin_name,
        school_name: school.school_name,
        email: school.email,
        phone: school.phone,
        role: "SCHOOL",
      },
    });
  } catch (error) {
    console.error("Login School Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

// ===========================
// GET ALL SCHOOLS
// ===========================
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().select("-password"); // exclude password

    res.status(200).json({
      success: true,
      message: "All schools fetched successfully.",
      data: schools,
    });
  } catch (error) {
    console.error("Get All Schools Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching schools.",
    });
  }
};

// ===========================
// GET SINGLE SCHOOL (From Auth Middleware)
// ===========================
export const getSchoolData = async (req, res) => {
  try {
    const id = req.user.id; // Coming from token middleware

    const school = await School.findById(id).select("-password");
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "School fetched successfully.",
      data: school,
    });
  } catch (error) {
    console.error("Get School Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching school data.",
    });
  }
};

// ===========================
// UPDATE SCHOOL DETAILS (From Auth Middleware)
// ===========================
export const updateSchool = async (req, res) => {
  try {
    const id = req.user.id; // Coming from token middleware
    const { school_name, email, phone, admin_name } = req.body;

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found.",
      });
    }

    // Check if new email is taken by another school
    if (email && email !== school.email) {
      const emailExists = await School.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Another school with this email already exists.",
        });
      }
    }

    // Update only if values are provided
    school.school_name = school_name || school.school_name;
    school.email = email || school.email;
    school.phone = phone || school.phone;
    school.admin_name = admin_name || school.admin_name;

    await school.save();

    res.status(200).json({
      success: true,
      message: "School updated successfully.",
      data: {
        id: school._id,
        school_name: school.school_name,
        admin_name: school.admin_name,
        email: school.email,
        phone: school.phone,
      },
    });
  } catch (error) {
    console.error("Update School Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating school.",
    });
  }
};