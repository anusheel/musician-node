import { Album, Musician } from 'data/models';
import { NotFound } from 'server/utils/errors';

export default class AlbumRepository {
  static async create(
    name: string,
    genre?: string,
    releaseDate?: Date,
    numStars?: number,
    ranking?: number,
    upc?: string,
    producer?: Musician,
    interpreters?: Musician[],
    collaborators?: Musician[],
  ) {
    const createdAlbum: Album = new Album({
      name,
      genre,
      releaseDate,
      numStars,
      ranking,
      upc,
      producer,
    });
    if (interpreters) createdAlbum.$set('interpreters', interpreters);
    if (collaborators) createdAlbum.$set('collaborators', collaborators);
    return createdAlbum.save();
  }

  static get(id: number) {
    return Album.findByPk(id, { include: ['songs', 'interpreters', 'collaborators'] });
  }

  static getAll(filters: any) {
    return Album.findAll({
      where: filters,
      include: ['songs', 'interpreters', 'collaborators'],
    });
  }

  static async update(
    id: number,
    name: string,
    genre: string,
    releaseDate: Date,
    numStars: number,
    ranking: number,
    upc: string,
    producer: Musician,
    interpreters: Musician[],
    collaborators: Musician[],
  ) {
    return this.partialUpdate({
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
    });
  }

  static async partialUpdate(updateBody: {
    id: number;
    name?: string;
    genre?: string;
    releaseDate?: Date;
    numStars?: number;
    ranking?: number;
    upc?: string;
    producer?: Musician;
    interpreters?: Musician[];
    collaborators?: Musician[];
  }) {
    const foundAlbum: Album = await Album.findByPk(updateBody.id);
    if (!foundAlbum) throw new NotFound(`Album with primary key ${updateBody.id} not found`);

    if (updateBody.name !== undefined) foundAlbum.name = updateBody.name;

    if (updateBody.genre !== undefined) foundAlbum.genre = updateBody.genre;

    if (updateBody.releaseDate !== undefined) foundAlbum.releaseDate = updateBody.releaseDate;

    if (updateBody.numStars !== undefined) foundAlbum.numStars = updateBody.numStars;

    if (updateBody.ranking !== undefined) foundAlbum.ranking = updateBody.ranking;

    if (updateBody.upc !== undefined) foundAlbum.upc = updateBody.upc;

    if (updateBody.producer !== undefined) foundAlbum.producer = updateBody.producer;

    if (updateBody.interpreters !== undefined)
      foundAlbum.$set('interpreters', updateBody.interpreters);

    if (updateBody.collaborators !== undefined)
      foundAlbum.$set('collaborators', updateBody.collaborators);

    await foundAlbum.save();
    return foundAlbum.reload();
  }

  static async destroy(id: number) {
    const foundAlbum = await Album.findByPk(id);
    if (!foundAlbum) throw new NotFound(`Album with primary key ${id} not found`);
    await foundAlbum.destroy();
    return foundAlbum;
  }
}
