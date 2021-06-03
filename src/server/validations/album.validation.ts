import { Joi } from 'express-validation';
import { albumGenreChoices } from 'server/utils/constants/fieldChoices';

const albumValidation = {
  getAll: {
    query: Joi.object({
      id: Joi.number().integer(),
      name: Joi.string().max(80),
      genre: Joi.string().valid(...albumGenreChoices[0]),
      releaseDate: Joi.date(),
      numStars: Joi.number().integer().min(0).max(5),
      ranking: Joi.number().min(2.0).max(10.2),
      upc: Joi.string().max(12),
    }),
  },
  create: {
    body: Joi.object({
      producer: Joi.string().uuid({ version: ['uuidv4'] }),
      name: Joi.string().max(80).required(),
      genre: Joi.string().valid(...albumGenreChoices[0]),
      releaseDate: Joi.date(),
      numStars: Joi.number().integer().min(0).max(5),
      ranking: Joi.number().min(2.0).max(10.2),
      upc: Joi.string().max(12),
      interpreters: Joi.array()
        .items(Joi.string().uuid({ version: ['uuidv4'] }))
        .default([]),
      collaborators: Joi.array()
        .items(Joi.string().uuid({ version: ['uuidv4'] }))
        .default([]),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
    body: Joi.object({
      name: Joi.string().max(80).required(),
      genre: Joi.string()
        .valid(...albumGenreChoices[0])
        .required(),
      releaseDate: Joi.date().required(),
      numStars: Joi.number().integer().min(0).max(5).required(),
      ranking: Joi.number().min(2.0).max(10.2).required(),
      upc: Joi.string().max(12).required(),
      producer: Joi.string().uuid({ version: ['uuidv4'] }),
      interpreters: Joi.array()
        .items(Joi.string().uuid({ version: ['uuidv4'] }))
        .default([]),
      collaborators: Joi.array()
        .items(Joi.string().uuid({ version: ['uuidv4'] }))
        .default([]),
    }),
  },
  partialUpdate: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
    body: Joi.object({
      name: Joi.string().max(80),
      genre: Joi.string().valid(...albumGenreChoices[0]),
      releaseDate: Joi.date(),
      numStars: Joi.number().integer().min(0).max(5),
      ranking: Joi.number().min(2.0).max(10.2),
      upc: Joi.string().max(12),
      producer: Joi.string().uuid({ version: ['uuidv4'] }),
      interpreters: Joi.array()
        .items(Joi.string().uuid({ version: ['uuidv4'] }))
        .default([]),
      collaborators: Joi.array()
        .items(Joi.string().uuid({ version: ['uuidv4'] }))
        .default([]),
    }),
  },
  destroy: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
  },
};

export default albumValidation;
