const express = require("express");
const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require("./validation");
const router = express.Router();
const cntrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

router
  .get("/", guard, cntrl.getAllContacts)
  .post("/", guard, validationAddContact, cntrl.addContact);

router
  .get("/:contactId", guard, validateMongoId, cntrl.getContactById)
  .delete("/:contactId", guard, validateMongoId, cntrl.deleteContact)
  .patch(
    "/:contactId",
    guard,
    validateMongoId,
    validationUpdateContact,
    cntrl.updateContact
  );

router.patch(
  "/:contactId/favorite",
  guard,
  validateMongoId,
  validationUpdateStatusContact,
  cntrl.updateContact
);

module.exports = router;
