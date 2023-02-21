const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controller");
const { getArticles } = require("./controllers/articles_controller");
const { handle404BadPath } = require("./controllers/errorHandlingControllers");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("*", handle404BadPath);

module.exports = app;
