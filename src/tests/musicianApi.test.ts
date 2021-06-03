import request from 'supertest';
import { Musician } from 'data/models';
import app from 'server/app';
import {
  buildMusician,
  buildSong,
  buildAlbum,
  createMusician,
  createSong,
  createAlbum,
} from './factories';
import { startDatabase } from './utils';

const ENDPOINT = '/musician-api';

describe('MusicianApi tests', () => {
  beforeEach(async () => {
    await startDatabase();
  });

  test('/POST - Response with a new created musician', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const fakeMusician = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });

    const response = await request(app).post(ENDPOINT).send(fakeMusician);

    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseMusician = response.body.data;

    const musician = await Musician.findByPk(responseMusician.id);

    expect(musician.firstName).toBe(fakeMusician.firstName);
    expect(musician.lastName).toBe(fakeMusician.lastName);
    expect(musician.instrument).toBe(fakeMusician.instrument);
    expect(musician.age).toBe(fakeMusician.age);
    expect(musician.fans).toBe(fakeMusician.fans);
    expect(musician.inspiredAt).toBe(fakeMusician.inspiredAt);

    expect(musician.influencer).toBe(fakeMusician.influencer);
    expect(musician.preferredSong).toBe(fakeMusician.preferredSong);
  });

  test('/POST - Response with a new created musician album with many to many related models', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const albumsDict = await buildAlbum({});
    const fakeAlbums = await createAlbum(albumsDict);
    const collabAlbumsDict = await buildAlbum({});
    const fakeCollabAlbums = await createAlbum(collabAlbumsDict);

    const fakeMusician = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
      albums: [fakeAlbums.id],
      collabAlbums: [fakeCollabAlbums.id],
    });

    const response = await request(app).post(ENDPOINT).send(fakeMusician);

    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseMusician = response.body.data;

    const musician = await Musician.findByPk(responseMusician.id, {
      include: ['albums', 'collabAlbums'],
    });

    expect(musician.albums[0].id).toBe(fakeAlbums.id);
    expect(musician.albums.length).toBe(1);
    expect(musician.collabAlbums[0].id).toBe(fakeCollabAlbums.id);
    expect(musician.collabAlbums.length).toBe(1);
  });

  test('/POST - influencer does not exist, musician cant be created', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);

    const { id } = relFakeInfluencer;
    await relFakeInfluencer.destroy();

    const fakeMusician = await buildMusician({ influencer: id });

    const response = await request(app).post(ENDPOINT).send(fakeMusician);

    expect(response.statusCode).toBe(404);
  });

  test('/POST - preferredSong does not exist, musician cant be created', async () => {
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const { id } = relFakePreferredSong;
    await relFakePreferredSong.destroy();

    const fakeMusician = await buildMusician({ preferredSong: id });

    const response = await request(app).post(ENDPOINT).send(fakeMusician);

    expect(response.statusCode).toBe(404);
  });

  test('/GET - Response with a musician', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const musicianDict = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });
    const fakeMusician = await createMusician(musicianDict);

    const response = await request(app).get(`${ENDPOINT}/${fakeMusician.id}`);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    expect(data.id).toBe(fakeMusician.id);
    expect(data.firstName).toBe(fakeMusician.firstName);
    expect(data.lastName).toBe(fakeMusician.lastName);
    expect(data.instrument).toBe(fakeMusician.instrument);
    expect(data.age).toBe(fakeMusician.age);
    expect(data.fans).toBe(fakeMusician.fans);
    expect(data.inspiredAt).toBe(fakeMusician.inspiredAt);

    expect(data.prodRecords).toEqual([]);
    expect(data.mainConcerts).toEqual([]);
    expect(data.secondaryConcerts).toEqual([]);
    expect(data.influencedMusicians).toEqual([]);
    expect(data.composedSongs).toEqual([]);
    expect(data.influencer).toBe(fakeMusician.influencer);
    expect(data.preferredSong).toBe(fakeMusician.preferredSong);
  });

  test('/GET - Response with a musician not found', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);
    const { id } = fakeMusician;
    await fakeMusician.destroy();

    const response = await request(app).get(`${ENDPOINT}/${id}`);
    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/GET - Response with a list of musicians', async () => {
    const response = await request(app).get(ENDPOINT);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    const allMusician = await Musician.findAll();
    expect(data.length).toBe(allMusician.length);
  });

  test('/PUT - Response with an updated musician', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const musicianDict = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });
    const fakeMusician = await createMusician(musicianDict);

    const anotherInfluencerDict = await buildMusician({});
    const anotherrelFakeInfluencer = await createMusician(anotherInfluencerDict);
    const anotherPreferredSongDict = await buildSong({});
    const anotherrelFakePreferredSong = await createSong(anotherPreferredSongDict);

    const anotherFakeMusician = await buildMusician({
      influencer: anotherrelFakeInfluencer.id,
      preferredSong: anotherrelFakePreferredSong.id,
    });

    const response = await request(app).put(`${ENDPOINT}/${fakeMusician.id}`).send({
      firstName: anotherFakeMusician.firstName,
      lastName: anotherFakeMusician.lastName,
      instrument: anotherFakeMusician.instrument,
      age: anotherFakeMusician.age,
      fans: anotherFakeMusician.fans,
      inspiredAt: anotherFakeMusician.inspiredAt,
      influencer: anotherFakeMusician.influencer,
      preferredSong: anotherFakeMusician.preferredSong,
    });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.firstName).toBe(anotherFakeMusician.firstName);
    expect(data.lastName).toBe(anotherFakeMusician.lastName);
    expect(data.instrument).toBe(anotherFakeMusician.instrument);
    expect(data.age).toBe(anotherFakeMusician.age);
    expect(data.fans).toBe(anotherFakeMusician.fans);
    expect(data.inspiredAt).toBe(anotherFakeMusician.inspiredAt);

    expect(data.influencer).toBe(anotherFakeMusician.influencer);

    expect(data.preferredSong).toBe(anotherFakeMusician.preferredSong);

    const updatedMusician = await Musician.findByPk(fakeMusician.id);

    expect(updatedMusician.firstName).toBe(anotherFakeMusician.firstName);
    expect(updatedMusician.lastName).toBe(anotherFakeMusician.lastName);
    expect(updatedMusician.instrument).toBe(anotherFakeMusician.instrument);
    expect(updatedMusician.age).toBe(anotherFakeMusician.age);
    expect(updatedMusician.fans).toBe(anotherFakeMusician.fans);
    expect(updatedMusician.inspiredAt).toBe(anotherFakeMusician.inspiredAt);

    expect(updatedMusician.influencer).toBe(anotherFakeMusician.influencer);
    expect(updatedMusician.preferredSong).toBe(anotherFakeMusician.preferredSong);
  });

  test('/PUT - influencer does not exists, musician cant be updated', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const musicianDict = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });
    const fakeMusician = await createMusician(musicianDict);

    const anotherInfluencerDict = await buildMusician({});
    const anotherrelFakeInfluencer = await createMusician(anotherInfluencerDict);

    musicianDict.influencer = anotherrelFakeInfluencer.id;

    await anotherrelFakeInfluencer.destroy();

    const response = await request(app).put(`${ENDPOINT}/${fakeMusician.id}`).send({
      firstName: musicianDict.firstName,
      lastName: musicianDict.lastName,
      instrument: musicianDict.instrument,
      age: musicianDict.age,
      fans: musicianDict.fans,
      inspiredAt: musicianDict.inspiredAt,
      influencer: musicianDict.influencer,
      preferredSong: musicianDict.preferredSong,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
  test('/PUT - preferredSong does not exists, musician cant be updated', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const musicianDict = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });
    const fakeMusician = await createMusician(musicianDict);

    const anotherPreferredSongDict = await buildSong({});
    const anotherrelFakePreferredSong = await createSong(anotherPreferredSongDict);

    musicianDict.preferredSong = anotherrelFakePreferredSong.id;

    await anotherrelFakePreferredSong.destroy();

    const response = await request(app).put(`${ENDPOINT}/${fakeMusician.id}`).send({
      firstName: musicianDict.firstName,
      lastName: musicianDict.lastName,
      instrument: musicianDict.instrument,
      age: musicianDict.age,
      fans: musicianDict.fans,
      inspiredAt: musicianDict.inspiredAt,
      influencer: musicianDict.influencer,
      preferredSong: musicianDict.preferredSong,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PUT - Musician does not exists, musician cant be updated', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);
    const { id } = fakeMusician;
    await fakeMusician.destroy();

    const response = await request(app).put(`${ENDPOINT}/${id}`).send({
      firstName: musicianDict.firstName,
      lastName: musicianDict.lastName,
      instrument: musicianDict.instrument,
      age: musicianDict.age,
      fans: musicianDict.fans,
      inspiredAt: musicianDict.inspiredAt,
      influencer: musicianDict.influencer,
      preferredSong: musicianDict.preferredSong,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Response with an updated musician (no updates)', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const musicianDict = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });
    const fakeMusician = await createMusician(musicianDict);

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeMusician.id}`)
      .send({ albums: [], collabAlbums: [] });

    const { status } = response;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
  });

  test('/PATCH - Response with an updated musician', async () => {
    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);
    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const musicianDict = await buildMusician({
      influencer: relFakeInfluencer.id,
      preferredSong: relFakePreferredSong.id,
    });
    const fakeMusician = await createMusician(musicianDict);

    const anotherInfluencerDict = await buildMusician({});
    const anotherrelFakeInfluencer = await createMusician(anotherInfluencerDict);
    const anotherPreferredSongDict = await buildSong({});
    const anotherrelFakePreferredSong = await createSong(anotherPreferredSongDict);

    const anotherFakeMusician = await buildMusician({
      influencer: anotherrelFakeInfluencer.id,
      preferredSong: anotherrelFakePreferredSong.id,
    });

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeMusician.id}`)
      .send({ firstName: anotherFakeMusician.firstName });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.firstName).toBe(anotherFakeMusician.firstName);

    const updatedMusician = await Musician.findByPk(fakeMusician.id);

    expect(updatedMusician.firstName).toBe(anotherFakeMusician.firstName);
  });

  test('/PATCH - influencer does not exists, musician cant be updated', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);

    const relInfluencerDict = await buildMusician({});
    const relFakeInfluencer = await createMusician(relInfluencerDict);

    const relFakeInfluencerId = relFakeInfluencer.id;
    await relFakeInfluencer.destroy();

    const response = await request(app).patch(`${ENDPOINT}/${fakeMusician.id}`).send({
      influencer: relFakeInfluencerId,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - preferredSong does not exists, musician cant be updated', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);

    const relPreferredSongDict = await buildSong({});
    const relFakePreferredSong = await createSong(relPreferredSongDict);

    const relFakePreferredSongId = relFakePreferredSong.id;
    await relFakePreferredSong.destroy();

    const response = await request(app).patch(`${ENDPOINT}/${fakeMusician.id}`).send({
      preferredSong: relFakePreferredSongId,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Musician does not exists, musician cant be updated', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);
    const { id } = fakeMusician;
    const { firstName } = fakeMusician;
    await fakeMusician.destroy();

    const response = await request(app).patch(`${ENDPOINT}/${id}`).send({ firstName });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/DELETE - Response with a deleted musician', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);

    const response = await request(app).delete(`${ENDPOINT}/${fakeMusician.id}`);

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.id).toBe(fakeMusician.id);

    const deletedMusician = await Musician.findByPk(fakeMusician.id);
    expect(deletedMusician).toBe(null);
  });

  test('/DELETE - Musician does not exists, musician cant be deleted', async () => {
    const musicianDict = await buildMusician({});
    const fakeMusician = await createMusician(musicianDict);
    const { id } = fakeMusician;
    await fakeMusician.destroy();

    const response = await request(app).delete(`${ENDPOINT}/${id}`);
    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
});
