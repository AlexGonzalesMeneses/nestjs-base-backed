import { IsOptional, IsPositive } from 'class-validator';

export class PaginacionQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
