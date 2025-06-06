import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  school: {type: mongoose.Schema.ObjectId, ref: 'School'},
  email: {type: String, required: true},
  name: {type: String, required: true},
  student_class: {type: String, required: true},
  age: {type: String, required: true},
  gender:{type: String, required: true},
  gurdian:{type: String, required: true},
  gurdian_phone:{type: String, required: true},
  password:{type: String, required: true},
  createdAt: {type:Date, default: new Date()}
})

const studentModel = mongoose.models.student || mongoose.model("Student", studentSchema)

export default studentModel;