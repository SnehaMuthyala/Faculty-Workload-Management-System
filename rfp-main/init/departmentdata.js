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

const addDepartment = async () => {
  await Department.deleteMany({});
  let teacherList = await Teacher.find({});
  let deptteachers = [];
  let emptyarr = [];
  for (let teacher of teacherList) {
    if (teacher.department === "CSE") {
      deptteachers.push(teacher._id);
    }
  }

  let departments = [
    {
      deptname: "Computer Science and Engineering",
      deptcode: "CSE",
      teachers: deptteachers,
    },
  ];
  // departments = departments.map((obj) => ({
  //   ...obj,
  //   admin: "6650e561ee36b6ca6b5875c3",
  // }));
  let result = await Department.insertMany(departments);

  console.log(result);
};

addDepartment().catch((error) => {
  console.log("Error initializing DB:", error.message);
});

// const populateData = async () => {
//   try {
//     const teachers = await Teacher.find({ fid: "SMP" }).populate({
//       path: "sub1 sub2 timetable",
//     });
//     const populatedTeacher = teachers[0];
//     console.log(populatedTeacher);
//   } catch (err) {
//     console.log("Error populating data: ", err.message);
//   }
// };

// initDB()
//   .then(populateData)
//   .catch((error) => {
//     console.log("Error initializing DB:", error.message);
//   });
