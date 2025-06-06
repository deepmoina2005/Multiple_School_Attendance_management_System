// routes/teacher.routes.js
import express from "express";
import authmiddleware from "../middleware/auth.js";
import {
  registerTeacher,
  loginTeacher,
  updateTeacher,
  getTeachersWithQuery,
  getTeacherOwnData,
  getTeacherById,
  deleteTeacher,
} from "../controllers/teacher.controller.js";

const teacherRouter = express.Router();

// Register a teacher
teacherRouter.post("/register", registerTeacher);

// Login a teacher
teacherRouter.post("/login", loginTeacher);

// Update own profile (Teacher role)
teacherRouter.patch("/update", authmiddleware(['TEACHER']), updateTeacher);

// Get all teachers (School role)
teacherRouter.get("/all", authmiddleware(['SCHOOL']), getTeachersWithQuery);

// Get own teacher profile
teacherRouter.get("/fetch-single", authmiddleware(['TEACHER']), getTeacherOwnData);

// Get a specific teacher by ID
teacherRouter.get("/fetch/:id", authmiddleware(['SCHOOL']), getTeacherById);

// Delete a teacher by ID
teacherRouter.delete("/delete/:id", authmiddleware(['SCHOOL']), deleteTeacher);

export default teacherRouter;