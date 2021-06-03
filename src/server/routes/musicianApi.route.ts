import { Router } from 'express';
import { validate } from 'express-validation';
import { MusicianController } from 'server/controllers';
import { musicianValidation, options } from 'server/validations';

const musicianApiRouter = Router();

musicianApiRouter.get('/', validate(musicianValidation.getAll, options), MusicianController.getAll);

musicianApiRouter.get('/:id', MusicianController.get);

musicianApiRouter.post(
  '/',
  validate(musicianValidation.create, options),
  MusicianController.create,
);

musicianApiRouter.put(
  '/:id',
  validate(musicianValidation.update, options),
  MusicianController.update,
);

musicianApiRouter.patch(
  '/:id',
  validate(musicianValidation.partialUpdate, options),
  MusicianController.partialUpdate,
);

musicianApiRouter.delete(
  '/:id',
  validate(musicianValidation.destroy, options),
  MusicianController.destroy,
);

export default musicianApiRouter;
