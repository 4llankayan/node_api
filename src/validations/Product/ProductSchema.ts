import Joi from "joi";

export const productSchema = Joi.object({
  category_id: Joi.number().integer().required(),
  name: Joi.string().required().max(256),
  price: Joi.number().integer().required().min(0).max(2147483647),
  description: Joi.string().required().max(65535),
});
