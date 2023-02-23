const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controller");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles_controller");
const {
  getCommentsByArticle,
  postComments,
} = require("./controllers/comments_controller");
const {
  handle404BadPath,
  handleCustomErrors,
  handle500Error,
} = require("./controllers/errorHandlingControllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postComments);

app.all("*", handle404BadPath);
app.use(handleCustomErrors);
app.use(handle500Error);
module.exports = app;
