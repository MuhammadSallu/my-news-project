const { selectTopics, readAll } = require("../model/app.model");

const getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

const getAll = (req, res, next) => {
  readAll().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};

module.exports = { getTopics, getAll };
