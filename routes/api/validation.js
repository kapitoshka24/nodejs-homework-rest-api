const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .length(10)
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  phone: Joi.string()
    .length(10)
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
    .optional(),
}).or("name", "email", "phone");

const validate = async (schema, obj, next, errorMsg) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: errorMsg,
    });
  }
};

module.exports = {
  validationAddContact: (req, res, next) => {
    return validate(
      schemaAddContact,
      req.body,
      next,
      "Missing required name fileds or invalid input data"
    );
  },
  validationUpdateContact: (req, res, next) => {
    return validate(
      schemaUpdateContact,
      req.body,
      next,
      "Missing fields or invalid input data"
    );
  },
};
