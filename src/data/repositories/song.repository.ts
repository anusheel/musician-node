import { Song, Album, Musician } from 'data/models';
import { NotFound } from 'server/utils/errors';

export default class SongRepository {
  static async create(id: number, name: string, album: Album, composer: Musician, lyrics?: string) {
    const createdSong = new Song({
      id,
      name,
      lyrics,
      album,
      composer,
    });
    return createdSong.save();
  }

  static get(id: number) {
    return Song.findByPk(id, { include: ['songMusicianFans'] });
  }

  static getAll(filters: any) {
    return Song.findAll({
      where: filters,
      include: ['songMusicianFans'],
    });
  }

  static async update(id: number, name: string, lyrics: string, album: Album, composer: Musician) {
    return this.partialUpdate({
      id,
      name,
      lyrics,
      album,
      composer,
    });
  }

  static async partialUpdate(updateBody: {
    id: number;
    name?: string;
    lyrics?: string;
    album?: Album;
    composer?: Musician;
  }) {
    const foundSong = await Song.findByPk(updateBody.id);
    if (!foundSong) throw new NotFound(`Song with primary key ${updateBody.id} not found`);

    if (updateBody.name !== undefined) foundSong.name = updateBody.name;

    if (updateBody.lyrics !== undefined) foundSong.lyrics = updateBody.lyrics;

    if (updateBody.album !== undefined) foundSong.album = updateBody.album;

    if (updateBody.composer !== undefined) foundSong.composer = updateBody.composer;

    await foundSong.save();
    return foundSong.reload();
  }

  static async destroy(id: number) {
    const foundSong = await Song.findByPk(id);
    if (!foundSong) throw new NotFound(`Song with primary key ${id} not found`);
    await foundSong.destroy();
    return foundSong;
  }
}
