const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
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
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getAll);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);
app.get("/api/articles?topic=:topic", getArticles);
app.get("/api/articles/:article_id?:comment_count", getArticleById);
app.post("/api/articles/:article_id/comments", addCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleVotesById);
app.delete("/api/comments/:comment_id", removeCommentById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Endpoint not found!" });
});

module.exports = app;
