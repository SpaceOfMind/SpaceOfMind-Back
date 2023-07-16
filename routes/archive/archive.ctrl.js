const Archive = require("../../database/models/archive");
const User = require("../../database/models/user");

// GET around
exports.getAround = async (req, res) => {
  console.log("[archiveCtrl] get around logic");
  const userId = req.query.userId;
  console.log("require info of userId: ", userId);

  try {
    const result = await Archive.findAll({
      attributes: ["colorCode", "orbitId", "title", "content"],
      where: { userId: userId, isAround: true },
    });
    return res.json({ result: "success", userId: userId, arounds: result });
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res
      .status(500)
      .json({ result: "fail", error: "Internal server error" });
  }
};

// GET away
exports.getAway = async (req, res) => {
  console.log("[archiveCtrl] get away logic");
  const userId = req.query.userId;
  console.log("require info of userId: ", userId);

  try {
    const result = await Archive.findAll({
      attributes: ["colorCode", "orbitId", "title", "content"],
      where: { userId: userId, isAround: false },
    });
    return res.json({ result: "success", userId: userId, aways: result });
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res
      .status(500)
      .json({ result: "fail", error: "Internal server error" });
  }
};

// POST archive
exports.postInfo = async (req, res) => {
  console.log("[archiveCtrl] post logic");

  try {
    const { userId, colorCode, orbitId, title, content, isAround } = req.body;
    const user = await User.findOne({ where: { userId } });

    if (user == null) {
      return res
        .status(401)
        .json({ result: "fail", error: "UserId does not exist" });
    }

    await Archive.create({
      userId,
      colorCode,
      orbitId,
      title,
      content,
      isAround,
    });
    res.set("Content-Type", "application/json");
    return res.status(200).json({ result: "success" });
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res
      .status(500)
      .json({ result: "fail", error: "Internal server error" });
  }
};

// DELETE
exports.deleteInfo = async (req, res) => {
  console.log("[archiveCtrl] delete logic");

  try {
    const archiveId = req.query.archiveId;

    // Check if the archive object exists
    const archive = await Archive.findOne({ where: { archiveId } });
    if (archive == null) {
      return res
        .status(401)
        .json({ result: "fail", error: "ArchiveId does not exist" });
    }

    // Delete the information
    const result = await Archive.destroy({ where: { archiveId } });

    if (result === 0) {
      return res
        .status(404)
        .json({ result: "fail", error: "Information not found" });
    }

    return res.status(200).json({ result: "success" });
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res
      .status(500)
      .json({ result: "fail", error: "Internal server error" });
  }
};

// PATCH
exports.patchInfo = async (req, res) => {
  console.log("[archiveCtrl] patch logic");

  try {
    const { archiveId, newOrbitId } = req.body;

    // Check if the archive object exists
    const archive = await Archive.findOne({ where: { archiveId } });
    if (archive == null) {
      return res
        .status(401)
        .json({ result: "fail", error: "ArchiveId does not exist" });
    }

    // Update the orbitId
    await Archive.update({ orbitId: newOrbitId }, { where: { archiveId } });

    return res.status(200).json({ result: "success" });
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res
      .status(500)
      .json({ result: "fail", error: "Internal server error" });
  }
};

// getAll
exports.getAll = async (req, res) => {
  //TODO: getAll 로직 구현
  // 1. `archive`와 `away` union
  // 2. `createdAt`으로 order
  // 3. paging 적용해서 query String 기준으로 잘라옴

  console.log("[archiveCtrl] get all logic");
  const userId = req.query.userId;
  console.log("require info of userId: ", userId);

  try {
    const result = await Archive.findAll({
      attributes: ["createdAt", "title", "content", "isAround"],
      where: { userId: userId },
      order: ["createdAt"],
    });
    return res.json({ result: "success", userId: userId, archives: result });
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res
      .status(500)
      .json({ result: "fail", error: "Internal server error" });
  }
};
