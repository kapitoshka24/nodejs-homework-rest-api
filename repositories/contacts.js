const contact = require("../model/contact");

const listContacts = async () => {
  return await contact.find();
};

const getContactById = async (contactId) => {
  return await contact.findById({ _id: contactId });
};

const removeContact = async (contactId) => {
  return await contact.findOneAndRemove({ _id: contactId });
};

const addContact = async (body) => {
  return await contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await contact.findOneAndUpdate(
    { _id: contactId },
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
