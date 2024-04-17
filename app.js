const express = require("express");
const app = express();
const {
  getTopics,
  getAll,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  addCommentByArticleId,
  patchArticleVotesById,
  removeCommentById,
  getAllUsers,
} = require("./controller/app.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getAll);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);
app.post("/api/articles/:article_id/comments", addCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleVotesById);
app.delete("/api/comments/:comment_id", removeCommentById);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad request" });
      break;
    case "23503":
      res.status(400).send({ msg: "Empty user!" });
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
