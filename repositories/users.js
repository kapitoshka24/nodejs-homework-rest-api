const user = require("../model/user");
const User = require("../model/user");

const findById = async (id) => {
  return await user.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateSubscription = async (id, body) => {
  return await User.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateSubscription,
  updateToken,
};
