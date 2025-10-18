import { DataSource } from 'typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [
          path.resolve(
            __dirname,
            '..',
            '..',
            'modules',
            '**',
            '*.entity.{t,j}s',
          ),
        ],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy()
      });

      return dataSource.initialize();
    },
  },
];
