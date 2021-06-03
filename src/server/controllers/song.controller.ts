import { CREATED } from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { SongService, AlbumService, MusicianService } from 'server/services';
import { NotFound } from 'server/utils/errors';

export default class SongController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, lyrics, album, composer } = req.body;

      if (album !== null && typeof album !== 'undefined') {
        const dbalbum = await AlbumService.get(album);
        if (!dbalbum) {
          throw new NotFound(`Album ${album} not found`);
        }
      }

      if (composer !== null && typeof composer !== 'undefined') {
        const dbcomposer = await MusicianService.get(composer);
        if (!dbcomposer) {
          throw new NotFound(`Musician ${composer} not found`);
        }
      }

      const newSong = await SongService.create(id, name, album, composer, lyrics);

      res.locals.status = CREATED;
      res.locals.data = newSong;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const songObject = await SongService.get(id);

      if (!songObject) {
        throw new NotFound(`Song with primary key ${id} not found`);
      }

      res.locals.data = songObject;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = { ...req.query };
      const allSongs = await SongService.getAll(filters);
      res.locals.data = allSongs;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const { name, lyrics, album, composer } = req.body;

      if (album !== null && typeof album !== 'undefined') {
        if (!(await AlbumService.get(album))) {
          throw new NotFound(`Album ${album} not found`);
        }
      }

      if (composer !== null && typeof composer !== 'undefined') {
        if (!(await MusicianService.get(composer))) {
          throw new NotFound(`Musician ${composer} not found`);
        }
      }

      const updatedSong = await SongService.update(id, name, lyrics, album, composer);
      res.locals.data = updatedSong;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async partialUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const { name, lyrics, album, composer } = req.body;

      if (album !== null && typeof album !== 'undefined') {
        if (!(await AlbumService.get(album))) {
          throw new NotFound(`Album ${album} not found`);
        }
      }

      if (composer !== null && typeof composer !== 'undefined') {
        if (!(await MusicianService.get(composer))) {
          throw new NotFound(`Musician ${composer} not found`);
        }
      }

      const updatedSong = await SongService.partialUpdate(id, name, lyrics, album, composer);
      res.locals.data = updatedSong;

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.id);
      const songDelete = await SongService.destroy(id);
      res.locals.data = songDelete;

      return next();
    } catch (error) {
      return next(error);
    }
  }
}
