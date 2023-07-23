import { IsIn, IsNotEmpty, NotEquals } from 'class-validator';

export class TimeFrameDto {
  @IsNotEmpty()
  @NotEquals(null)
  timeFrame: string;
}
