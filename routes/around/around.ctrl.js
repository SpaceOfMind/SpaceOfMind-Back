const around = require(".");
const Around = require("../../database/models/around");
const User = require("../../database/models/user");

// // test용 API
// exports.postInfoTest = async (req, res) => {
//   try {
//     console.log("postInfoTest logic");
//     const { userId, aroundCode, orbitId, content } = req.body;
//     const user = await User.findOne({ where: { userId } });

//     if (user == null) {
//       res.status(401);
//       return res.json(JSON.stringify({ result: "User id does not exists" }));
//     }

//     await Around.create({ userId, aroundCode, orbitId, content });

//     res.set("Content-Type", "text/plain");
//     return res.status(200).send("Posting New Around Success!");
//   } catch (err) {
//     console.error(err);
//     return next(err);
//   }
// };

// // test용 API
// exports.getInfoTest = async (req, res) => {
//   console.log("getInfoTest logic");
//   const id = req.query.aroundId;
//   console.log("require informaion of id: ", id);
//   const result = await Around.findOne({ where: { aroundId: id } });
//   return res.json(JSON.stringify(result));
// };


// GET
exports.getInfo = async (req, res) => {

  console.log("[aroundCtrl] get logic");
  const userId = req.query.userId;
  console.log("require info of userId: ", userId);
  
  try {

    const result = await Around.findAll({ where: { userId: userId}});
    return res.json({ result: "success", userId: userId, arounds: result });
  
  } catch (error) {
    
    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });
  
  }
  
};

// POST
exports.postInfo = async (req, res) => {

  console.log("[aroundCtrl] post logic");

  try {

    const { userId, aroundCode, orbitId, content } = req.body;
    const user = await User.findOne({ where: { userId } });

    if (user == null) {
      return res.status(401).json({ result: "fail", error: "UserId does not exist" });
    }

    await Around.create({ userId, aroundCode, orbitId, content });
    res.set('Content-Type', 'application/json');
    return res.status(200).json({ result: "success" });
    
  } catch (error) {
    
    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });

  }
};

// DELETE
exports.deleteInfo = async (req, res) => {

  console.log("[aroundCtrl] delete logic");

  try {
    const aroundId = req.query.aroundId;

    // Check if the around object exists
    const around = await Around.findOne({ where: { aroundId: aroundId } });
    if (around == null) {
      return res.status(401).json({ result: "fail", error: "AroundId does not exist" });
    }

    // Delete the information
    const result = await Around.destroy({ where: { aroundId: aroundId } });

    if (result === 0) {
      return res.status(404).json({ result: "fail", error: "Information not found" });
    }

    return res.status(200).json({ result: "success" });

  } catch (error) {

    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });
  
  }

};

// PATCH
exports.patchInfo = async (req, res) => {

  console.log("[aroundCtrl] patch logic");

  try {
    const { aroundId, newOrbitId } = req.body;

    // Check if the around object exists
    const around = await Around.findOne({ where: { aroundId } });
    if (around == null) {
      return res.status(401).json({ result: "fail", error: "AroundId does not exist" });
    }

    // Update the orbitId
    await Around.update({ orbitId: newOrbitId }, { where: { aroundId } });

    return res.status(200).json({ result: "success" });

  } catch (error) {

    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });
  
  }
};