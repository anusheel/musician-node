import dotenv from 'dotenv';
import { Dialect } from 'sequelize/types';

dotenv.config();

const env: string = process.env.NODE_ENV || 'development';

interface Config {
  dialect: Dialect;
  storage: string;
  logging: boolean;
}

const config: Config = {
  // if we are running tests we use an in memory db with sqlite
  dialect: 'sqlite',
  // the storage option is only for sqlite
  storage: env === 'test' ? ':memory:' : process.env.DB_STORAGE,
  logging: false,
};

export default config;
