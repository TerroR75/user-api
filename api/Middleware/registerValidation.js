const Joi = require("joi");

const schema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required("Email is required!"),
  role: Joi.string().valid("user", "admin").required(),
  password: Joi.string().min(6).required("Password is required!"),
});

function registerValidation(req, res, next) {
  const { error } = schema.validate(req.body);

  if (error) {
    const errorMsg = error.details[0].message;
    return res.status(400).json({ error: errorMsg });
  } else {
    next();
  }
}

module.exports = registerValidation;
