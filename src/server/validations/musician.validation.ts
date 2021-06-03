import { Joi } from 'express-validation';
import { musicianInstrumentChoices } from 'server/utils/constants/fieldChoices';

const musicianValidation = {
  getAll: {
    query: Joi.object({
      id: Joi.string().uuid({ version: ['uuidv4'] }),
      firstName: Joi.string().max(70),
      lastName: Joi.string().max(40),
      instrument: Joi.string().valid(...musicianInstrumentChoices[0]),
      age: Joi.number().integer().min(0),
      fans: Joi.number().integer().min(0),
      inspiredAt: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/),
    }),
  },
  create: {
    body: Joi.object({
      influencer: Joi.string().uuid({ version: ['uuidv4'] }),
      preferredSong: Joi.number().integer(),
      firstName: Joi.string().max(70),
      lastName: Joi.string().max(40),
      instrument: Joi.string().valid(...musicianInstrumentChoices[0]),
      age: Joi.number().integer().min(0),
      fans: Joi.number().integer().min(0),
      inspiredAt: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/),
      albums: Joi.array().items(Joi.number().integer()).default([]),
      collabAlbums: Joi.array().items(Joi.number().integer()).default([]),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
    body: Joi.object({
      firstName: Joi.string().max(70).required(),
      lastName: Joi.string().max(40).required(),
      instrument: Joi.string()
        .valid(...musicianInstrumentChoices[0])
        .required(),
      age: Joi.number().integer().min(0).required(),
      fans: Joi.number().integer().min(0).required(),
      inspiredAt: Joi.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/)
        .required(),
      influencer: Joi.string().uuid({ version: ['uuidv4'] }),
      preferredSong: Joi.number().integer(),
      albums: Joi.array().items(Joi.number().integer()).default([]),
      collabAlbums: Joi.array().items(Joi.number().integer()).default([]),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
    body: Joi.object({
      firstName: Joi.string().max(70),
      lastName: Joi.string().max(40),
      instrument: Joi.string().valid(...musicianInstrumentChoices[0]),
      age: Joi.number().integer().min(0),
      fans: Joi.number().integer().min(0),
      inspiredAt: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/),
      influencer: Joi.string().uuid({ version: ['uuidv4'] }),
      preferredSong: Joi.number().integer(),
      albums: Joi.array().items(Joi.number().integer()).default([]),
      collabAlbums: Joi.array().items(Joi.number().integer()).default([]),
    }),
  },
  destroy: {
    params: Joi.object({
      id: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
    }),
  },
};

export default musicianValidation;
