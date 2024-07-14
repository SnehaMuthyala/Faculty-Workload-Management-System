const express = require("express");
const router = express.Router();

const Teacher = require("../models/teacher.js");
const Department = require("../models/department.js");
const Announcement = require("../models/announcement.js");
const { isTeacherOrAdmin, isLoggedIn, isAdmin } = require("../middleware.js");

// department routes
//department index
router.get("/", isLoggedIn, async (req, res) => {
  const departmentList = await Department.find({});
  res.render("departments/index.ejs", { departmentList });
});

// add new department
router.get("/new", isLoggedIn, isAdmin, (req, res) => {
  res.render("departments/new.ejs");
});

// create new department
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { department } = req.body;

    // Create a new department
    const newDepartment = new Department(department);
    newDepartment.teachers = [];
    await newDepartment.save();

    // Find the newly created department by its code
    const temp = await Department.findOne({ deptcode: newDepartment.deptcode });

    // Create a new announcement for the new department with an empty messages array
    const newAnnouncement = new Announcement({
      department: temp._id,
      messages: [],
    });
    await newAnnouncement.save();

    console.log("New department and announcement saved");
    req.flash("success", "New department has been created!");
    res.redirect("/departments");
  } catch (error) {
    req.flash("error", "Failed to create a new department.");
    res.redirect("/departments");
  }
});

// department info
router.get("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const department = await Department.findById(id).populate("teachers");
  console.log(department);
  res.render("departments/show.ejs", { department });
});

// announcements section
router.get(
  "/:deptid/announcements",
  isLoggedIn,
  isTeacherOrAdmin,
  async (req, res) => {
    try {
      const { deptid } = req.params;
      const dept = await Department.findById(deptid);
      if (!dept) {
        return res.status(404).send("Department not found");
      }
      const announcements = await Announcement.findOne({
        department: dept._id,
      }).populate("department messages.user");
      res.render("main/announcements.ejs", { dept, announcements });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching announcements");
    }
  }
);

// post an announcement
router.post(
  "/:deptid/announcements",
  isLoggedIn,
  isTeacherOrAdmin,
  async (req, res) => {
    const { deptid } = req.params;
    const { msg } = req.body;
    const dept = await Department.findById(deptid);
    let announcements = await Announcement.findOne({
      department: dept._id,
    });
    if (!announcements) {
      // Create a new announcement if none exists for the department
      announcements = new Announcement({
        department: dept._id,
        messages: [],
      });
    }

    let resname = "";
    if (req.user.role === "admin") {
      resname = req.user.username;
    } else if (req.user.role === "teacher") {
      const teacher = await Teacher.findOne({ fid: req.user.username });
      resname = teacher.name;
    }
    const newAnnouncement = {
      user: req.user._id,
      displayname: resname,
      msg: msg,
    };
    announcements.messages.push(newAnnouncement);
    await announcements.save();
    res.redirect(`/departments/${deptid}/announcements`);
  }
);

module.exports = router;
