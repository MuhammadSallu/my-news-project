const express = require("express");
const app = express();
const { getTopics } = require("./controller/app.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Endpoint not found!" });
});

module.exports = app;
