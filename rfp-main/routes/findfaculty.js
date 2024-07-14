const express = require("express");
const router = express.Router();
const Subject = require("../models/subject.js");
const Timetable = require("../models/timetable.js");
const Teacher = require("../models/teacher.js");
const Department = require("../models/department.js");
const { isLoggedIn } = require("../middleware.js");

// get findfaculty page:
router.get("/", isLoggedIn, async (req, res) => {
  const freeTeacherList = [];
  const departments = await Department.find({});
  res.render("main/findfaculty.ejs", { freeTeacherList, departments });
});

// find one teacher using id:
router.post("/id", isLoggedIn, async (req, res) => {
  const fid = req.body.searchfid;
  try {
    const teacher = await Teacher.findOne({ fid: fid });
    if (teacher) {
      console.log(teacher);
      res.redirect(`/teachers/${teacher._id}`);
    } else {
      // Handle case where teacher with the given ID is not found
      console.error(error);
      req.flash("error", "Teacher not found.");
      res.redirect("/findfaculty");
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    req.flash("error", "Teacher not found.");
    res.redirect("/findfaculty");
  }
});

// find idle teachers:

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const dateString = req.body.dateinput;
    const reqperiod = req.body.period - 1;
    const dept = req.body.dept;

    const [year, month, day] = dateString.split("-");
    const dateObject = new Date(year, month - 1, day);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayOfWeek = dateObject.getDay();
    const reqday = days[dayOfWeek];
    const free = await Subject.findOne({ subcode: "FREE" });
    const lunch = await Subject.findOne({ subcode: "BREAK" });

    const departments = await Department.find({});
    const timetableList = await Timetable.find({});
    const freeTeacherList = [];

    for (let timetable of timetableList) {
      let actperiod = timetable[reqday][reqperiod];
      if (String(actperiod) === String(free._id)) {
        let freeteacher = await Teacher.findOne({ timetable: timetable._id });
        if (
          freeteacher &&
          (dept === "all" || String(freeteacher.department) === String(dept))
        ) {
          freeteacher.theory = 0;
          freeteacher.lab = 0;
          for (let i = 0; i <= 6; i++) {
            let sub = await Subject.findOne({ _id: timetable[reqday][i] });
            if (!sub._id.equals(free._id) && !sub._id.equals(lunch._id)) {
              console.log(sub);
              if (sub.subtype === "T") {
                freeteacher.theory += 1;
              } else if (sub.subtype === "L") {
                freeteacher.lab += 1;
              }
            }
          }
          freeTeacherList.push(freeteacher);
        } else {
          continue;
        }
      } else {
        console.log("Teacher is not free");
      }
    }
    freeTeacherList.sort((a, b) => a.theory + a.lab - (b.theory + b.lab));
    res.render("main/findfaculty", { freeTeacherList, departments });
  } catch (error) {
    console.log(error);
    req.flash("error", "Invalid inpute, please try again");
    res.redirect("/findfaculty");
  }
});

module.exports = router;
