const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subject = require("./subject.js");

const timetableSchema = new Schema({
  id: { type: String },
  Monday: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
  Tuesday: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],

  Wednesday: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],

  Thursday: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],

  Friday: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
  Saturday: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
