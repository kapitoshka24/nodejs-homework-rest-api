const express = require("express");
const contacts = require("../../model");
const {
  validationAddContact,
  validationUpdateContact,
} = require("./validation");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const listContacts = await contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { listContacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", validationAddContact, async (req, res, next) => {
  try {
    const contact = await contacts.addContact(req.body);
    return res.json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
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
});

router.patch("/:contactId", validationUpdateContact, async (req, res, next) => {
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
});

module.exports = router;
