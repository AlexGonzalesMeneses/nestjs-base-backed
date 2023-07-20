import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateNested,
} from '../../../common/validation'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class PropiedadesDto {
  @ApiProperty({ example: 'person' })
  @IsOptional()
  @IsString()
  icono?: string

  @ApiProperty({ example: 'descripción nuevo módulo' })
  @IsString()
  descripcion?: string

  @ApiProperty({ example: 7 })
  @IsNumber()
  orden: number
}

export class CrearModuloDto {
  id: string
  @ApiProperty({ example: 'modulo prueba' })
  @IsNotEmpty()
  @IsString()
  label: string

  @ApiProperty({ example: '/prueba/modulo' })
  @IsNotEmpty()
  @IsString()
  url: string

  @ApiProperty({ example: 'modulo prueba nombre' })
  @IsNotEmpty()
  @IsString()
  nombre: string

  @ApiProperty()
  @ValidateNested()
  @Type(() => PropiedadesDto)
  propiedades: PropiedadesDto

  @IsOptional()
  @IsNumberString()
  idModulo?: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  @IsString()
  estado?: string
}

export class FiltroModuloDto extends PaginacionQueryDto {
  readonly seccion?: boolean
}
