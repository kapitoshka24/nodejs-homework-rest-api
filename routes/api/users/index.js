const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const {
  validationUser,
  validationSubscription,
  validationEmail,
} = require("./validation");

router.patch("/", validationSubscription, ctrl.updateSubscription);
router.post("/signup", validationUser, ctrl.signup);
router.post("/login", validationUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/avatars", guard, upload.single("avatar"), ctrl.avatars);

router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify", validationEmail, ctrl.repeatEmailVerification);

module.exports = router;
