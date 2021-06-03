import { Joi } from 'express-validation';

const concertValidation = {
  getAll: {
    query: Joi.object({
      name: Joi.string().max(50),
      place: Joi.string().max(200),
      date: Joi.date(),
      isFree: Joi.boolean(),
    }),
  },
  create: {
    body: Joi.object({
      name: Joi.string().max(50).required(),
      mainArtist: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
      secondaryArtist: Joi.string().uuid({ version: ['uuidv4'] }),
      place: Joi.string().max(200).required(),
      date: Joi.date(),
      isFree: Joi.boolean(),
    }),
  },
  update: {
    params: Joi.object({
      name: Joi.string().max(50).required(),
    }),
    body: Joi.object({
      place: Joi.string().max(200).required(),
      date: Joi.date().required(),
      isFree: Joi.boolean().required(),
      mainArtist: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
      secondaryArtist: Joi.string().uuid({ version: ['uuidv4'] }),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      name: Joi.string().max(50).required(),
    }),
    body: Joi.object({
      place: Joi.string().max(200),
      date: Joi.date(),
      isFree: Joi.boolean(),
      mainArtist: Joi.string().uuid({ version: ['uuidv4'] }),
      secondaryArtist: Joi.string().uuid({ version: ['uuidv4'] }),
    }),
  },
  destroy: {
    params: Joi.object({
      name: Joi.string().max(50).required(),
    }),
  },
};

export default concertValidation;
