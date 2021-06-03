import { Router } from 'express';
import { validate } from 'express-validation';
import { AlbumController } from 'server/controllers';
import { albumValidation, options } from 'server/validations';

const albumApiRouter = Router();

albumApiRouter.get('/', validate(albumValidation.getAll, options), AlbumController.getAll);

albumApiRouter.get('/:id', AlbumController.get);

albumApiRouter.post('/', validate(albumValidation.create, options), AlbumController.create);

albumApiRouter.put('/:id', validate(albumValidation.update, options), AlbumController.update);

albumApiRouter.patch(
  '/:id',
  validate(albumValidation.partialUpdate, options),
  AlbumController.partialUpdate,
);

albumApiRouter.delete('/:id', validate(albumValidation.destroy, options), AlbumController.destroy);

export default albumApiRouter;
