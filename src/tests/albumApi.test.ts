import request from 'supertest';
import { buildAlbum, buildMusician, createAlbum, createMusician } from 'tests/factories';
import { Album } from 'data/models';
import app from 'server/app';
import { startDatabase } from './utils';

const ENDPOINT = '/album-api';
describe('AlbumApi tests', () => {
  beforeEach(async () => {
    await startDatabase();
  });

  test('/POST - Response with a new created album', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const fakeAlbum = await buildAlbum({ producer: relFakeProducer.id });
    const response = await request(app).post(ENDPOINT).send(fakeAlbum);

    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseAlbum = response.body.data;
    const album = await Album.findByPk(responseAlbum.id);
    expect(album.name).toBe(fakeAlbum.name);
    expect(album.genre).toBe(fakeAlbum.genre);
    expect(album.releaseDate).toBe(fakeAlbum.releaseDate);
    expect(album.numStars).toBe(fakeAlbum.numStars);
    expect(album.ranking).toBe(fakeAlbum.ranking);
    expect(album.upc).toBe(fakeAlbum.upc);

    expect(album.producer).toBe(fakeAlbum.producer);
  });

  test('/POST - Response with a new created album album with many to many related models', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const interpretersDict = await buildMusician({});
    const fakeInterpreters = await createMusician(interpretersDict);
    const collaboratorsDict = await buildMusician({});
    const fakeCollaborators = await createMusician(collaboratorsDict);

    const fakeAlbum = await buildAlbum({
      producer: relFakeProducer.id,
      interpreters: [fakeInterpreters.id],
      collaborators: [fakeCollaborators.id],
    });

    const response = await request(app).post(ENDPOINT).send(fakeAlbum);
    expect(response.status).toBe(201);
    expect(response.statusCode).toBe(201);

    const responseAlbum = response.body.data;

    const album = await Album.findByPk(responseAlbum.id, {
      include: ['interpreters', 'collaborators'],
    });
    expect(album.interpreters[0].id).toBe(fakeInterpreters.id);
    expect(album.interpreters.length).toBe(1);
    expect(album.collaborators[0].id).toBe(fakeCollaborators.id);
    expect(album.collaborators.length).toBe(1);
  });

  test('/POST - producer does not exist, album cant be created', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const { id } = relFakeProducer;
    await relFakeProducer.destroy();

    const fakeAlbum = await buildAlbum({ producer: id });

    const response = await request(app).post(ENDPOINT).send(fakeAlbum);

    expect(response.statusCode).toBe(404);
  });

  test('/GET - Response with a album', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const albumDict = await buildAlbum({ producer: relFakeProducer.id });
    const fakeAlbum = await createAlbum(albumDict);

    const response = await request(app).get(`${ENDPOINT}/${fakeAlbum.id}`);

    const { statusCode, status } = response;
    const { data } = response.body;
    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    expect(data.id).toBe(fakeAlbum.id);
    expect(data.name).toBe(fakeAlbum.name);
    expect(data.genre).toBe(fakeAlbum.genre);
    expect(data.releaseDate).toBe(fakeAlbum.releaseDate);
    expect(data.numStars).toBe(fakeAlbum.numStars);
    expect(data.ranking).toBe(fakeAlbum.ranking);
    expect(data.upc).toBe(fakeAlbum.upc);

    expect(data.songs).toEqual([]);
    expect(data.producer).toBe(fakeAlbum.producer);
  });

  test('/GET - Response with a album not found', async () => {
    const albumDict = await buildAlbum({});
    const fakeAlbum = await createAlbum(albumDict);
    const { id } = fakeAlbum;
    await fakeAlbum.destroy();

    const response = await request(app).get(`${ENDPOINT}/${id}`);
    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/GET - Response with a list of albums', async () => {
    const response = await request(app).get(ENDPOINT);

    const { statusCode, status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(statusCode).toBe(200);

    const allAlbum = await Album.findAll();
    expect(data.length).toBe(allAlbum.length);
  });

  test('/PUT - Response with an updated album', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const albumDict = await buildAlbum({ producer: relFakeProducer.id });
    const fakeAlbum = await createAlbum(albumDict);

    const anotherProducerDict = await buildMusician({});
    const anotherrelFakeProducer = await createMusician(anotherProducerDict);

    const anotherFakeAlbum = await buildAlbum({ producer: anotherrelFakeProducer.id });

    const response = await request(app).put(`${ENDPOINT}/${fakeAlbum.id}`).send({
      name: anotherFakeAlbum.name,
      genre: anotherFakeAlbum.genre,
      releaseDate: anotherFakeAlbum.releaseDate,
      numStars: anotherFakeAlbum.numStars,
      ranking: anotherFakeAlbum.ranking,
      upc: anotherFakeAlbum.upc,
      producer: anotherFakeAlbum.producer,
    });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.name).toBe(anotherFakeAlbum.name);
    expect(data.genre).toBe(anotherFakeAlbum.genre);
    expect(data.releaseDate).toBe(anotherFakeAlbum.releaseDate);
    expect(data.numStars).toBe(anotherFakeAlbum.numStars);
    expect(data.ranking).toBe(anotherFakeAlbum.ranking);
    expect(data.upc).toBe(anotherFakeAlbum.upc);

    expect(data.producer).toBe(anotherFakeAlbum.producer);

    const updatedAlbum = await Album.findByPk(fakeAlbum.id);

    expect(updatedAlbum.name).toBe(anotherFakeAlbum.name);
    expect(updatedAlbum.genre).toBe(anotherFakeAlbum.genre);
    expect(updatedAlbum.releaseDate).toBe(anotherFakeAlbum.releaseDate);
    expect(updatedAlbum.numStars).toBe(anotherFakeAlbum.numStars);
    expect(updatedAlbum.ranking).toBe(anotherFakeAlbum.ranking);
    expect(updatedAlbum.upc).toBe(anotherFakeAlbum.upc);

    expect(updatedAlbum.producer).toBe(anotherFakeAlbum.producer);
  });

  test('/PUT - producer does not exists, album cant be updated', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const albumDict = await buildAlbum({ producer: relFakeProducer.id });
    const fakeAlbum = await createAlbum(albumDict);

    const anotherProducerDict = await buildMusician({});
    const anotherrelFakeProducer = await createMusician(anotherProducerDict);

    albumDict.producer = anotherrelFakeProducer.id;

    await anotherrelFakeProducer.destroy();

    const response = await request(app).put(`${ENDPOINT}/${fakeAlbum.id}`).send({
      name: albumDict.name,
      genre: albumDict.genre,
      releaseDate: albumDict.releaseDate,
      numStars: albumDict.numStars,
      ranking: albumDict.ranking,
      upc: albumDict.upc,
      producer: albumDict.producer,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PUT - Album does not exists, album cant be updated', async () => {
    const albumDict = await buildAlbum({});
    const fakeAlbum = await createAlbum(albumDict);
    const { id } = fakeAlbum;
    await fakeAlbum.destroy();

    const response = await request(app).put(`${ENDPOINT}/${id}`).send({
      name: albumDict.name,
      genre: albumDict.genre,
      releaseDate: albumDict.releaseDate,
      numStars: albumDict.numStars,
      ranking: albumDict.ranking,
      upc: albumDict.upc,
      producer: albumDict.producer,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Response with an updated album (no updates)', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const albumDict = await buildAlbum({ producer: relFakeProducer.id });
    const fakeAlbum = await createAlbum(albumDict);

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeAlbum.id}`)
      .send({ interpreters: [], collaborators: [] });

    const { status } = response;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);
  });

  test('/PATCH - Response with an updated album', async () => {
    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const albumDict = await buildAlbum({ producer: relFakeProducer.id });
    const fakeAlbum = await createAlbum(albumDict);

    const anotherProducerDict = await buildMusician({});
    const anotherrelFakeProducer = await createMusician(anotherProducerDict);

    const anotherFakeAlbum = await buildAlbum({ producer: anotherrelFakeProducer.id });

    const response = await request(app)
      .patch(`${ENDPOINT}/${fakeAlbum.id}`)
      .send({ name: anotherFakeAlbum.name });

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.name).toBe(anotherFakeAlbum.name);

    const updatedAlbum = await Album.findByPk(fakeAlbum.id);

    expect(updatedAlbum.name).toBe(anotherFakeAlbum.name);
  });

  test('/PATCH - producer does not exists, album cant be updated', async () => {
    const albumDict = await buildAlbum({});
    const fakeAlbum = await createAlbum(albumDict);

    const relProducerDict = await buildMusician({});
    const relFakeProducer = await createMusician(relProducerDict);

    const relFakeProducerId = relFakeProducer.id;
    await relFakeProducer.destroy();

    const response = await request(app).patch(`${ENDPOINT}/${fakeAlbum.id}`).send({
      producer: relFakeProducerId,
    });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/PATCH - Album does not exists, album cant be updated', async () => {
    const albumDict = await buildAlbum({});
    const fakeAlbum = await createAlbum(albumDict);
    const { id } = fakeAlbum;
    const { name } = fakeAlbum;
    await fakeAlbum.destroy();

    const response = await request(app).patch(`${ENDPOINT}/${id}`).send({ name });

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  test('/DELETE - Response with a deleted album', async () => {
    const albumDict = await buildAlbum({});
    const fakeAlbum = await createAlbum(albumDict);

    const response = await request(app).delete(`${ENDPOINT}/${fakeAlbum.id}`);

    const { status } = response;
    const { data } = response.body;

    expect(status).toBe(200);
    expect(response.statusCode).toBe(200);

    expect(data.id).toBe(fakeAlbum.id);

    const deletedAlbum = await Album.findByPk(fakeAlbum.id);
    expect(deletedAlbum).toBe(null);
  });

  test('/DELETE - Album does not exists, album cant be deleted', async () => {
    const albumDict = await buildAlbum({});
    const fakeAlbum = await createAlbum(albumDict);
    const { id } = fakeAlbum;
    await fakeAlbum.destroy();

    const response = await request(app).delete(`${ENDPOINT}/${id}`);

    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });
});
