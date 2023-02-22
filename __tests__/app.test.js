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
        expect(body.articles.length).toBe(12);
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
  test("200, GET, the default order of the data is descending order of the created_at column", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const articlesCopy = [...articles];
        const sortedArticles = articlesCopy.sort((articteA, articleB) => {
          return articleB.created_at - articteA.created_at;
        });
        expect(articles).toEqual(sortedArticles);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200: GET responds with a single article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: GET invalid article id", () => {
    return request(app)
      .get("/api/articles/invali_article_ID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article id");
      });
  });
  test.only("404: GET valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/112229")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article with this id does not exist");
      });
  });
});
