const {
  fetchCommentsByArticle,
  addComments,
  deleteCommentById,
} = require("../models/comments_model");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  addComments(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then((comment) => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
