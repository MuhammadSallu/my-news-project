const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

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
