import { Musician, Song, Album } from 'data/models';
import { NotFound } from 'server/utils/errors';

export default class MusicianRepository {
  static async create(
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
    const createdMusician = new Musician({
      firstName,
      lastName,
      instrument,
      age,
      fans,
      inspiredAt,
      influencer,
      preferredSong,
    });

    if (albums) createdMusician.$set('albums', albums);
    if (collabAlbums) createdMusician.$set('collabAlbums', collabAlbums);

    return createdMusician.save();
  }

  static get(id: string) {
    return Musician.findByPk(id, {
      include: [
        'prodRecords',
        'mainConcerts',
        'secondaryConcerts',
        'influencedMusicians',
        'composedSongs',
        'albums',
        'collabAlbums',
      ],
    });
  }

  static getAll(filters: any) {
    return Musician.findAll({
      where: filters,
      include: [
        'prodRecords',
        'mainConcerts',
        'secondaryConcerts',
        'influencedMusicians',
        'composedSongs',
        'albums',
        'collabAlbums',
      ],
    });
  }

  static async update(
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
    return this.partialUpdate({
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

  static async partialUpdate(updateBody: {
    id: string;
    firstName?: string;
    lastName?: string;
    instrument?: string;
    age?: number;
    fans?: number;
    inspiredAt?: Date;
    influencer?: Musician;
    preferredSong?: Song;
    albums?: Album[];
    collabAlbums?: Album[];
  }) {
    const foundMusician = await Musician.findByPk(updateBody.id);
    if (!foundMusician) throw new NotFound(`Musician with primary key ${updateBody.id} not found`);

    if (updateBody.firstName !== undefined) foundMusician.firstName = updateBody.firstName;

    if (updateBody.lastName !== undefined) foundMusician.lastName = updateBody.lastName;

    if (updateBody.instrument !== undefined) foundMusician.instrument = updateBody.instrument;

    if (updateBody.age !== undefined) foundMusician.age = updateBody.age;

    if (updateBody.fans !== undefined) foundMusician.fans = updateBody.fans;

    if (updateBody.inspiredAt !== undefined) foundMusician.inspiredAt = updateBody.inspiredAt;

    if (updateBody.influencer !== undefined) foundMusician.influencer = updateBody.influencer;

    if (updateBody.preferredSong !== undefined)
      foundMusician.preferredSong = updateBody.preferredSong;

    if (updateBody.albums !== undefined) foundMusician.$set('albums', updateBody.albums);

    if (updateBody.collabAlbums !== undefined)
      foundMusician.$set('collabAlbums', updateBody?.collabAlbums);

    await foundMusician.save();
    return foundMusician.reload();
  }

  static async destroy(id: string) {
    const foundMusician = await Musician.findByPk(id);
    if (!foundMusician) throw new NotFound(`Musician with primary key ${id} not found`);
    await foundMusician.destroy();
    return foundMusician;
  }
}
