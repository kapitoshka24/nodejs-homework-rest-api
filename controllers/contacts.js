const contacts = require("../repositories/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const listContacts = await contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { listContacts } });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await contacts.addContact(req.body);
    return res.json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await contacts.removeContact(req.params.contactId);

    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        message: "Contact deleted",
      });
    }

    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await contacts.updateContact(
      req.params.contactId,
      req.body
    );

    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    }

    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
};
