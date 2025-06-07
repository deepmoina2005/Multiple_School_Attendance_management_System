// routes/teacher.routes.js
import express from "express";
import authmiddleware from "../middleware/auth.js";
import { deleteStudent, getStudentOwntData, getStudentsWithQuery, loginStudent, registerStudent, updateStudent } from "../controllers/student.controller.js";

const studentRouter = express.Router();

// Register a teacher
studentRouter.post("/register", authmiddleware(['SCHOOL']), registerStudent);

// Login a teacher
studentRouter.post("/login", loginStudent);

// Get all teachers (School role)
studentRouter.get("/all", authmiddleware(['SCHOOL']), getStudentsWithQuery);

// Get a specific student by ID
studentRouter.get("/fetch/:id", authmiddleware(['SCHOOL']), getStudentOwntData);

// Delete a student by ID
studentRouter.delete("/delete/:id", authmiddleware(['SCHOOL']), deleteStudent);

// Update a Student
studentRouter.patch("/update/:id", authmiddleware(['SCHOOL']), updateStudent);

export default studentRouter;