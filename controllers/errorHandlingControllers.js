exports.handle404BadPath = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid article id" });
  } else {
    next(err);
  }
};

exports.handle500Error = (err, req, res, next) => {
  res.status(500).send({ msg: "Something has gone wrong on the server" });
};
