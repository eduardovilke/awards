import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Nominee } from './entities/nominee.entity';
import { Producer } from './entities/producer.entity';
import { NomineeResponseDto } from './dtos/nominee-response.dto';
import { instanceToPlain } from 'class-transformer';
import { NomineesQueryDto } from './dtos/nominees-query.dto';
import { UpdateNomineeDto } from './dtos/update-nominee.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NomineesService {
  constructor(
    @InjectRepository(Nominee)
    private nomineeRepository: Repository<Nominee>,
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>,
  ) {}

  findById(id: string) {
    return this.nomineeRepository.findOne({
      where: { id },
      relations: ['studios', 'producers'],
    });
  }

  async update(id: string, updateDto: UpdateNomineeDto) {
    const nominee = await this.nomineeRepository.findOneBy({ id });
    if (!nominee) throw new NotFoundException(`Nominee ${id} not found`);

    Object.assign(nominee, updateDto);
    return this.nomineeRepository.save(nominee);
  }

  softDeleteById(id: string) {
    return this.nomineeRepository.softDelete(id);
  }

  async findAllPaginated(filters: Partial<NomineesQueryDto>) {
    const { where, page, limit } = filters;

    const [entities, total] = await this.nomineeRepository.findAndCount({
      where,
      relations: ['studios', 'producers'],
      skip: (page - 1) * limit,
      take: limit,
      order: { year: 'ASC' },
    });

    return {
      data: entities.map((entity) =>
        instanceToPlain(new NomineeResponseDto(entity)),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAwardsIntervals() {
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
                previousWin: i.to,
                followingWin: i.from,
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
