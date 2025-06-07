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

schoolRouter.get(
  "/get-single",
  authmiddleware(["SCHOOL"]), // Ensures only authenticated schools can access
  getSchoolData
);

schoolRouter.patch("/update", authmiddleware(["SCHOOL"]), updateSchool);

export default schoolRouter;