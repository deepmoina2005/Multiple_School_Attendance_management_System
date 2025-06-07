import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
// ==============================
// Create a New Class
// ==============================
export const createClass = async (req, res) => {
  try {
    const { class_text, class_number } = req.body;
    const schoolId = req.user.schoolId;

    // Check for duplicate class number in the same school
    const existing = await Class.findOne({ school: schoolId, class_number });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Class with this number already exists for this school.",
      });
    }

    const newClass = new Class({
      school: schoolId,
      class_text,
      class_number,
    });

    await newClass.save();
    res.status(201).json({
      success: true,
      message: "Class created successfully.",
      data: newClass,
    });
  } catch (error) {
    console.error("Create Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating class.",
    });
  }
};

// ==============================
// Update Class by ID
// ==============================
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClass = await Class.findOneAndUpdate(
      { _id: id, school: req.user.schoolId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found or unauthorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully.",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Update Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating class.",
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;

    const classStudentCount = await Student.countDocuments({
      student_class: id,
      school: schoolId,
    });

    if (classStudentCount === 0) {
      await Class.findOneAndDelete({ _id: id, school: schoolId });
      return res.status(200).json({
        success: true,
        message: "Class Deleted Successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "This class is already in use.",
      });
    }
  } catch (error) {
    console.error("Delete Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting class.",
    });
  }
};

// ==============================
// Get All Classes (Scoped to School)
// ==============================
export const getAllClass = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const allClasses = await Class.find({ school: schoolId }).sort({
      class_number: 1,
    });

    res.status(200).json({
      success: true,
      message: "Fetched all classes successfully.",
      data: allClasses,
    });
  } catch (error) {
    console.error("Get All Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching classes.",
    });
  }
};
