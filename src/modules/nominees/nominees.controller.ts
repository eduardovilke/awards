import { Controller, Get } from '@nestjs/common';
import { NomineesService } from './nominees.service';

@Controller('nominees')
export class NomineesController {
  constructor(private readonly nomineesService: NomineesService) {}

  @Get('awards-intervals')
  async getNominees() {
    return this.nomineesService.getAwardIntervals();
  }
}
