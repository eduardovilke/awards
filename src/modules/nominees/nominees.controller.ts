import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { NomineesService } from './nominees.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AwardsIntervalsResponseDto } from './dtos/awards-intervals.dto';
import { NomineesQueryDto } from './dtos/nominees-query.dto';
import { NomineeResponseDto } from './dtos/nominee-response.dto';
import { instanceToPlain } from 'class-transformer';
import { UpdateNomineeDto } from './dtos/update-nominee.dto';

@Controller('nominees')
export class NomineesController {
  constructor(private readonly nomineesService: NomineesService) {}

  @Get('awards-intervals')
  @ApiResponse({
    status: 200,
    description:
      'Get producers with the longest and shortest intervals between awards',
    type: AwardsIntervalsResponseDto,
  })
  getAwardsIntervals() {
    return this.nomineesService.getAwardsIntervals();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    type: NomineeResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Nominee not found' })
  async findById(@Param('id') id: string) {
    const nominee = await this.nomineesService.findById(id);

    if (!nominee)
      throw new NotFoundException(`Nominee with id ${id} not found`);

    return instanceToPlain(new NomineeResponseDto(nominee));
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse()
  async softDeleteById(@Param('id') id: string) {
    await this.nomineesService.softDeleteById(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: NomineeResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNomineeDto,
  ) {
    const nomineeUpdated = await this.nomineesService.update(id, updateDto);

    return instanceToPlain(new NomineeResponseDto(nomineeUpdated));
  }

  @Get()
  findAll(@Query() query: NomineesQueryDto) {
    return this.nomineesService.findAllPaginated(query);
  }
}
