const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Teacher = require("../models/teacher");
const Department = require("../models/department");
const Timetable = require("../models/timetable");
const passport = require("passport");
const { saveRedirectUrl, isTeacher, isLoggedIn } = require("../middleware");

// user sign up
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const newUser = new User({ username, role });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      if (role === "admin") {
        req.flash("success", "Please enter the secret key to continue!");
        return res.redirect("/cvradminauthentication");
      } else if (role === "teacher") {
        return res.redirect("/teachers/new");
      } else if (role === "student") {
        req.flash("success", "Welcome to the application!");
        return res.redirect("/");
      }
    });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// user login
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to fwms!");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
  }
);

// user logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  req.flash("success", "Logging out...! Goodbye!");
  res.redirect("/");
});

// user profile
router.get("/profile", isLoggedIn, isTeacher, async (req, res) => {
  const uid = req.user._id;
  const teacher = await Teacher.findOne({ fid: req.user.username });
  const department = await Department.findById(teacher.department);
  let resid = teacher.timetable._id;
  const timetable = await Timetable.findById(resid).populate(
    "Monday Tuesday Wednesday Thursday Friday Saturday"
  );
  res.render("users/profile.ejs", { teacher, department, timetable });
});

// admin auth
router.get("/cvradminauthentication", (req, res) => {
  res.render("users/cvradminauth.ejs");
});

router.post("/cvradminauth", async (req, res) => {
  const { secretkey } = req.body;
  if (secretkey === "cvristhebest") {
    res.redirect("/");
  } else {
    req.flash("error", "Wrong Key!");
    await User.findByIdAndDelete(req.user._id);
    res.redirect("/signup");
  }
});

router.get("/deptannouncements", async (req, res) => {
  const teacher = await Teacher.findOne({ fid: req.user.username });
  const deptid = teacher.department;
  res.redirect(`/departments/${deptid}/announcements`);
});

module.exports = router;
