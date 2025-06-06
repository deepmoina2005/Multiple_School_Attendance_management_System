import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  subject_name: { type: String, required: true },
  subject_codename: { type: String, required: true },
  crearedAt: { type: Date, default: new Date() },
});

const subjectModel = mongoose.models.subject || mongoose.model("Subject", subjectSchema);

export default subjectModel;
