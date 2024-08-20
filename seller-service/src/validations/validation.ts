// src/validations/auth.validation.ts
import Joi from 'joi';

export const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': `Username should be a type of 'text'`,
    'string.empty': `Username cannot be an empty field`,
    'string.min': `Username should have a minimum length of {#limit}`,
    'string.max': `Username should have a maximum length of {#limit}`,
    'any.required': `Username is a required field`,
  }),
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': `Name cannot be an empty field`,
    'string.min': `Name should have a minimum length of {#limit}`,
    'string.max': `Name should have a maximum length of {#limit}`,
    'any.required': `Name is a required field`,
  }),
  email: Joi.string().email().required().messages({
    'string.email': `Please enter a valid email address`,
    'any.required': `Email is a required field`,
  }),
  primaryPhoneNumber: Joi.string().pattern(/^\d{10,15}$/).required().messages({
    'string.pattern.base': `Phone number must be between 10 to 15 digits`,
    'any.required': `Primary phone number is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `Password should have a minimum length of {#limit}`,
    'any.required': `Password is a required field`,
  }),
});

export const loginValidation = Joi.object({
  identifier: Joi.string().required(), // Can be either username or email
  password: Joi.string().required(),
});


export const tokenValidation = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token cannot be empty',
    'any.required': 'Refresh token is required',
  }),
});
