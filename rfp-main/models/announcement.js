const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Teacher = require("./teacher.js");
const Department = require("./department.js");

const announcementSchema = new Schema({
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
  },

  messages: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      displayname: {
        type: String,
        required: true,
      },
      msg: {
        type: String,
        required: true,
      },
    },
  ],
});

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
