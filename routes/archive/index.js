const express = require("express");
const archiveCtrl = require("./archive.ctrl");
const archive = express.Router();

archive.use((req, res, next) => {
  console.log("API for archive");
  next();
});

// TODO: archive, away 플래그 구분에서 따로 가져오는 로직 구현
// get, post, delete, patch에 대해 전부 구현하기
// 진짜 삭제 vs. 부족해서 삭제

// TODO: around만 가져오기 vs. away만 가져오기

archive.get("/getAround", archiveCtrl.getAround);
archive.get("/getAway", archiveCtrl.getAway);
archive.get("/getAll", archiveCtrl.getAll);

archive.post("/postInfo", archiveCtrl.postInfo);
archive.delete("/deleteInfo", archiveCtrl.deleteInfo);
archive.patch("/patchInfo", archiveCtrl.patchInfo);

module.exports = archive;
