const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/data/test-data");
const app = require("../app");
const connection = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => {
  return connection.end();
});

describe("/api/incorrect_path", () => {
  test("404: GET responds with correct message for route that does not exist", () => {
    return request(app)
      .get("/api/incorrect_path")
      .expect(404)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("/api/topics", () => {
  test("200: GET responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBeGreaterThan(0);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("/api/articles", () => {
  test("200: GET array of articles with the total count of all the comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
});
