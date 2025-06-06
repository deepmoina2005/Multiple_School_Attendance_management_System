import express from "express";
import authmiddleware from "../middleware/auth.js";
import {
  markAttendance,
  getAttendance,
  checkAttendance
} from "../controllers/attendance.controller.js";

const attendanceRouter = express.Router();

// POST - Mark attendance
attendanceRouter.post("/mark", authmiddleware(['SCHOOL']), markAttendance);

// GET - Get attendance for a student
attendanceRouter.get("/student/:studentId", authmiddleware(['SCHOOL']), getAttendance);

// GET - Check if attendance is already marked for today for a class
attendanceRouter.get("/check/:classId", authmiddleware(['SCHOOL']), checkAttendance);

export default attendanceRouter;