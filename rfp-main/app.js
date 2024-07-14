// requiring packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const flatpickr = require("flatpickr");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

// model requirement
const User = require("./models/user.js");

// setting up ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

// sessions
const sessionOptions = {
  secret: "AnanyaTheGreatestAuror",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//defining locals which can be used anywhere
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUserStatus = req.user;

  console.log(res.locals.success);
  next();
});

// routing
const teacherRouter = require("./routes/teacher.js");
const subjectRouter = require("./routes/subject.js");
const timetableRouter = require("./routes/timetable.js");
const findfacultyRouter = require("./routes/findfaculty.js");
const departmentRouter = require("./routes/department.js");
const userRouter = require("./routes/user.js");

// mongodb
const PORT = 8080;
const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connection to db established");
  })
  .catch((err) => {
    console.log("error while connecting to database");
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// //subject routes
app.use("/subjects", subjectRouter);

// //timetable routes
app.use("/timetables", timetableRouter);

// // teachers routes
app.use("/teachers", teacherRouter);

// // findfaculty routes
app.use("/findfaculty", findfacultyRouter);

// // department routes
app.use("/departments", departmentRouter);

// // user routes
app.use("/", userRouter);

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    username: "teacher1",
    role: "teacher",
  });
  let registeredUser = await User.register(fakeUser, "teacher");
  console.log(registeredUser);
  res.render("main/home.ejs");
});

app.get("/", (req, res) => {
  res.render("main/home.ejs");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
