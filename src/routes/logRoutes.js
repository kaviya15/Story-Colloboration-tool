const router = require("express").Router();
const {
  addLogsController,
  getLogsController,
} = require("../controllers/logController");

router.post("/addLogs", addLogsController);
router.get("/", getLogsController);

module.exports = router;
