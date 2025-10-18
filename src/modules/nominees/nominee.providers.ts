import { DataSource } from 'typeorm';
import { Nominee } from './entities/nominee.entity';
import { Producer } from './entities/producer.entity';
import { Studio } from './entities/studio.entity';

export const nomineeProviders = [
  {
    provide: 'NOMINEE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Nominee),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PRODUCER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Producer),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'STUDIO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Studio),
    inject: ['DATA_SOURCE'],
  },
];
