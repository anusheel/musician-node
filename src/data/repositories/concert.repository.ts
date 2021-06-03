import { Concert, Musician } from 'data/models';
import { NotFound } from 'server/utils/errors';

//  @Compiler ? means optional, a required parameter cannot follow an optional one, which is why they are ordered
export default class ConcertRepository {
  static async create(
    name: string,
    place: string,
    mainArtist: Musician,
    date?: Date,
    isFree?: boolean,
    secondaryArtist?: Musician,
  ) {
    const createdConcert: Concert = new Concert({
      name,
      place,
      date,
      isFree,
      mainArtist,
      secondaryArtist,
    });

    return createdConcert.save();
  }

  static get(name: string) {
    return Concert.findByPk(name, { include: [] });
  }

  static getAll(filters: any) {
    return Concert.findAll({
      where: filters,
      include: [],
    });
  }

  static async update(
    name: string,
    place: string,
    date: Date,
    isFree: boolean,
    mainArtist: Musician,
    secondaryArtist: Musician,
  ) {
    return this.partialUpdate({
      name,
      place,
      date,
      isFree,
      mainArtist,
      secondaryArtist,
    });
  }

  static async partialUpdate(updateBody: {
    name: string;
    place?: string;
    date?: Date;
    isFree?: boolean;
    mainArtist?: Musician;
    secondaryArtist?: Musician;
  }) {
    const foundConcert = await Concert.findByPk(updateBody.name);
    if (!foundConcert) throw new NotFound(`Concert with primary key ${updateBody.name} not found`);

    if (updateBody.place !== undefined) foundConcert.place = updateBody.place;

    if (updateBody.date !== undefined) foundConcert.date = updateBody.date;

    if (updateBody.isFree !== undefined) foundConcert.isFree = updateBody.isFree;

    if (updateBody.mainArtist !== undefined) foundConcert.mainArtist = updateBody.mainArtist;

    if (updateBody.secondaryArtist !== undefined)
      foundConcert.secondaryArtist = updateBody.secondaryArtist;

    await foundConcert.save();
    return foundConcert.reload();
  }

  static async destroy(name: string) {
    const foundConcert = await Concert.findByPk(name);
    if (!foundConcert) throw new NotFound(`Concert with primary key ${name} not found`);
    await foundConcert.destroy();
    return foundConcert;
  }
}
