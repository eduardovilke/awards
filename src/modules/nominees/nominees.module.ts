import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { NomineesService } from './nominees.service';
import { Nominee } from './entities/nominee.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { detectDelimiter, stringToArray, toBoolean } from 'src/common/utils';
import { Producer } from './entities/producer.entity';
import { Studio } from './entities/studio.entity';
import { MovieCsvRow } from './interfaces/nominee-csv.interface';
import { NomineesController } from './nominees.controller';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { Writable } from 'stream';

@Module({
  imports: [TypeOrmModule.forFeature([Nominee, Producer, Studio])],
  controllers: [NomineesController],
  providers: [NomineesService],
})
export class NomineesModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Nominee)
    private nomineeRepository: Repository<Nominee>,
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>,
    @InjectRepository(Studio)
    private studioRepository: Repository<Studio>,
  ) {}

  async onApplicationBootstrap() {
    console.log('Loading CSV data into the database... 📥');
    await this.loadCsv();
    console.log('CSV data loaded successfully! ✅');
  }

  async loadCsv() {
    const filePath = path.resolve(process.cwd(), 'Movielist.csv');
    const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
    const delimiter = detectDelimiter(firstLine);

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, delimiter, trim: true }))
        .pipe(
          new Writable({
            objectMode: true,
            write: async (row: MovieCsvRow, _, callback) => {
              try {
                const producers = await Promise.all(
                  stringToArray(row.producers).map(async (name) => {
                    await this.producerRepository.upsert({ name }, ['name']);
                    return this.producerRepository.findOneBy({ name });
                  }),
                );

                const studios = await Promise.all(
                  stringToArray(row.studios).map(async (name) => {
                    await this.studioRepository.upsert({ name }, ['name']);
                    return this.studioRepository.findOneBy({ name });
                  }),
                );

                const newNominee = this.nomineeRepository.create({
                  title: row.title,
                  year: +row.year,
                  isWinner: toBoolean(row.winner),
                  producers,
                  studios,
                });

                const nomineeExists = await this.nomineeRepository.findOneBy({
                  title: newNominee.title,
                  year: newNominee.year,
                });

                if (!nomineeExists) {
                  await this.nomineeRepository.save(newNominee);
                }

                callback();
              } catch (err) {
                callback(err);
              }
            },
          }),
        )
        .on('finish', () => resolve())
        .on('error', (err) => {
          console.error('Error reading CSV ❌:', err.message);
          reject(err);
        });
    });
  }
}
