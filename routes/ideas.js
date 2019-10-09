const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");


// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea index page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Add journal entry form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// Edit entry form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/ideas");
      } else {
        res.render("ideas/edit", {
          idea: idea
        });
      }
    });
});
// Process form
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];
  // Handle errors
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please write in your journal before submitting" });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id

    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash("success_msg", "New journal entry added")
        res.redirect("/ideas");
        console.log(req.body)
      });
  }
});

// Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // New values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash("success_msg", "Journal entry updated")
        res.redirect("/ideas");
      });
  });
});

// Delete idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Journal entry deleted")
      res.redirect("/ideas")
    });
});





module.exports = router;