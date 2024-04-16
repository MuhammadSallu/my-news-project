const express = require("express");
const app = express();
const {
  getTopics,
  getAll,
  getArticleById,
} = require("./controller/app.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getAll);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad request" });
      break;
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Endpoint not found!" });
});

module.exports = app;
