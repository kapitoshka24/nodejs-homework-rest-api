const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const gr = require("gravatar");
const { nanoid } = require("nanoid");
const SALT_WORK_FACTOR = 8;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: function () {
      return gr.url(this.email, { s: "250" }, true);
    },
  },
  idCloudAvatar: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, "Verify token is required"],
    default: nanoid(),
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const user = model("user", userSchema);

module.exports = user;
