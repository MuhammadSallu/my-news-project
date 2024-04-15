const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

const readAll = () => {
  return Promise.resolve(endpoints).then((result) => {
    return result;
  });
};

module.exports = { selectTopics, readAll };
