import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  school: {type: mongoose.Schema.ObjectId, ref: 'School'},
  student: {type: mongoose.Schema.ObjectId, ref: 'Student'},
  class: {type: mongoose.Schema.ObjectId, ref: 'Class'},
  subject:{type: mongoose.Schema.ObjectId, ref: 'Subject'},
  date: {type:Date, required: true},
  status: {type: String, enum:['Present', 'Absent'], default:'Absent'},
  createdAt: {type:Date, default: new Date()}
})

const attendanceModel = mongoose.models.attendance || mongoose.model("Attendance", attendanceSchema)

export default attendanceModel;