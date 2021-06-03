import { Router } from 'express';
import { validate } from 'express-validation';
import { ConcertController } from 'server/controllers';
import { concertValidation, options } from 'server/validations';

const concertApiRouter = Router();

concertApiRouter.get('/', validate(concertValidation.getAll, options), ConcertController.getAll);

concertApiRouter.get('/:name', ConcertController.get);

concertApiRouter.post('/', validate(concertValidation.create, options), ConcertController.create);

concertApiRouter.put(
  '/:name',
  validate(concertValidation.update, options),
  ConcertController.update,
);

concertApiRouter.patch(
  '/:name',
  validate(concertValidation.partialUpdate, options),
  ConcertController.partialUpdate,
);

concertApiRouter.delete(
  '/:name',
  validate(concertValidation.destroy, options),
  ConcertController.destroy,
);

export default concertApiRouter;
