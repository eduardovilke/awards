import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Nominee } from './entities/nominee.entity';

@Injectable()
export class NomineesService {
  constructor(
    @Inject('NOMINEE_REPOSITORY')
    private photoRepository: Repository<Nominee>,
  ) {}

  async findAll(): Promise<Nominee[]> {
    return this.photoRepository.find();
  }
}
