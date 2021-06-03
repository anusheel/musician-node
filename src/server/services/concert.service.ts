import { ConcertRepository } from 'data/repositories';
import { Musician } from 'data/models';

export default class ConcertService {
  static create(
    name: string,
    place: string,
    mainArtist: Musician,
    date?: Date,
    isFree?: boolean,
    secondaryArtist?: Musician,
  ) {
    return ConcertRepository.create(name, place, mainArtist, date, isFree, secondaryArtist);
  }

  static get(name: string) {
    return ConcertRepository.get(name);
  }

  static getAll(args: any) {
    return ConcertRepository.getAll(args);
  }

  static update(
    name: string,
    place: string,
    mainArtist: Musician,
    date: Date,
    isFree: boolean,
    secondaryArtist: Musician,
  ) {
    return ConcertRepository.update(name, place, date, isFree, mainArtist, secondaryArtist);
  }

  static partialUpdate(
    name: string,
    place?: string,
    mainArtist?: Musician,
    date?: Date,
    isFree?: boolean,
    secondaryArtist?: Musician,
  ) {
    return ConcertRepository.partialUpdate({
      name,
      place,
      date,
      isFree,
      mainArtist,
      secondaryArtist,
    });
  }

  static destroy(name: string) {
    return ConcertRepository.destroy(name);
  }
}
