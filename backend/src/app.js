const express = require("express");
const cors = require("cors");

require("./database");
const taskRoutes = require("./routes/task.routes");
const boardRoutes = require("./routes/board.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow backend is running",
  });
});

app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
module.exports = app;