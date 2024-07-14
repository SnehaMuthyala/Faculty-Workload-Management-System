module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to access that!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    req.flash("error", "Only teachers can access that!");
    return res.redirect("/");
  }
  next();
};

module.exports.isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    req.flash("error", "Only students can access that!");
    return res.redirect("/");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    req.flash("error", "Only admins can access that!");
    return res.redirect("/");
  }
  next();
};

module.exports.isTeacherOrAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "teacher") {
    req.flash("error", "Only teachers and admins can access that!");
    return res.redirect("/");
  }
  next();
};
