// routes/school.routes.js
import express from "express";
import authmiddleware from "../middleware/auth.js";
import { createSubject, deleteSubject, getAllSubjects, updateSubject } from "../controllers/subject.controller.js";

const subjectRouter = express.Router();

subjectRouter.post("/create", authmiddleware(['SCHOOL']), createSubject);
subjectRouter.get("/all", authmiddleware(['SCHOOL']), getAllSubjects);
subjectRouter.patch("/update/:id", authmiddleware(['SCHOOL']), updateSubject);
subjectRouter.delete("/delete/:id", authmiddleware(['SCHOOL']), deleteSubject)

export default subjectRouter;