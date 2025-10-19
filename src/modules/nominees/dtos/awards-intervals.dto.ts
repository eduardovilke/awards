import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AwardsIntervalsDto {
  @Expose()
  @ApiProperty()
  producer: string;

  @Expose()
  @ApiProperty()
  interval: number;

  @Expose()
  @ApiProperty()
  previousWin: number;

  @Expose()
  @ApiProperty()
  followingWin: number;
}

export class AwardsIntervalsResponseDto {
  @Expose()
  @Type(() => AwardsIntervalsDto)
  @ApiProperty({ type: [AwardsIntervalsDto] })
  min: AwardsIntervalsDto[];

  @Expose()
  @Type(() => AwardsIntervalsDto)
  @ApiProperty({ type: [AwardsIntervalsDto] })
  max: AwardsIntervalsDto[];
}
