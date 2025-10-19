import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateNomineeDto {
  @ApiPropertyOptional({ example: 1985, description: 'Year of the nomination' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @ApiPropertyOptional({ example: 'Batman & Robin', description: 'Title of the movie' })
  @IsOptional()
  @IsString()
  title?: string;
}
