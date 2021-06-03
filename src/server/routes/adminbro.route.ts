import { musicianInstrumentChoices, albumGenreChoices } from 'server/utils/constants/fieldChoices';

import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroSequelize from '@admin-bro/sequelize';
import { sequelize } from 'data/models';
import { customNew } from 'server/utils/adminbro/handlers';

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
  rootPath: '/admin',
  resources: [
    {
      resource: sequelize.models.Musician,
      options: {
        parent: {
          name: 'Database',
          icon: 'Api',
        },
        listProperties: ['id', 'firstName', 'lastName', 'instrument', 'age', 'fans', 'inspiredAt'],
        properties: {
          instrument: {
            availableValues: musicianInstrumentChoices[0].map((instrument: string) => ({
              value: instrument,
              label: instrument.toUpperCase(),
            })),
          },
        },
      },
    },
    {
      resource: sequelize.models.Album,
      options: {
        parent: {
          name: 'Database',
          icon: 'Api',
        },
        listProperties: ['id', 'name', 'genre', 'releaseDate', 'numStars', 'ranking', 'upc'],
        properties: {
          genre: {
            availableValues: albumGenreChoices[0].map((genre: string) => ({
              value: genre,
              label: genre.toUpperCase(),
            })),
          },
        },
      },
    },
    {
      resource: sequelize.models.Song,
      options: {
        parent: {
          name: 'Database',
          icon: 'Api',
        },
        listProperties: ['id', 'name', 'lyrics', 'code'],
        actions: {
          new: {
            handler: customNew,
          },
        },
        properties: {
          id: {
            isVisible: true,
            isRequired: true,
          },
        },
      },
    },
    {
      resource: sequelize.models.Concert,
      options: {
        parent: {
          name: 'Database',
          icon: 'Api',
        },
        listProperties: ['name', 'place', 'date', 'isFree'],
        actions: {
          new: {
            handler: customNew,
          },
        },
        properties: {
          name: {
            isVisible: true,
            isRequired: true,
          },
        },
      },
    },
  ],
  branding: {
    companyName: 'Database dashboard',
    softwareBrothers: false,
    logo: false,
    favicon: 'https://imagine.ai/img/favicon.ico',
  },
});

const adminbroRouter = AdminBroExpress.buildRouter(adminBro);

export default adminbroRouter;
