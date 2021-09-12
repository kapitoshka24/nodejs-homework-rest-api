const multer = require("multer");
const { HttpCode } = require("./constants");
require("dotenv").config();
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, UPLOAD_DIR);
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.includes("image")) {
      return callback(null, true);
    }
    const error = new Error("Wrong format");
    error.status = HttpCode.BAD_REQUEST;
    callback(error);
  },
});

module.exports = upload;
