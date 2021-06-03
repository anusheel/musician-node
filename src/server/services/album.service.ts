import { AlbumRepository } from 'data/repositories';
import { Musician } from 'data/models';

export default class AlbumService {
  static create(
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
    return AlbumRepository.create(
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
  }

  static get(id: number) {
    return AlbumRepository.get(id);
  }

  static getAll(args: any) {
    return AlbumRepository.getAll(args);
  }

  static update(
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
    return AlbumRepository.update(
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
  }

  static partialUpdate(
    id: number,
    name?: string,
    genre?: string,
    releaseDate?: Date,
    numStars?: number,
    ranking?: number,
    upc?: string,
    producer?: Musician,
    interpreters?: Musician[],
    collaborators?: Musician[],
  ) {
    return AlbumRepository.partialUpdate({
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

  static destroy(id: number) {
    return AlbumRepository.destroy(id);
  }
}
