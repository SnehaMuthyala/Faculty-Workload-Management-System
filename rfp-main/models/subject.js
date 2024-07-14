const mongoose = require("mongoose");
const { Schema } = mongoose;

const subjectSchema = new Schema({
  subcode: {
    type: "String",
    required: true,
    unique: true,
  },
  subname: {
    type: "String",
    required: true,
  },
  subtype: {
    type: "String",
    required: true,
    maxLength: 1,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

const addSubject = async () => {
  let sub1 = new Subject({
    subcode: "ADSJ",
    subname: "Advanced Data Structures Through JAVA",
    subtype: "T",
  });
  let result = await sub1.save();
  console.log(result);
};

module.exports = Subject;
