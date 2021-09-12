const passport = require("passport");
const { HttpCode } = require("../helpers/constants");
const guard = require("../helpers/guard");

describe("Unit test - guard middleware", () => {
  const user = { token: "1234567890" };
  const req = { get: jest.fn((header) => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  test("Invalid token", () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => {
        cb(null, { token: "1234" });
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  test("No token (user doesn't exist)", () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => {
        cb(null, false);
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  test("Valid token (user exists)", () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => {
        cb(null, user);
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
