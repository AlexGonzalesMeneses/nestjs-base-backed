import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Orden } from '../constants/orden';

const LIMITE_MIN = 10;
const LIMITE_MAX = 50;
const PAGINA_MIN = 1;

export class PaginacionQueryDto {
  @ApiPropertyOptional({
    minimum: LIMITE_MIN,
    maximum: LIMITE_MAX,
    default: LIMITE_MIN,
  })
  @Type(() => Number)
  @IsInt()
  @Min(LIMITE_MIN)
  @Max(LIMITE_MAX)
  @IsOptional()
  readonly limite?: number = LIMITE_MIN;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PAGINA_MIN)
  @IsOptional()
  readonly pagina?: number = PAGINA_MIN;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly filtro?: string;

  @ApiPropertyOptional({
    enum: Orden,
    default: Orden.ASC,
  })
  @IsEnum(Orden)
  @IsOptional()
  readonly orden?: Orden = Orden.ASC;

  get omitir(): number {
    return (this.pagina - 1) * this.limite;
  }
}
