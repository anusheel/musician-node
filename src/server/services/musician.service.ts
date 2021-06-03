import { MusicianRepository } from 'data/repositories';
import { Musician, Album, Song } from 'data/models';

export default class MusicianService {
  static create(
    firstName?: string,
    lastName?: string,
    instrument?: string,
    age?: number,
    fans?: number,
    inspiredAt?: Date,
    influencer?: Musician,
    preferredSong?: Song,
    albums?: Album[],
    collabAlbums?: Album[],
  ) {
    return MusicianRepository.create(
      firstName,
      lastName,
      instrument,
      age,
      fans,
      inspiredAt,
      influencer,
      preferredSong,
      albums,
      collabAlbums,
    );
  }

  static get(id: string) {
    return MusicianRepository.get(id);
  }

  static getAll(args: any) {
    return MusicianRepository.getAll(args);
  }

  static update(
    id: string,
    firstName: string,
    lastName: string,
    instrument: string,
    age: number,
    fans: number,
    inspiredAt: Date,
    influencer: Musician,
    preferredSong: Song,
    albums: Album[],
    collabAlbums: Album[],
  ) {
    return MusicianRepository.update(
      id,
      firstName,
      lastName,
      instrument,
      age,
      fans,
      inspiredAt,
      influencer,
      preferredSong,
      albums,
      collabAlbums,
    );
  }

  static partialUpdate(
    id: string,
    firstName?: string,
    lastName?: string,
    instrument?: string,
    age?: number,
    fans?: number,
    inspiredAt?: Date,
    influencer?: Musician,
    preferredSong?: Song,
    albums?: Album[],
    collabAlbums?: Album[],
  ) {
    return MusicianRepository.partialUpdate({
      id,
      firstName,
      lastName,
      instrument,
      age,
      fans,
      inspiredAt,
      influencer,
      preferredSong,
      albums,
      collabAlbums,
    });
  }

  static destroy(id: string) {
    return MusicianRepository.destroy(id);
  }
}
