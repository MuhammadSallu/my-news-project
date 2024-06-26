const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
let checkArticle;
const selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

const checkArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        checkArticle = false;
      } else checkArticle = true;
      return checkArticle;
    });
};

const selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*,
      COUNT(comments.article_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON comments.article_id = $1
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
  //   return db
  //     .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
  //     .then(({ rows }) => {
  //       if (!rows.length) {
  //         return Promise.reject({
  //           status: 404,
  //           msg: "Article doesn't exist!",
  //         });
  //       }
  //       return rows[0];
  //     });
};

const selectArticles = (topic) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.article_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.topic = $1 OR $1::VARCHAR IS NULL
      GROUP BY articles.article_id
      ORDER BY articles.created_at desc;`,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at desc;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const postCommentByArticleId = (article_id, userObj) => {
  const user = userObj.username;
  const body = userObj.body;
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [user, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticleVotesById = (article_id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const deleteCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [id])
    .then(({ rows }) => {
      return rows;
    });
};

const selectAllUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  postCommentByArticleId,
  updateArticleVotesById,
  deleteCommentById,
  selectAllUsers,
  checkArticleById,
  checkArticle,
};
