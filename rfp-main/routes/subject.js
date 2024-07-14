const express = require("express");
const router = express.Router();

const Subject = require("../models/subject.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");

//subject routes
//display all subjects route
router.get("/", isLoggedIn, async (req, res) => {
  const subjectList = await Subject.find({});
  res.render("subjects/index.ejs", { subjectList });
});

// get info for editing route
router.get("/:id/edit", isLoggedIn, isAdmin, async (req, res) => {
  let { id } = req.params;
  const subject = await Subject.findById(id);
  res.render("subjects/edit.ejs", { subject });
});

// add new route
router.get("/new", isLoggedIn, isAdmin, (req, res) => {
  res.render("subjects/new.ejs");
});

// create route
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  const { subject } = req.body;
  const newSubject = new Subject(subject);
  await newSubject.save();
  console.log("new subject saved");
  req.flash("success", "New subject has been created!");
  res.redirect("/subjects");
});

// update the subject route
router.put("/:id", isLoggedIn, isAdmin, async (req, res) => {
  let { id } = req.params;
  await Subject.findByIdAndUpdate(id, { ...req.body.subject });
  req.flash("success", "Subject info updated!");
  res.redirect("/subjects");
});

module.exports = router;
