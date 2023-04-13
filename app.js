require("dotenv").config();
require("./database/database").connect();
const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("./models/user");
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Codespaces OP!</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
      res.status(400).send("Invalid Data");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) res.status(401).send("User Already Exist!");

    const encPassword = await bycrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encPassword,
    });

    const token = jwt.sign({ id: user._id, email }, "secret", {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined;

    res.status(201).send(user);
  } catch (error) {
    console.log("Error!");
    res.status(500).send("Something went wrong");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) res.status(400).send("Invalid data!");

    const user = await User.findOne({ email });
    if (user && bycrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, email }, "secret", {
        expiresIn: "2h",
      });
      // send token in user cookie
      user.token = token;
      user.password = undefined;

      const maxAge = 1000 * 60 * 60 * 24 * 3;
      const options = {
        maxAge,
        httpOnly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }
  } catch (error) {
    console.log("Error!");
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

app.get("/dashboard", auth, (req, res) => {
    console.log(req.user)
  res.send("Welcome to Dashboard!");
});

module.exports = app;
