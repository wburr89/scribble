module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "You are not authorized to view this page, please log in");
    res.redirect("/users/login")
  }
}