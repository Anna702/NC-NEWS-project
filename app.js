const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controller");
const { handle404BadPath } = require("./controllers/errorHandlingControllers");

app.get("/api/topics", getTopics);
app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handle404BadPath);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
