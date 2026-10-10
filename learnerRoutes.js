const express = require("express");
const router = express.Router();

const learnerController = require("../controllers/learnerController");

// GET /api/learner/missions?moduleId=...
router.get("/missions", learnerController.getMissions);

module.exports = router;
