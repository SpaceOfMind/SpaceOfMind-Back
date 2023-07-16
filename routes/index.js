const express = require("express");

const router = express.Router();
const user = require("./user");
const auth = require("./auth");
const around = require("./around");
const away = require("./away");
const archive = require("./archive");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("기본 홈페이지 요청");
  return res.status(200).render("index", { title: "Express" });
});

router.use("/user", user);
router.use("/auth", auth);
router.use("/around", around);
router.use("/away", away);
router.use("/archive", archive);

module.exports = router;
