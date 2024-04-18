const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const comments = require("../db/data/test-data/comments");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 Sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(testData.topicData.length);
        expect(response.body).toEqual(testData.topicData);
      });
  });
  test("GET:404 Gives a message if endpoint doesn't exist", () => {
    return request(app)
      .get("/api/topivs")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Endpoint not found!");
      });
  });
});

describe("/api", () => {
  test("GET:200 Retrieves a list of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ endpoints });
        expect(typeof response.body).toEqual("object");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 Gets an article from it's id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const articleResultObj = {
          article_id: 2,
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(response.body).toEqual(articleResultObj);
      });
  });
  test("GET:400: If the id is not a valid id type", () => {
    return request(app)
      .get("/api/articles/anarticle")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET:404 If the article id doesn't exist return the correct status and message", () => {
    return request(app)
      .get("/api/articles/123")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 Gets all articles without the body in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 Gets all comments with a given article id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(5);
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });
  test("GET:400 If the id is not a valid id type, return the correct error status", () => {
    return request(app)
      .get("/api/articles/anarticle/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET:404 if the article id doesn't exist returns the correct status and message", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No comments found for this article!");
      });
  });
});

describe("/api/articles/article_id/comments", () => {
  test("POST:201 Adds a comment for an article", () => {
    const userObj = { username: "butter_bridge", body: "This is a comment!" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(userObj)
      .expect(201)
      .then((response) => {
        expect(typeof response.body.comment.comment_id).toBe("number");
        expect(typeof response.body.comment.article_id).toBe("number");
        expect(response.body.comment.author).toBe("butter_bridge");
        expect(response.body.comment.body).toBe("This is a comment!");
        expect(typeof response.body.comment.created_at).toBe("string");
        expect(typeof response.body.comment.votes).toBe("number");
      });
  });
  test("POST: 400 Returns a bad request message if no user is provided", () => {
    const userObj = { username: "", body: "This is a comment!" };
    return request(app)
      .post("/api/articles/5/comments")
      .send(userObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Empty user!");
      });
  });
  test("POST: 400 Returns a bad request message if no body is provided", () => {
    const userObj = { username: "butter_bridge", body: "" };
    return request(app)
      .post("/api/articles/5/comments")
      .send(userObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Empty body!");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH:200 Updates an article's votes with the corresponding id and an object with votes then returns updated article", () => {
    const votesObj = { inc_votes: 15 };
    return request(app)
      .patch("/api/articles/4")
      .send(votesObj)
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(4);
        expect(typeof response.body.article.title).toBe("string");
        expect(typeof response.body.article.topic).toBe("string");
        expect(typeof response.body.article.author).toBe("string");
        expect(typeof response.body.article.body).toBe("string");
        expect(typeof response.body.article.created_at).toBe("string");
        expect(typeof response.body.article.article_img_url).toBe("string");
        expect(response.body.article.votes).toBe(15);
      });
  });
  test("PATCH:400 Gives 400 code if wrong data type is passed with votes", () => {
    const votesObj = { inc_votes: "ten" };
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400 Gives 400 code if empty object passed", () => {
    const votesObj = {};
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 Returns no content with a 204 code", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:404 Gives a 404 code with an comment not found message", () => {
    return request(app)
      .delete("/api/comments/369")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found!");
      });
  });
  test("DELETE:400 Gives a 400 code with a bad request message", () => {
    return request(app)
      .delete("/api/comments/five")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 Returns an array with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        response.body.forEach((users) => {
          expect(typeof users.username).toBe("string");
          expect(typeof users.name).toBe("string");
          expect(typeof users.avatar_url).toBe("string");
        });
      });
  });
  test("GET:404 Returns an error if path doesn't exist", () => {
    return request(app)
      .get("/api/sresu")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Endpoint not found!");
      });
  });
});

describe("/api/articles?topic=:topic", () => {
  test("GET:200 Gets all topics with matching topics", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("GET:404 Gives an error if given the wrong but valid topic", () => {
    return request(app)
      .get("/api/articles?topic=InvalidTopic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Topic doesn't exist!");
      });
  });
});

describe("/api/articles/:article_id?comment_count", () => {
  test("GET:200 Gets comment count for a certain article by id", () => {
    return request(app)
      .get("/api/articles/5?comment_count=true")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.article_id).toBe("number");
        expect(typeof response.body.author).toBe("string");
        expect(typeof response.body.title).toBe("string");
        expect(typeof response.body.topic).toBe("string");
        expect(typeof response.body.created_at).toBe("string");
        expect(typeof response.body.votes).toBe("number");
        expect(typeof response.body.article_img_url).toBe("string");
        expect(typeof response.body.comment_count).toBe("number");
      });
  });
  test("GET:404 Gives an error if article id is valid but non existent", () => {
    return request(app)
      .get("/api/articles/500?comment_count")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
  test("GET:400 Returns an error if id type is wrong", () => {
    return request(app)
      .get("/api/articles/An_Id?comment_count=true")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
