const express = require("express");

const boardController = require("../controllers/board.controller");

const router = express.Router();

router.get("/:id", boardController.getBoard);

module.exports = router;