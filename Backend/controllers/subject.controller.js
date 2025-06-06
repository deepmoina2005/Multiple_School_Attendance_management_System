import Subject from "../models/subject.model.js";

// ==============================
// Create a New Subject
// ==============================
export const createSubject = async (req, res) => {
  try {
    const { subject_name, subject_codename } = req.body;
    const schoolId = req.user.schoolId;

    // Check if subject already exists in the same school
    const existingSubject = await Subject.findOne({
      school: schoolId,
      $or: [
        { subject_name },
        { subject_codename }
      ],
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject with the same name or codename already exists in this school.",
      });
    }

    const newSubject = new Subject({
      school: schoolId,
      subject_name,
      subject_codename,
    });

    await newSubject.save();

    res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      data: newSubject,
    });
  } catch (error) {
    console.error("Create Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating subject.",
    });
  }
};

// ==============================
// Update Subject by ID
// ==============================
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: id, school: req.user.schoolId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found or unauthorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Update Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating subject.",
    });
  }
};

// ==============================
// Delete Subject by ID
// ==============================
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubject = await Subject.findOneAndDelete({
      _id: id,
      school: req.user.schoolId,
    });

    if (!deletedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found or unauthorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting subject.",
    });
  }
};

// ==============================
// Get All Subjects (School Scoped)
// ==============================
export const getAllSubjects = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const subjects = await Subject.find({ school: schoolId }).sort({ subject_name: 1 });

    res.status(200).json({
      success: true,
      message: "Fetched all subjects successfully.",
      data: subjects,
    });
  } catch (error) {
    console.error("Get Subjects Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching subjects.",
    });
  }
};
