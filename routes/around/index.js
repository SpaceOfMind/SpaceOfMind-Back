const express = require("express");
const aroundCtrl = require("./around.ctrl");
const around = express.Router();

around.use((req, res, next) => {
  console.log("API for around");
  next();
});

// test용 API
// around.get("/getInfoTest", aroundCtrl.getInfoTest);
// around.post("/postInfoTest", aroundCtrl.postInfoTest);

around.get("/getInfo", aroundCtrl.getInfo);
around.post("/postInfo", aroundCtrl.postInfo);
around.delete("/deleteInfo", aroundCtrl.deleteInfo);
around.patch("/patchInfo", aroundCtrl.patchInfo);

module.exports = around;
