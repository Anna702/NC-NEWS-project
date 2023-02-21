const { fetchArticles } = require("../models/articles_model");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      console.log(articles) * res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
