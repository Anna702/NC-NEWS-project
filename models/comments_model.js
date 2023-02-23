const db = require("../db/connection");

exports.fetchCommentsByArticle = (article_id) => {
  let queryString = `SELECT *
    FROM comments`;
  const queryParams = [];
  if (article_id !== undefined) {
    queryString += ` WHERE article_id = $1`;
    queryParams.push(article_id);
  }
  queryString += " ORDER BY created_at DESC";
  return db
    .query(queryString, queryParams)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments found",
        });
      }
      return result.rows;
    })
    .then((rows) => {
      return rows;
    });
};
