function handleCustomErrors(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
}

function handlePsqlErrors(err, req, res, next) {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad request" });
      break;
    case "23503":
      res.status(400).send({ msg: "Empty user!" });
      break;
  }
  next(err);
}

function handleServerErrors(err, req, res, next) {
  res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors };
