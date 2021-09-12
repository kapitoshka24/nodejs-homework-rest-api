const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const { validationUser, validationSubscription } = require("./validation");

router.patch("/", validationSubscription, ctrl.updateSubscription);
router.post("/signup", validationUser, ctrl.signup);
router.post("/login", validationUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/avatars", guard, upload.single("avatar"), ctrl.avatars);

module.exports = router;
