import { CREATED } from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { ConcertService, MusicianService } from 'server/services';
import { NotFound } from 'server/utils/errors';

export default class ConcertController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, place, date, isFree, mainArtist, secondaryArtist } = req.body;

      if (mainArtist !== null && typeof mainArtist !== 'undefined') {
        const dbmainArtist = await MusicianService.get(mainArtist);

        if (!dbmainArtist) {
          throw new NotFound(`Musician ${mainArtist} not found`);
        }
      }

      if (secondaryArtist !== null && typeof secondaryArtist !== 'undefined') {
        const dbsecondaryArtist = await MusicianService.get(secondaryArtist);

        if (!dbsecondaryArtist) {
          throw new NotFound(`Musician ${secondaryArtist} not found`);
        }
      }
      // DISCUSS is there a way to type the signature of the function
      const newConcert = await ConcertService.create(
        name,
        place,
        mainArtist,
        date,
        isFree,
        secondaryArtist,
      );
      res.locals.status = CREATED;
      res.locals.data = newConcert;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      const concertObject = await ConcertService.get(name);

      if (!concertObject) {
        throw new NotFound(`Concert with primary key ${name} not found`);
      }

      res.locals.data = concertObject;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = { ...req.query };
      const allConcerts = await ConcertService.getAll(filters);
      res.locals.data = allConcerts;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      const { place, date, isFree, mainArtist, secondaryArtist } = req.body;

      if (mainArtist !== null && typeof mainArtist !== 'undefined') {
        if (!(await MusicianService.get(mainArtist))) {
          throw new NotFound(`Musician ${mainArtist} not found`);
        }
      }

      if (secondaryArtist !== null && typeof secondaryArtist !== 'undefined') {
        if (!(await MusicianService.get(secondaryArtist))) {
          throw new NotFound(`Musician ${secondaryArtist} not found`);
        }
      }

      const updatedConcert = await ConcertService.update(
        name,
        place,
        mainArtist,
        date,
        isFree,
        secondaryArtist,
      );
      res.locals.data = updatedConcert;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async partialUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      const { place, date, isFree, mainArtist, secondaryArtist } = req.body;

      if (mainArtist !== null && typeof mainArtist !== 'undefined') {
        if (!(await MusicianService.get(mainArtist))) {
          throw new NotFound(`Musician ${mainArtist} not found`);
        }
      }

      if (secondaryArtist !== null && typeof secondaryArtist !== 'undefined') {
        if (!(await MusicianService.get(secondaryArtist))) {
          throw new NotFound(`Musician ${secondaryArtist} not found`);
        }
      }

      const updatedConcert = await ConcertService.partialUpdate(
        name,
        place,
        mainArtist,
        date,
        isFree,
        secondaryArtist,
      );
      res.locals.data = updatedConcert;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      const concertDelete = await ConcertService.destroy(name);
      res.locals.data = concertDelete;

      return next();
    } catch (error) {
      return next(error);
    }
  }
}
