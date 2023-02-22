const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controller");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles_controller");
const {
  handle404BadPath,
  handleCustomErrors,
} = require("./controllers/errorHandlingControllers");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", handle404BadPath);
app.use(handleCustomErrors);
module.exports = app;
