const db = require("../db/connection");

const { fetchTopicBySlug } = require("./topics_model");

exports.fetchArticles = (topic, sort_by, order) => {
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  
  COUNT(comments.comment_id)::INT
  AS comment_count 
  FROM articles
  LEFT JOIN comments
  ON articles.article_id=comments.article_id
  `;
  const queryParams = [];
  if (topic !== undefined) {
    queryString += ` WHERE topic = $1`;
    queryParams.push(topic);
  }
  let orderBy = `created_at`;
  if (!!sort_by) {
    if (
      ![
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
      ].includes(sort_by)
    ) {
      return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
    }
    orderBy = sort_by;
  }
  let orderDirection = `desc`;

  if (!!order) {
    if (!["asc", "desc"].includes(order)) {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
    orderDirection = order;
  }

  queryString += ` GROUP BY articles.article_id
      ORDER BY articles.${orderBy} ${orderDirection}`;

  return db.query(queryString, queryParams).then(({ rows }) => {
    if (!!topic && rows.length === 0) {
      // no results has been found for a given topic.
      // check if such topic exists at all
      return fetchTopicBySlug(topic).then(() => {
        return Promise.reject({
          status: 404,
          msg: "no articles for this topic found",
        });
      });
    }

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

exports.updatedArticleVotes = (article_id, inc_votes) => {
  if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: inc_votes is required and must be a number",
    });
  }
  return this.fetchArticleById(article_id).then((article) => {
    if (inc_votes + article.votes < 0) {
      return Promise.reject({
        status: 404,
        msg: "article.votes can not be a negative number",
      });
    }
    return db
      .query(
        `
   UPDATE articles
   SET votes = votes + $1
   WHERE article_id = $2
   RETURNING *`,
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
