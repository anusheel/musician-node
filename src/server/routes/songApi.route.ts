import { Router } from 'express';
import { validate } from 'express-validation';
import { SongController } from 'server/controllers';
import { songValidation, options } from 'server/validations';

const songApiRouter = Router();

songApiRouter.get('/', validate(songValidation.getAll, options), SongController.getAll);

songApiRouter.get('/:id', SongController.get);

songApiRouter.post('/', validate(songValidation.create, options), SongController.create);

songApiRouter.put('/:id', validate(songValidation.update, options), SongController.update);

songApiRouter.patch(
  '/:id',
  validate(songValidation.partialUpdate, options),
  SongController.partialUpdate,
);

songApiRouter.delete('/:id', validate(songValidation.destroy, options), SongController.destroy);

export default songApiRouter;
