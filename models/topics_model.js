const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchTopicBySlug = (slug) => {
  let queryString = `SELECT * FROM topics where slug=$1 LIMIT 1`;

  return db.query(queryString, [slug]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "topic with this slug does not exist",
      });
    }
    return result.rows[0];
  });
};
