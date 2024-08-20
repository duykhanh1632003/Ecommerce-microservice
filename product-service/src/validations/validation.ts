// src/validations/product.validation.ts
import Joi from 'joi';

export const createProductValidation = Joi.object({
  product_name: Joi.string().required(),
  product_thumb: Joi.string().required(),
  product_description: Joi.string().allow(null, ''),
  product_type: Joi.string().valid("electronic", "clothing", "furniture", "book", "sports", "beauty").required(),
  product_variations: Joi.array().items(
    Joi.object({
      attributes: Joi.array().items(
        Joi.object({
          category: Joi.string().required(),
          value: Joi.string().required(),
        })
      ).required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
    })
  ).required(),
  images: Joi.array().items(Joi.string()).optional(),
  isDraft: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
});
