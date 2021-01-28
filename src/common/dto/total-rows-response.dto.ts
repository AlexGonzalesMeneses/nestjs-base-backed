import { IsPositive } from 'class-validator';

export class TotalRowsResponseDto {
  @IsPositive()
  total: number;

  rows: any[];
}
