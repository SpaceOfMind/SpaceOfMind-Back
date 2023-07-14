const express = require("express");

const router = express.Router();
const user = require("./user");
const around = require("./around");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("기본 홈페이지 요청");
  return res.status(200).render("index", { title: "Express" });
});

router.use("/user", user);
router.use("/around", around);

module.exports = router;
