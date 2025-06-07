// routes/school.routes.js
import express from "express";
import authmiddleware from "../middleware/auth.js";
import { createClass, deleteClass, getAllClass, updateClass } from "../controllers/class.controller.js";

const classRouter = express.Router();

classRouter.post("/create", authmiddleware(['SCHOOL']), createClass);
classRouter.get("/all", authmiddleware(['SCHOOL']), getAllClass);
classRouter.patch("/update/:id", authmiddleware(['SCHOOL']), updateClass);
classRouter.delete("/delete/:id", authmiddleware(['SCHOOL']), deleteClass)

export default classRouter;