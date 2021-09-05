const mongoose = require("mongoose");
const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^\w+(?:\s+\w+)*$/)
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .length(10)
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
    .required(),
  favorite: Joi.boolean().default(false),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^\w+(?:\s+\w+)*$/)
    .optional(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  phone: Joi.string()
    .length(10)
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
    .optional(),
  favorite: Joi.boolean().optional(),
}).or("name", "email", "phone", "favorite");

const schemaUpdateContactStatus = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next, errorMsg) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (error) {
    next({
      status: 400,
      message: errorMsg,
    });
  }
};

module.exports = {
  validationAddContact: (req, _, next) => {
    return validate(
      schemaAddContact,
      req.body,
      next,
      "Missing required name fileds or invalid input data"
    );
  },
  validationUpdateContact: (req, _, next) => {
    return validate(
      schemaUpdateContact,
      req.body,
      next,
      "Missing fields or invalid input data"
    );
  },
  validationUpdateStatusContact: (req, _, next) => {
    return validate(
      schemaUpdateContactStatus,
      req.body,
      next,
      "Missing field favorite"
    );
  },
  validateMongoId: (req, _, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: 400,
        message: "Invalid Id",
      });
    }
    next();
  },
};
