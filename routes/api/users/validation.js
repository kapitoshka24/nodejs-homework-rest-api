const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaUser = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  password: Joi.string().min(3).max(15).required(),
  subscription: Joi.string()
    .optional()
    .default("starter")
    .valid("starter", "pro", "business"),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string()
    .required()
    .default("starter")
    .valid("starter", "pro", "business"),
});

const schemaUserEmail = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required(),
});

const validate = async (schema, obj, next, errorMsg) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (error) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: errorMsg,
    });
  }
};

module.exports = {
  validationUser: (req, _, next) => {
    return validate(schemaUser, req.body, next, "Invalid email or password");
  },
  validationEmail: (req, _, next) => {
    return validate(
      schemaUserEmail,
      req.body,
      next,
      "Missing required field email"
    );
  },
  validationSubscription: (req, _, next) => {
    return validate(
      schemaUpdateSubscription,
      req.body,
      next,
      "Invalid subscription type"
    );
  },
};
