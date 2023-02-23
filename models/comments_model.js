const db = require("../db/connection");
const {
  fetchCommentsByArticle,
  fetchArticleById,
} = require("./articles_model");

exports.fetchCommentsByArticle = (article_id) => {
  let queryString = `SELECT *
    FROM comments`;
  const queryParams = [];
  if (article_id !== undefined) {
    queryString += ` WHERE article_id = $1`;
    queryParams.push(article_id);
  }
  queryString += " ORDER BY created_at DESC";

  return fetchArticleById(article_id).then(() => {
    return db.query(queryString, queryParams).then((result) => {
      return result.rows;
    });
  });
};

exports.addComments = (article_id, newComment) => {
  const { username, body } = newComment;

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: username and body can not be empty",
    });
  }
  return db
    .query(
      `
INSERT INTO comments 
(article_id, author, body)
VALUES ($1, $2, $3)
RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
