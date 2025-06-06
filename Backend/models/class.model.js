import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  school: {type: mongoose.Schema.ObjectId, ref: 'School'},
  class_text: {type: String, required: true},
  class_number: {type: Number, required: true},
  attendee: {type: mongoose.Schema.ObjectId, ref:'Teacher'},
  createdAt: {type:Date, default: new Date()}
})

const classModel = mongoose.models.class || mongoose.model("Class", classSchema)

export default classModel;