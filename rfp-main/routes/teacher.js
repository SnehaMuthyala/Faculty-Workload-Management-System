const express = require("express");
const router = express.Router();

const Subject = require("../models/subject.js");
const Timetable = require("../models/timetable.js");
const Teacher = require("../models/teacher.js");
const Department = require("../models/department.js");
const Announcement = require("../models/announcement.js");
const { isLoggedIn, isTeacherOrAdmin } = require("../middleware.js");

// teachers routes
// show list of teachers
router.get("/", isLoggedIn, async (req, res) => {
  const teacherList = await Teacher.find({}).populate("sub1 sub2 timetable");
  // console.log(teacherList);
  res.render("teachers/index.ejs", { teacherList });
});

router.get("/new", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  const subjects = await Subject.find({});
  const departments = await Department.find({});
  res.render("teachers/new.ejs", { subjects, departments });
});

router.post("/", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  try {
    const teacher = new Teacher(req.body.teacher);
    console.log(teacher);
    const defaultTimetable = await Timetable.findOne({ id: "default" });

    if (!defaultTimetable) {
      return res.status(404).send("Default timetable not found");
    }

    const dept = await Department.findById(teacher.department);

    if (!dept) {
      return res.status(404).send("Department not found");
    }
    if (req.user.role == "teacher") {
      teacher.fid = req.user.username;
    }

    const clonedTimetable = new Timetable({
      Monday: defaultTimetable.Monday,
      Tuesday: defaultTimetable.Tuesday,
      Wednesday: defaultTimetable.Wednesday,
      Thursday: defaultTimetable.Thursday,
      Friday: defaultTimetable.Friday,
      Saturday: defaultTimetable.Saturday,
    });

    const newTimetable = await clonedTimetable.save();
    teacher.timetable = newTimetable._id;

    const newTeacher = await teacher.save();

    dept.teachers.push(newTeacher._id);
    await dept.save();
    req.flash(
      "success",
      "Teacher created successfully, Please set the timetable!"
    );
    res.redirect(
      `/teachers/${newTeacher._id}/timetables/${newTimetable._id}/edit`
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating teacher");
  }
});

// show particular teacher:
router.get("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id).populate("sub1 sub2 timetable");
  const user = req.user;
  console.log(teacher);
  let resid = teacher.timetable._id;
  const timetable = await Timetable.findById(resid).populate(
    "Monday Tuesday Wednesday Thursday Friday Saturday"
  );
  const department = await Department.findById(teacher.department);
  // console.log(timetable);
  res.render("teachers/show.ejs", { teacher, timetable, department, user });
});

//edit particular teachers information:
router.get("/:id/edit", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  let { id } = req.params;
  const teacher = await Teacher.findById(id).populate("sub1 sub2");
  if (!teacher.fid === req.user.username && req.user.role === "teacher") {
    req.flash("error", "You are not authorized to edit this teacher's info");
    return res.redirect(`/teachers/${id}`);
  }
  const subjects = await Subject.find({});
  const departments = await Department.find({});
  res.render("teachers/edit.ejs", { teacher, subjects, departments });
});

//update particular teachers personal information:
router.put("/:id", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  let { id } = req.params;
  await Teacher.findByIdAndUpdate(id, { ...req.body.teacher });
  req.flash(
    "success",
    "Information has been updated to the database successfully!"
  );
  if (req.user.role === "teacher") res.redirect("/profile");
  else res.redirect(`/teachers/${id}`);
});

// edit particular teachers timetable:
router.get(
  "/:tid/timetables/:id/edit",
  isLoggedIn,
  isTeacherOrAdmin,
  async (req, res) => {
    let { id } = req.params;
    let { tid } = req.params;
    const timetable = await Timetable.findById(id).populate(
      "Monday Tuesday Wednesday Thursday Friday Saturday"
    );
    const teacher = await Teacher.findById(tid).populate("sub1 sub2");
    if (!teacher.fid === req.user.username && req.user.role === "teacher") {
      req.flash(
        "error",
        "You are not authorized to edit this teacher's timetable"
      );
      return res.redirect(`/teachers/${id}`);
    }
    let lunch = await Subject.findOne({ subcode: "BREAK" });
    let free = await Subject.findOne({ subcode: "FREE" });
    const subjects = [teacher.sub1, teacher.sub2, lunch, free];
    res.render("timetables/edit.ejs", { timetable, subjects, teacher });
  }
);

// update timetable
router.put(
  "/:tid/timetables/:id",
  isLoggedIn,
  isTeacherOrAdmin,
  async (req, res) => {
    let { id } = req.params;
    let { tid } = req.params;
    await Timetable.findByIdAndUpdate(id, { ...req.body.timetable });
    req.flash("success", "Updated the timetable!");
    if (req.user.role === "teacher") res.redirect("/profile");
    else res.redirect(`/teachers/${tid}`);
  }
);

module.exports = router;
