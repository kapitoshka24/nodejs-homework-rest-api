const contact = require("../model/contact");

const listContacts = async (userId, query) => {
  const { sortBy, sortByDesc, favorite = null, limit = 5, page = 1 } = query;
  console.log(query.sortBy);

  const searchOpts = { owner: userId };
  if (favorite !== null) {
    searchOpts.favorite = favorite;
  }

  const results = await contact.paginate(searchOpts, {
    limit,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    populate: { path: "owner", select: "email subscription -_id" },
  });

  return results;
};

const getContactById = async (userId, contactId) => {
  return await contact.findById({ _id: contactId, owner: userId }).populate({
    path: "owner",
    select: "email subscription -_id",
  });
};

const removeContact = async (userId, contactId) => {
  return await contact.findOneAndRemove({ _id: contactId, owner: userId });
};

const addContact = async (userId, body) => {
  return await contact.create({ owner: userId, ...body });
};

const updateContact = async (userId, contactId, body) => {
  return await contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
