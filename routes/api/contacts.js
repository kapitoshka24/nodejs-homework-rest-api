const express = require("express");
const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require("./validation");
const router = express.Router();
const cntrl = require("../../controllers/contacts");

router
  .get("/", cntrl.getAllContacts)
  .post("/", validationAddContact, cntrl.addContact);

router
  .get("/:contactId", validateMongoId, cntrl.getContactById)
  .delete("/:contactId", validateMongoId, cntrl.deleteContact)
  .patch(
    "/:contactId",
    validateMongoId,
    validationUpdateContact,
    cntrl.updateContact
  );

router.patch(
  "/:contactId/favorite",
  validateMongoId,
  validationUpdateStatusContact,
  cntrl.updateContact
);

module.exports = router;
