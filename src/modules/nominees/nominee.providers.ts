
import { DataSource } from 'typeorm';
import { Nominee } from './nominee.entity';

export const nomineeProviders = [
  {
    provide: 'NOMINEE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Nominee),
    inject: ['DATA_SOURCE'],
  },
];
