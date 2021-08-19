const express = require("express");
const Contacts = require("../../model");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);

    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        message: "Contact deleted",
      });
    }

    return res.json({
      code: 404,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
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
      code: 404,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
