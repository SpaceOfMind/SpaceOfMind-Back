const passport = require("passport");
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");

exports.login = (req, res, next) => {
  console.log("login logic");
  console.log("body seems: ", req.body);

  if (req.body.snsId) {
    req.body = { ...req.body, userPwd: req.body.snsId };
  }

  // TODO: 카카오, google로 로그인할 때, 해당 소셜 메일을 받아와서 email 항목을 채우고
  // sns id를 암호화하여 password 필드를 채움
  // sns 로그인을 시도하는 경우, 해당 sns 계정 이메일 + snsId를 해시화한 password를 통해 local 로그인 시도
  // TODO: 프론트에서 email 수집 동의 항목 추가

  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError); // 에러처리 미들웨어로 보낸다.
    }
    if (!user) {
      res.status(401);
      return res.send();
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      //return res.status(200).redirect("/"); // 세션 쿠키를 브라우저로 전송
      return res.status(201).json({ result: "success", userId: user.userId, planetCode: user.planetCode });
    });
  })(req, res, next);
};

// 랜덤 string 만드는 helper function
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const charOrNum = Math.random() < 0.5 ? chars : nums;
    const randomIndex = Math.floor(Math.random() * charOrNum.length);
    randomString += charOrNum[randomIndex];
  }

  return randomString;
}

async function isPlanetCodeExists(planetCode) {
  const user = await User.findOne({ where: { planetCode }});
  if (user == null) return false;
  else return true;
}

// Function to generate a unique planetCode
async function generateUniquePlanetCode() {
  const planetCodeLength = 3;
  const numberLength = 3;

  let planetCode;

  // Generate a random planetCode
  do {
    const randomFirst = generateRandomString(planetCodeLength);
    const randomSecond = generateRandomString(numberLength);
    planetCode = `${randomFirst}-${randomSecond}`;
  } while (await isPlanetCodeExists(planetCode));

  return planetCode;
}

exports.signUp = async (req, res, next) => {
  console.log("signUp logic");
  const { userEmail, userName, userPwd, snsId, provider, colorCode } =
    req.body;
  try {
    // 기존에 해당 이메일로 가입한 사람이 있나 검사 (중복 가입 방지)
    const exUser = await User.findOne({ where: { userEmail } });
    if (exUser) {
      res.status(401);
      return res.json(JSON.stringify({ result: "email already exists" })); // 에러페이지로 바로 리다이렉트
    }
    // 기존에 해당 snsId로 가입한 사람이 있나 검사 (중복 가입 방지)
    if (snsId && provider) {
      const snsExUser = await User.findOne({ where: { snsId, provider } });
      if (snsExUser) {
        return res.redirect("/signUp?error=exist");
      }
    }

    // local 계정, sns 계정 가입 기록이 모두 없는 경우에만 이후 코드를 실행할 수 있음
    /* local sign up */
    if (snsId == null) {
      // 정상적인 회원가입 절차면 해시화
      const hash = await bcrypt.hash(userPwd, 12);

      // planetCode 생성
      const planetCode = await generateUniquePlanetCode();

      // DB에 해당 회원정보 생성
      await User.create({
        userEmail,
        userName,
        userPwd: hash, // 비밀번호에 해시문자를 넣어준다.
        colorCode,
        planetCode
      });
    } else {
      /* social sign up */
      console.log("sign up with sns");
      const hash = await bcrypt.hash(snsId, 10); // snsId를 local DB에 저장하기 위한 pw로 사용

      // planetCode 생성
      const planetCode = await generateUniquePlanetCode();

      await User.create({
        userEmail, // 유저가 sns에 가입한 email(정보 제공 동의)
        userName,
        userPwd: hash,
        snsId,
        provider,
        colorCode,
        planetCode
      });
    }

    res.status(201);
    res.set("Content-Type", "application/json");
    return res.status(200).json({ result: "success" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.logout = (req, res, next) => {
  // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.session.destroy(); // 로그인 인증 수단으로 사용한 세션쿠키를 지우고 파괴한다. 세션쿠키가 없다는 말은 즉 로그아웃 인 말.
      res.set("Content-Type", "application/json");
      return res.status(200).json({ result: "success" });
    }
  });
};
