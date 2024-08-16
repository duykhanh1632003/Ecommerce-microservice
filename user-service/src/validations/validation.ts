// src/validations/auth.validation.ts
import * as Joi from 'joi';

export const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': `Username should be a type of 'text'`,
    'string.empty': `Username cannot be an empty field`,
    'string.min': `Username should have a minimum length of {#limit}`,
    'string.max': `Username should have a maximum length of {#limit}`,
    'any.required': `Username is a required field`,
  }),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  primaryPhoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
    'string.pattern.base': `Phone number must be between 10 to 15 digits`,
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  dateOfBirth: Joi.date().required(),
  banks: Joi.array().items(
    Joi.object({
      bankName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      accountHolderName: Joi.string().required(),
    })
  ),
  addresses: Joi.array().items(
    Joi.object({
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().optional(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    })
  ),
  avatar: Joi.string().uri().optional(),
});

export const loginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
