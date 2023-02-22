const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `
          SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  
          COUNT(comments.comment_id)::INT
          AS comment_count 
          FROM articles
          LEFT JOIN comments
          ON articles.article_id=comments.article_id
          GROUP BY articles.article_id
          ORDER BY articles.created_at desc;
      `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  let queryString = `SELECT * FROM articles`;
  const queryParams = [];
  if (article_id !== undefined) {
    queryString += ` WHERE article_id = $1`;
    queryParams.push(article_id);
  }
  return db.query(queryString, queryParams).then((result) => {
    const article = result.rows[0];
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "article with this id does not exist",
      });
    }
    return article;
  });
};
