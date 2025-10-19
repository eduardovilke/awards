import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Nominee } from '../entities/nominee.entity';

export class NomineesQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (starts at 1)',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by nomination year',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by winner status (true or false)',
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isWinner?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by movie title (partial match)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  get where(): FindOptionsWhere<Nominee> {
    const where: FindOptionsWhere<Nominee> = {};

    if (this.year) where.year = this.year;
    if (this.isWinner !== undefined) where.isWinner = this.isWinner;
    if (this.title) where.title = ILike(`%${this.title}%`);

    return where;
  }
}
