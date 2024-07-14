const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const teacherSchema = new Schema({
  fid: {
    type: "String",
    required: true,
    unique: true,
  },
  name: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    required: true,
  },
  sub1: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  sub2: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
  },
  timetable: {
    type: Schema.Types.ObjectId,
    ref: "Timetable",
  },
  qualifications: {
    type: "String",
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  // designation: {
  //   type: "String",
  // },
  lab: {
    type: "Number",
    default: 0,
  },
  theory: {
    type: "Number",
    default: 0,
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
