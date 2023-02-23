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
        expect(body.article.article_id).toEqual(3);
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
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
  test("404: GET valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/112229")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article with this id does not exist");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200: GET an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(2);
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("article_id", 9);
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
        });
      });
  });

  test("404: GET status code 404 if article doesn't exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article with this id does not exist");
      });
  });

  test("400: GET responds with right message when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalidID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article id");
      });
  });

  test("200:GET the comments are sorted by created_at", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body;
        const commentsCopy = [...comments];
        const sortedComments = commentsCopy.sort((commentA, commentB) => {
          return commentB.created_at - commentA.created_at;
        });
        expect(comments).toEqual(sortedComments);
      });
  });

  test("200: GET return 200 if it is a valid article_id and no comments found", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
        expect(body).toEqual([]);
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: POST responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Interesting point of view, but I haven't read it",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 6,
            author: newComment.username,
            body: newComment.body,
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("400: POST responds with right message when username or body are empty", () => {
    return request(app)
      .post("/api/articles/6/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: username and body can not be empty"
        );
      });
  });

  test("400: POST responds with right message when article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Interesting point of view, but I haven't read it",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: this article does not exist");
      });
  });

  test("400: POST responds with right message when user does not exist", () => {
    const newComment = {
      username: "london_bridge",
      body: "Interesting point of view, but I haven't read it",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: this user does not exist");
      });
  });
});
