const fs = require("fs");

exports.getEndpoints = (req, res, next) => {
  fs.readFile("endpoints.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send({ msg: "Cannot read endpoints. Try later" });
      return;
    }
    res
      .status(200)
      .set("Content-Type", "application/json; charset=utf-8")
      .send(data);
  });
};
