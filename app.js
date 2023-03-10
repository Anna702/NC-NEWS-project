const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const { getTopics } = require("./controllers/topics_controller");

const { getEndpoints } = require("./controllers/api_controller");

const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("./controllers/articles_controller");

const {
  getCommentsByArticle,
  postComments,
  deleteComments,
} = require("./controllers/comments_controller");

const { getUsers } = require("./controllers/users_controller");

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

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComments);

app.get("/api", getEndpoints);

app.all("*", handle404BadPath);
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;
