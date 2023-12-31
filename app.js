var createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const db = require("./database/models/index");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./database/models");

const indexRouter = require("./routes");
const passportConfig = require("./passport");

const app = express();
passportConfig();

// 세션 설정
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: `${process.env.COOKIE_SECRET}`,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// // express 서버 포트 지정
// app.set("port", 443);
// bin/www에서 포트를 설정하므로 여기서 설정할 필요 없음

// express의 미들웨어 설정
//request에 대한 로그를 기록하는 미들웨어
app.use(logger("dev"));

// CORS 전부 오픈
app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: false,
      secure: false,
    },
  })
);

// static 파일을 접근할 수 있도록 해주는 미들웨어
app.use(express.static(path.join(__dirname, "public")));

// request 본문 해석용 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// request의 쿠키를 해석해주는 미들웨어
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

// passport 설정
app.use(passport.initialize());
app.use(passport.session());

// index router
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 전역적인 error handler
app.use(function (err, req, res, next) {
  console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// sequelize 연결 시도
db.sequelize
  .sync({ force: false }) // true 로 설정하면 서버 실행마다 테이블 재생성(현재 생성되어있으므로 false)
  .then(() => {
    console.log("데이터베이스 연결 성공!");
  })
  .catch((err) => {
    console.error(err);
  });

// 서버 설정
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중입니다.");
});

module.exports = app;
