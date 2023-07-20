import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateNested,
} from '../../../common/validation'
import { PropiedadesDto } from './crear-modulo.dto'
import { IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ActualizarModuloDto {
  @ApiProperty({ example: 'modulo prueba actualizado' })
  @IsNotEmpty()
  @IsString()
  label: string

  @ApiProperty({ example: '/prueba/modulo/actualizado' })
  @IsNotEmpty()
  @IsString()
  url: string

  @ApiProperty({ example: 'modulo prueba nombre actualizado' })
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
