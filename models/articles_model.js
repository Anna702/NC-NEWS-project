const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `
          SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url,  
          COUNT(c.comment_id)::INT
          AS comment_count 
          FROM articles a
          LEFT JOIN comments c
          ON a.article_id=c.article_id
          GROUP BY a.article_id
          ORDER BY a.created_at desc;
      `
    )
    .then(({ rows }) => {
      return rows;
    });
};
