import {
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsString,
} from '../../../common/validation'
import { PropiedadesDto } from './crear-modulo.dto'
import { IsOptional } from 'class-validator'

export class ActualizarModuloDto {
  @IsNotEmpty()
  @IsString()
  label: string

  @IsNotEmpty()
  @IsString()
  url: string

  @IsNotEmpty()
  @IsString()
  nombre: string

  @IsObject()
  propiedades: PropiedadesDto

  @IsOptional()
  @IsNumberString()
  idModulo?: string

  @IsOptional()
  @IsString()
  estado?: string
}
