const express = require("express");
const awayCtrl = require("./away.ctrl");
const away = express.Router();

away.use((req, res, next) => {
  console.log("API for away");
  next();
});

away.get("/getInfo", awayCtrl.getInfo);
away.post("/postInfo", awayCtrl.postInfo);
away.delete("/deleteInfo", awayCtrl.deleteInfo);
away.patch("/patchInfo", awayCtrl.patchInfo);

module.exports = away;
