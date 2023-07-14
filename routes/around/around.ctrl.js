const Around = require("../../database/models/around");
const User = require("../../database/models/user");

// test용 API
exports.postInfoTest = async (req, res) => {
  try {
    console.log("postInfoTest logic");
    const { userId, aroundCode, orbitId, content } = req.body;
    const user = await User.findOne({ where: { userId } });

    if (user == null) {
      res.status(401);
      return res.json(JSON.stringify({ result: "User id does not exists" }));
    }

    await Around.create({ userId, aroundCode, orbitId, content });

    res.set("Content-Type", "text/plain");
    return res.status(200).send("Posting New Around Success!");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// test용 API
exports.getInfoTest = async (req, res) => {
  console.log("getInfoTest logic");
  const id = req.query.aroundId;
  console.log("require informaion of id: ", id);
  const result = await Around.findOne({ where: { aroundId: id } });
  return res.json(JSON.stringify(result));
};
