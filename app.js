const crypto = require('crypto');
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

require("./src/db/conn");
const Register = require("./src/models/register");
const UserProfile = require("./src/models/userinfo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const auth = require("./src/middleware/auth");

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partial_path = path.join(__dirname, "./templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

hbs.registerHelper('defaultIfUndefined', function(value, defaultValue) {
  return value || defaultValue;
});

hbs.registerHelper("isActive", (currentPath, linkPath) => {
  return currentPath === linkPath ? "active" : "";
});

// Middleware to set user in locals for all routes
app.use(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
      const user = await Register.findOne({ _id: verifyUser._id });
      req.user = user;
      res.locals.user = user; // pass user info to templates
    } catch (error) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

// app.get("/", (req, res) => {
//   res.render("index", { request: req });
//   // res.render("index");
// });

app.get("/", (req, res) => {
  res.render("index", { userData: req.user ? { Username: req.user.Username, Email: req.user.Email } : null });
});


app.get("/secret", auth, (req, res) => {
  try {
    const userData = {
      Username: req.user.Username,
      Email: req.user.Email
    };
    res.render("secret", { userData, request: req });
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

app.get("/recipe", auth, (req, res) => {
  try {
    const token3 = crypto.randomBytes(32).toString('hex');
    res.redirect(`https://kitchen-magic-recipes.onrender.com/?token=${token3}`);
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    res.clearCookie("jwt");
    await req.user.save();
    console.log("logout successfully");
    // res.render("login", { request: req });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Please login first, then logout works.");
  }
});

app.get("/register", (req, res) => {
  res.render("register", { request: req });
  
});

app.get("/login", (req, res) => {
  res.render("login", { request: req });
});

app.post("/register", async (req, res) => {
  try {
    const { Username, Email, Password, Confirmpassword } = req.body;
    if (Password === Confirmpassword) {
      const registration = new Register({ Username, Email, Password, Confirmpassword });
      const registered = await registration.save();
      const token = await registration.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });
      // res.status(201).render("index", { userData: { Username }, request: req });
      res.status(201).redirect("/");
    } else {
      res.send("Password does not match");
    }
  } catch (error) {
    res.status(400).send("This username/ email is already taken !Try another one"+error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const user = await Register.findOne({ Username });
    if (!user) {
      return res.status(404).send("Invalid login detailsI");
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(404).send("Invalid login detailsII");
    }
    const token = await user.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });
    // res.status(201).render("index", { userData: { Username: user.Username, Email: user.Email } });
    res.status(201).redirect("/");
    // res.status(201).render("index", { userData: { Username: user.Username, Email: user.Email }, request: req });
  } catch (error) {
    res.status(400).send("Some Internal Error Occurred");
  }
});




app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
