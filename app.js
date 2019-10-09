const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const app = express();

// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Import Passport config file
require("./config/passport")(passport);

// Db Config
const db = require("./config/database");

// Make database connection
mongoose
  .connect(db.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  // Promise retuned
  .then(() => console.log("Mongo DB connected..."))
  .catch(err => console.log(err));

// Use static folder
app.use(express.static(path.join(__dirname, "public")));

// Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

// Set view engine to Handlebars.js
app.set("view engine", "handlebars");

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Method override middleware
app.use(methodOverride("_method"));

// Express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Index route
app.get("/", (req, res) => {
  const title = "Welcome to Scribble";
  res.render("index", {
    title: title
  });
});

// About route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use route
app.use("/ideas", ideas);
app.use("/users", users);

// App listening ..
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
