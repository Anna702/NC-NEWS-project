exports.handle404BadPath = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid article id" });
  } else if (err.code == "23503") {
    switch (err.constraint) {
      case "comments_article_id_fkey":
        res
          .status(404)
          .send({ msg: "Bad request: this article does not exist" });
        break;
      case "comments_author_fkey":
        res.status(404).send({ msg: "Bad request: this user does not exist" });
    }
  } else {
    next(err);
  }
};

exports.handle500Error = (req, res, next) => {
  res.status(500).send({ msg: "Something has gone wrong on the server" });
};
