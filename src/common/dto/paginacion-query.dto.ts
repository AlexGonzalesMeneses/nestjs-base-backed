import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from '../validation'

const LIMITE_MIN = 10
const LIMITE_MAX = 50
const PAGINA_MIN = 1

export class PaginacionQueryDto {
  @ApiPropertyOptional({
    minimum: LIMITE_MIN,
    maximum: LIMITE_MAX,
    default: LIMITE_MIN,
  })
  @Type(() => Number)
  @IsInt()
  @Min(LIMITE_MIN, {
    message: `El valor mínimo para $property debe ser ${LIMITE_MIN}.`,
  })
  @Max(LIMITE_MAX, {
    message: `El valor máximo para $property debe ser ${LIMITE_MAX}.`,
  })
  @IsOptional()
  readonly limite: number = LIMITE_MIN

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PAGINA_MIN, {
    message: `El valor mínimo para $property debe ser ${PAGINA_MIN}.`,
  })
  @IsOptional()
  readonly pagina: number = PAGINA_MIN

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly filtro?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : null))
  readonly orden?: Array<string>

  get saltar(): number {
    return (this.pagina - 1) * this.limite
  }
}
