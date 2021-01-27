import { IsOptional, IsPositive } from 'class-validator';

export class PaginacionQueryDto {
  @IsOptional()
  @IsPositive()
  limite: number;

  @IsOptional()
  @IsPositive()
  pagina: number;
}
