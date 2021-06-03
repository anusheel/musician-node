import { SongRepository } from 'data/repositories';
import { Album, Musician } from 'data/models';

export default class SongService {
  static create(id: number, name: string, album: Album, composer: Musician, lyrics?: string) {
    return SongRepository.create(id, name, album, composer, lyrics);
  }

  static get(id: number) {
    return SongRepository.get(id);
  }

  static getAll(args: any) {
    return SongRepository.getAll(args);
  }

  static update(id: number, name: string, lyrics: string, album: Album, composer: Musician) {
    return SongRepository.update(id, name, lyrics, album, composer);
  }

  static partialUpdate(
    id: number,
    name?: string,
    lyrics?: string,
    album?: Album,
    composer?: Musician,
  ) {
    return SongRepository.partialUpdate({ id, name, lyrics, album, composer });
  }

  static destroy(id: number) {
    return SongRepository.destroy(id);
  }
}
