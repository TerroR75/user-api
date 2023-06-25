import Joi from "joi";

const schema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required("Email is required!"),
  role: Joi.string().valid("user", "admin").required(),
  password: Joi.string().min(6).required("Password is required!"),
});

export default function registerValidation(req, res, next) {
  const { error } = schema.validate(req.body);

  if (error) {
    next(error);
  } else {
    next();
  }
}
