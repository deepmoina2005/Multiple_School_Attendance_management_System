import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  school: {type: mongoose.Schema.ObjectId, ref: 'School'},
  teacher: {type: mongoose.Schema.ObjectId, ref: 'Teacher'},
  subject: {type: mongoose.Schema.ObjectId, ref: 'Subject'},
  class: {type: mongoose.Schema.ObjectId, ref: 'Class'},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  createdAt: {type:Date, default: new Date()}
})

const scheduleModel = mongoose.models.schedule || mongoose.model("Schedule", scheduleSchema)

export default scheduleModel;