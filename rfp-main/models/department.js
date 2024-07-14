const mongoose = require("mongoose");
const { Schema } = mongoose;
const Teacher = require("./teacher.js");
const Announcement = require("./announcement.js");

const departmentSchema = new Schema({
  deptname: {
    type: "String",
    required: true,
    unique: true,
  },
  deptcode: {
    type: "String",
    required: true,
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});

const Department = mongoose.model("Department", departmentSchema);

// const addDepartment = async () => {
//   let teacherList = await Teacher.find({});
//   let deptteachers = [];
//   for (let teacher of teacherList) {
//     if (teacher.department === "CSE") {
//       deptteachers.push(teacher._id);
//     }
//   }
//   let dept1 = new Department({
//     deptname: "Computer Science and Engineering",
//     deptcode: "CSE",
//     teachers: deptteachers,
//   });
//   let result = await dept1.save();
//   console.log(result);
// };

// addDepartment();
module.exports = Department;
