const away = require(".");
const Away = require("../../database/models/away");
const User = require("../../database/models/user");


// GET
exports.getInfo = async (req, res) => {

  console.log("[awayCtrl] get logic");
  const userId = req.query.userId;
  console.log("require info of userId: ", userId);
  
  try {

    const result = await Away.findAll({ where: { userId: userId}});
    return res.json({ result: "success", userId: userId, arounds: result });
  
  } catch (error) {
    
    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });
  
  }
  
};

// POST
exports.postInfo = async (req, res) => {

  console.log("[awayCtrl] post logic");

  try {

    const { userId, awayCode, orbitId, content } = req.body;
    const user = await User.findOne({ where: { userId } });

    if (user == null) {
      return res.status(401).json({ result: "fail", error: "UserId does not exist" });
    }

    await Away.create({ userId, awayCode, orbitId, content });
    res.set('Content-Type', 'application/json');
    return res.status(200).json({ result: "success" });
    
  } catch (error) {
    
    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });

  }
};

// DELETE
exports.deleteInfo = async (req, res) => {

  console.log("[awayCtrl] delete logic");

  try {
    const awayId = req.query.awayId;

    // Check if the away object exists
    const away = await Away.findOne({ where: { awayId } });
    if (away == null) {
      return res.status(401).json({ result: "fail", error: "AwayId does not exist" });
    }

    // Delete the information
    const result = await Away.destroy({ where: { awayId } });

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

  console.log("[awayCtrl] patch logic");

  try {
    const { awayId, newOrbitId } = req.body;

    // Check if the away object exists
    const away = await Away.findOne({ where: { awayId } });
    if (away == null) {
      return res.status(401).json({ result: "fail", error: "AwayId does not exist" });
    }

    // Update the orbitId
    await Away.update({ orbitId: newOrbitId }, { where: { awayId } });

    return res.status(200).json({ result: "success" });

  } catch (error) {

    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ result: "fail", error: "Internal server error" });
  
  }
};