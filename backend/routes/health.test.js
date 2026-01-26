const request = require("supertest");
const app = require("../app");
const db = require("../db");

describe("GET /healthz", function () {
  afterAll(async function () {
    await db.end();
  });

  test("returns ok if db is reachable", async function () {
    const resp = await request(app).get("/healthz");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ status: "ok" });
  });
});
