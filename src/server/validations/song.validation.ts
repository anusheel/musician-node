import { Joi } from 'express-validation';

const songValidation = {
  getAll: {
    query: Joi.object({
      id: Joi.number().integer(),
      name: Joi.string().max(100),
      lyrics: Joi.string().max(1000),
      code: Joi.string().uuid({ version: ['uuidv4'] }),
    }),
  },
  create: {
    body: Joi.object({
      id: Joi.number().integer().required(),
      album: Joi.number().integer().required(),
      composer: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
      name: Joi.string().max(100).required(),
      lyrics: Joi.string().max(1000),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
    body: Joi.object({
      name: Joi.string().max(100).required(),
      lyrics: Joi.string().max(1000).required(),
      album: Joi.number().integer().required(),
      composer: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
    body: Joi.object({
      name: Joi.string().max(100),
      lyrics: Joi.string().max(1000),
      album: Joi.number().integer(),
      composer: Joi.string().uuid({ version: ['uuidv4'] }),
    }),
  },
  destroy: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
  },
};

export default songValidation;
