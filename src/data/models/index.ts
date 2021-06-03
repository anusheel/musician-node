/* eslint import/no-cycle: "off" */
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import config from 'config';

import Album from './album.model';
import Concert from './concert.model';
import Musician from './musician.model';
import Song from './song.model';

dotenv.config();

const sequelize = new Sequelize({
  ...config,
  models: [Album, Concert, Musician, Song],
});

if (process.env.NODE_ENV !== 'test' && !process.env.USE_MIGRATIONS) {
  sequelize.sync({ alter: true });
}

export { sequelize, Musician, Album, Song, Concert };
