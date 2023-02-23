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
