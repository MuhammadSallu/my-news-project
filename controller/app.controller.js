const {
  selectTopics,
  readAll,
  selectArticleById,
  selectArticles,
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
  selectArticleById(article_id)
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
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

module.exports = { getTopics, getAll, getArticleById, getArticles };
