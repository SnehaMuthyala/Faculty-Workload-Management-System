const express = require("express");
const router = express.Router();

const Subject = require("../models/subject.js");
const Timetable = require("../models/timetable.js");

//timetable routes
// show timetables
router.get("/", async (req, res) => {
  const timetableList = await Timetable.find({}).populate(
    "Monday Tuesday Wednesday Thursday Friday Saturday"
  );
  console.log(timetableList);
  res.render("timetables/index.ejs", { timetableList });
});

// edit timetable
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const timetable = await Timetable.findById(id).populate(
    "Monday Tuesday Wednesday Thursday Friday Saturday"
  );
  const subjects = await Subject.find({});
  res.render("timetables/edit.ejs", { timetable, subjects });
});

// update timetable
router.put("/:id", async (req, res) => {
  let { id } = req.params;
  await Timetable.findByIdAndUpdate(id, { ...req.body.timetable });
  res.redirect("/timetables");
});

// new timetable
// get new route
router.get("/new", async (req, res) => {
  const subjects = await Subject.find({});
  res.render("timetables/new.ejs", { subjects });
});

// post or create new timetable
router.post("/", async (req, res) => {
  const timetable = new Timetable(req.body.timetable);
  await timetable.save();
  res.redirect("/teachers");
});

module.exports = router;
