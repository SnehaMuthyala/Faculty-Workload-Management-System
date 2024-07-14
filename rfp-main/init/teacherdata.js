const mongoose = require("mongoose");
const Subject = require("../models/subject.js");
const Timetable = require("../models/timetable.js");
const Teacher = require("../models/teacher.js");
const Department = require("../models/department.js");

const MONGO_URL =
  "mongodb+srv://22b81a05y9:ananya521@clusterprojects.7x4tczd.mongodb.net/fwms";

main()
  .then(() => {
    console.log("connection to db established");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  let adsj = await Subject.findOne({ subcode: "ADSJ" });
  let adsjl = await Subject.findOne({ subcode: "ADSJL" });
  let t1 = await Timetable.findOne({ id: "timetable001" });
  let dept = await Department.findOne({ deptcode: "CSE" });

  const teachersData = [
    {
      fid: "SMP",
      name: "Sampurnima",
      email: "sampurnimacvr@gmail.com",
      sub1: adsj._id,
      sub2: adsjl._id,
      timetable: t1._id,
      qualifications: "PHD in computer science",
      department: dept._id,
    },
  ];
  await Teacher.deleteMany({});
  const teacherList = await Teacher.insertMany(teachersData);
  dept.teachers.push(teacherList[0]._id);
  dept.save();
  console.log(teachersData);
};

const populateData = async () => {
  try {
    const teachers = await Teacher.find({ fid: "SMP" }).populate({
      path: "sub1 sub2 timetable",
    });
    const populatedTeacher = teachers[0];
    console.log(populatedTeacher);
  } catch (err) {
    console.log("Error populating data: ", err.message);
  }
};

initDB()
  .then(populateData)
  .catch((error) => {
    console.log("Error initializing DB:", error.message);
  });
