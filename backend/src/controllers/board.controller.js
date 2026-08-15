const boardService = require("../services/board.service");

function getBoard(req, res) {
  try {
    const boardId = Number(req.params.id);

    if (!Number.isInteger(boardId) || boardId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    const board = boardService.getBoardById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    console.error("Get board error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch board",
    });
  }
}

module.exports = {
  getBoard,
};