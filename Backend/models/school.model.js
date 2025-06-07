import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  school_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  admin_name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const School = mongoose.models.School || mongoose.model("School", schoolSchema);
export default School;
