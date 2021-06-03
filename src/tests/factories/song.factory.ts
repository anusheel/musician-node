import { random, datatype } from 'faker';
import { Song } from 'data/models';
import { buildAlbum, createAlbum } from './album.factory';
import { buildMusician, createMusician } from './musician.factory';

interface SongDict {
  id?: number;
  name?: string;
  lyrics?: string;
  album?: number;
  composer?: string;
}

const buildSong = async (songFks) => {
  const resSong: SongDict = {};
  let { album } = songFks;
  let { composer } = songFks;

  resSong.id = datatype.number();
  resSong.name = random.word().slice(0, 100);
  resSong.lyrics = random.word().slice(0, 1000);

  if (songFks.album === null || typeof songFks.album === 'undefined') {
    const fakeAlbum = await buildAlbum({});
    const createdFakeAlbum = await createAlbum(fakeAlbum);
    album = createdFakeAlbum.id;
  }
  if (songFks.composer === null || typeof songFks.composer === 'undefined') {
    const fakeComposer = await buildMusician({});
    const createdFakeComposer = await createMusician(fakeComposer);
    composer = createdFakeComposer.id;
  }
  resSong.album = album;
  resSong.composer = composer;

  return resSong;
};

const createSong = async (fakeSong) => {
  const song = await Song.create(fakeSong);
  return song;
};

export { buildSong, createSong };
