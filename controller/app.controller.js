const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  postCommentByArticleId,
  updateArticleVotesById,
  deleteCommentById,
  selectAllUsers,
} = require("../model/app.model");
const endpoints = require("../endpoints.json");

const getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getAll = (req, res, next) => {
  return Promise.resolve(endpoints).then((result) => {
    res.status(200).send({ endpoints: result });
  });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { comment_count } = req.query;
  selectArticleById(article_id, comment_count)
    .then((article) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article doesn't exist!",
        });
      }
      res.status(200).send(article);
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  const { topic } = req.query;
  selectArticles(topic)
    .then((articles) => {
      if (articles.length === 0 && topic) {
        return Promise.reject({
          status: 404,
          msg: "Topic doesn't exist!",
        });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).send({ msg: "No comments found for this article!" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

const addCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const userObj = req.body;
  if (userObj.body.length === 0) {
    res.status(400).send({ msg: "Empty body!" });
  }
  postCommentByArticleId(article_id, userObj)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body.inc_votes;
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ msg: "Bad request" });
  }
  updateArticleVotesById(article_id, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then((result) => {
      if (result.length === 0) {
        res.status(404).send({ msg: "Comment not found!" });
      }
      res.status(204).send();
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send(users);
  });
};

module.exports = {
  getTopics,
  getAll,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  addCommentByArticleId,
  patchArticleVotesById,
  removeCommentById,
  getAllUsers,
};
