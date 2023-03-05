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
  test("201: POST responds with the posted comment if extra properties are provided on the request body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Interesting point of view, but I haven't read it",
      xxx: "kjkjk",
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

  test("404: POST responds with right message when article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Interesting point of view, but I haven't read it",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: this article does not exist");
      });
  });

  test("404: POST responds with right message when user does not exist", () => {
    const newComment = {
      username: "london_bridge",
      body: "Interesting point of view, but I haven't read it",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: this user does not exist");
      });
  });

  test("400: POST invalid article id", () => {
    const newComment = {
      username: "london_bridge",
      body: "Interesting point of view, but I haven't read it",
    };
    return request(app)
      .post("/api/articles/invali_article_ID/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article id");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: PATCH responds with the correct keys", () => {
    const incVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          article_img_url: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test("200: PATCH responds with the updated article", () => {
    const incVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 101,
        });
      });
  });

  test("200: PATCH responds with the updated article if extra properties are provided on the request body", () => {
    const incVotes = {
      inc_votes: 1,
      bodytext: "Hello world",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 101,
        });
      });
  });

  test("400: PATCH when inc_votes is not a number", () => {
    const incVotes = {
      inc_votes: "abs",
    };
    return request(app)
      .patch("/api/articles/2")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: inc_votes is required and must be a number"
        );
      });
  });

  test("200: PATCH responds with the updated article if inc_votes is a negative number", () => {
    const incVotes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 0,
        });
      });
  });

  test("400: PATCH responds with right message when inc_votes is missing", () => {
    const incVotes = {};
    return request(app)
      .patch("/api/articles/2")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request: inc_votes is required and must be a number"
        );
      });
  });

  test("404: PATCH responds with right message when article.votes would become a negative number", () => {
    const incVotes = {
      inc_votes: -1000,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article.votes can not be a negative number");
      });
  });
  test("404: PATCH responds with right message when article doesn't exist", () => {
    const incVotes = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/9999")
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article with this id does not exist");
      });
  });
});

describe("/api/users", () => {
  test("200: GET responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("200: accepts a topic querie", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });

  test("200: accepts a topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });

  test("200: GET responds with array of articles objects when accepts a topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });

  test.only("404: GET responds with a valid message when topic is not in the database", () => {
    return request(app)
      .get("/api/articles?topic=notindatabase")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("this topic does not exist");
      });
  });

  test.only("404: GET responds when topic exists in the database, but does not have any articles associated with it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no articles for this topic found");
      });
  });
});
