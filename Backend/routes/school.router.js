// routes/school.routes.js
import express from "express";
import {
  loginSchool,
  getAllSchools,
  getSchoolData,
  updateSchool,
  registerSchool, // Assumes controller function exists
} from "../controllers/school.controller.js";
import authmiddleware from "../middleware/auth.js";

const schoolRouter = express.Router();

// Register a school
schoolRouter.post("/register", registerSchool);

// Login a school
schoolRouter.post("/login", loginSchool);

// Get all schools
schoolRouter.get("/get-all", getAllSchools);

// Get single school by ID
schoolRouter.get("/get/:id", authmiddleware(['SCHOOL']), getSchoolData);

schoolRouter.put("/update/:id", authmiddleware(['SCHOOL']), updateSchool);

export default schoolRouter;
