import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Nominee } from './entities/nominee.entity';
import { Producer } from './entities/producer.entity';

@Injectable()
export class NomineesService {
  constructor(
    @Inject('NOMINEE_REPOSITORY')
    private nomineeRepository: Repository<Nominee>,
    @Inject('PRODUCER_REPOSITORY')
    private producerRepository: Repository<Producer>,
  ) {}

  async findAll(): Promise<Nominee[]> {
    return this.nomineeRepository.find();
  }

  async getAwardIntervals() {
    const query = this.producerRepository
      .createQueryBuilder('producer')
      .innerJoin(
        'nominees_producers_producers',
        'np',
        'np.producers_id = producer.id',
      )
      .innerJoin(
        'nominees',
        'nominee',
        'nominee.id = np.nominees_id AND nominee.isWinner = true',
      )
      .select('producer.name', 'producer')
      .addSelect('GROUP_CONCAT(nominee.year)', 'years')
      .groupBy('producer.id')
      .having('COUNT(nominee.id) > 1')
      .orderBy('producer.name', 'ASC');

    const result = await query.getRawMany<{
      producer: string;
      years: string;
    }>();

    return result
      .map((r) => ({
        ...r,
        intervals: r.years
          .split(',')
          .map(Number)
          .sort((a, b) => a - b)
          .map((year, i, arr) => {
            const isLast = i === arr.length - 1;
            if (isLast) return false;
            return {
              from: year,
              to: arr[i + 1],
              interval: arr[i + 1] - year,
            };
          })
          .filter(Boolean),
      }))
      .reduce(
        (acc, curr) => {
          curr.intervals.forEach(
            (i: {
              producer: string;
              interval: number;
              from: number;
              to: number;
            }) => {
              const obj = {
                producer: curr.producer,
                interval: i.interval,
                previousWin: i.from,
                followingWin: i.to,
              };

              if (!acc.min.length || i.interval < acc.min[0].interval) {
                acc.min = [obj];
              } else if (i.interval === acc.min[0].interval) {
                acc.min.push(obj);
              }

              if (!acc.max.length || i.interval > acc.max[0].interval) {
                acc.max = [obj];
              } else if (i.interval === acc.max[0].interval) {
                acc.max.push(obj);
              }
            },
          );

          return acc;
        },
        { min: [], max: [] },
      );
  }
}
