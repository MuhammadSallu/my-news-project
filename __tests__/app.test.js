const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

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
        console.log(response.body.articles);
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
