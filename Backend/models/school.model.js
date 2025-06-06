import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  school_name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  admin_name: {type: String, required: true},
  admin_image: {type: String, required: true},
  password:{type: String, required: true},
  createdAt: {type:Date, default: new Date()}
})

const schoolModel = mongoose.models.school || mongoose.model("School", schoolSchema)

export default schoolModel;