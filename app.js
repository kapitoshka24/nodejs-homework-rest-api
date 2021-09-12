const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const boolParser = require("express-query-boolean");
const rateLimit = require("express-rate-limit");
const { limiterAPI, HttpCode } = require("./helpers/constants");
const app = express();
require("dotenv").config();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(express.static("public"));
app.get("env") !== "test" && app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use(boolParser());

app.use("/api/", rateLimit(limiterAPI));
app.use("/api/", require("./routes/api"));

app.use((_, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, _) => {
  const status = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  res
    .status(status)
    .json({ status: "fail", code: status, message: err.message });
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = app;
