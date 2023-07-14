const express = require("express");
const aroundCtrl = require("./around.ctrl");
const around = express.Router();

around.use((req, res, next) => {
  console.log("API for around");
  next();
});

around.get("/getInfoTest", aroundCtrl.getInfoTest);
around.post("/postInfoTest", aroundCtrl.postInfoTest);

module.exports = around;
