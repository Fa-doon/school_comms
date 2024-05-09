const joi = require("joi");

async function validateNewUser(req, res, next) {
  try {
    const user = req.body;

    const schema = joi.object({
      name: joi.string().required().messages({
        "string.base": "Invalid type, please provide a valid string",
        "string.required": "Name is required",
      }),
      username: joi.string().required().messages({
        "string.base": "Invalid type, please provide a valid string",
        "string.required": "Username is required",
      }),
      email: joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.required": "Email is required",
      }),
      password: joi.string().min(6).required().messages({
        "string.min": "Password must not be less than {6} characters",
        "string.required": "Password is required",
      }),
      role_name: joi.string().required().messages({
        "string.base": "Invalid type, please provide a valid string",
        "string.required": "Role name is required",
      }),
    });

    const valid = await schema.validateAsync(user, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(422).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
}

async function validateLogin(req, res, next) {
  try {
    const user = req.body;

    const schema = joi.object({
      email: joi.string().email().required().messages({
        "string.required": "Username is required",
      }),
      password: joi.string().required().messages({
        "string.required": "Password is required",
      }),
    });

    await schema.validateAsync(user, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(422).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
}

async function validateRole(req, res, next) {
  try {
    const role = req.body;

    const schema = joi.object({
      name: joi.string().required().messages({
        "string.required": "Role is required",
      }),
    });

    await schema.validateAsync(role, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(422).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
}

module.exports = { validateNewUser, validateLogin, validateRole };
