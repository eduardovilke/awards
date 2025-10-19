import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class StudioResponseDto {
  @ApiProperty()
  @Expose({ toPlainOnly: true })
  id: string;

  @ApiProperty()
  @Expose({ toPlainOnly: true })
  name: string;
}

@Exclude()
export class ProducerResponseDto {
  @ApiProperty()
  @Expose({ toPlainOnly: true })
  id: string;

  @ApiProperty()
  @Expose({ toPlainOnly: true })
  name: string;
}

@Exclude()
export class NomineeResponseDto {
  @ApiProperty()
  @Expose({ toPlainOnly: true })
  id: string;

  @ApiProperty()
  @Expose({ toPlainOnly: true })
  year: number;

  @ApiProperty()
  @Expose({ toPlainOnly: true })
  title: string;

  @ApiProperty()
  @Expose({ toPlainOnly: true })
  isWinner: boolean;

  @Expose({ toPlainOnly: true })
  @ApiProperty({ type: [ProducerResponseDto] })
  @Type(() => ProducerResponseDto)
  producers: ProducerResponseDto[];

  @Expose({ toPlainOnly: true })
  @ApiProperty({ type: [StudioResponseDto] })
  @Type(() => StudioResponseDto)
  studios: StudioResponseDto[];

  constructor(partial: Partial<NomineeResponseDto>) {
    Object.assign(this, partial);
  }
}
