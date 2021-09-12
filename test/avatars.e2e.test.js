const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const fs = require("fs/promises");
const { HttpCode } = require("../helpers/constants");
const db = require("../model/db");
const User = require("../model/user");
const { newTestUser } = require("./data/data");
const users = require("../repositories/users");
require("dotenv").config();

describe("Test avatars update", () => {
  let user, token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newTestUser.email });
    user = await User.create(newTestUser);
    const SECRET_KEY = process.env.SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, SECRET_KEY);
    await users.updateToken(user._id, token);
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newTestUser.email });
    await mongo.disconnect();
  });

  it("Upload user avatar", async () => {
    const buf = await fs.readFile("./test/data/photo-test.png");
    const response = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buf, "photo-test.png");
    expect(response.status).toEqual(HttpCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toEqual(
      expect.objectContaining({
        avatarUrl: expect.any(String),
      })
    );
  });

  it("Invalid token uploading user avatar", async () => {
    const buf = await fs.readFile("./test/data/photo-test.png");
    token = "12345";
    const response = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buf, "photo-test.png");
    expect(response.status).toEqual(HttpCode.UNAUTHORIZED);
    expect(response.body).toBeDefined();
  });
});
