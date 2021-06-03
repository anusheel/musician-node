import { CREATED } from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { AlbumService, MusicianService } from 'server/services';
import { NotFound } from 'server/utils/errors';

export default class AlbumController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        genre,
        releaseDate,
        numStars,
        ranking,
        upc,
        producer,
        interpreters,
        collaborators,
      } = req.body;

      if (producer !== null && typeof producer !== 'undefined') {
        const dbproducer = await MusicianService.get(producer);

        if (!dbproducer) {
          throw new NotFound(`Musician ${producer} not found`);
        }
      }

      const newAlbum = await AlbumService.create(
        name,
        genre,
        releaseDate,
        numStars,
        ranking,
        upc,
        producer,
        interpreters,
        collaborators,
      );
      res.locals.status = CREATED;
      res.locals.data = newAlbum;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const albumObject = await AlbumService.get(id);

      if (!albumObject) {
        throw new NotFound(`Album with primary key ${id} not found`);
      }

      res.locals.data = albumObject;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = { ...req.query };
      const allAlbums = await AlbumService.getAll(filters);
      res.locals.data = allAlbums;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const {
        name,
        genre,
        releaseDate,
        numStars,
        ranking,
        upc,
        producer,
        interpreters,
        collaborators,
      } = req.body;

      if (producer !== null && typeof producer !== 'undefined') {
        if (!(await MusicianService.get(producer))) {
          throw new NotFound(`Musician ${producer} not found`);
        }
      }

      const updatedAlbum = await AlbumService.update(
        id,
        name,
        genre,
        releaseDate,
        numStars,
        ranking,
        upc,
        producer,
        interpreters,
        collaborators,
      );
      res.locals.data = updatedAlbum;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async partialUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const {
        name,
        genre,
        releaseDate,
        numStars,
        ranking,
        upc,
        producer,
        interpreters,
        collaborators,
      } = req.body;

      if (producer !== null && typeof producer !== 'undefined') {
        if (!(await MusicianService.get(producer))) {
          throw new NotFound(`Musician ${producer} not found`);
        }
      }

      const updatedAlbum = await AlbumService.partialUpdate(
        id,
        name,
        genre,
        releaseDate,
        numStars,
        ranking,
        upc,
        producer,
        interpreters,
        collaborators,
      );
      res.locals.data = updatedAlbum;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const albumDelete = await AlbumService.destroy(id);
      res.locals.data = albumDelete;

      return next();
    } catch (error) {
      return next(error);
    }
  }
}
