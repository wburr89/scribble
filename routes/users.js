const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Load user model
require("../models/User");
const User = mongoose.model("users");

// User login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// New user registration
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Login form post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    // If login is successful
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Register form POST
router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords Do Not Match" });
  }

  if (req.body.password.length < 5) {
    errors.push({ text: "Password must at least be 5 characters" });
  }
  // Check for errors
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // Encrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login, Let's start writing!"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out");
  res.redirect("/users/login");
});
module.exports = router;
