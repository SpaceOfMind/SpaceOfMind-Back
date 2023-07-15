const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middleware");
const authCtrls = require("./auth.ctrl");
const auth = express.Router();

auth.use((req, res, next) => {
  console.log("API for auth");
  next();
});

auth.post("/login", isNotLoggedIn, authCtrls.login);
auth.post("/signUp", isNotLoggedIn, authCtrls.signUp);
auth.get("/isLogined", (req, res, next) => {
  res.json(JSON.stringify(req.user));
});

auth.get("/logout", isLoggedIn, authCtrls.logout);

module.exports = auth;
