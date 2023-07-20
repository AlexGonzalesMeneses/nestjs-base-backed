import { HttpStatus } from '@nestjs/common'
import { IsNumber, IsObject, IsOptional, IsString } from './common/validation'

export class LogRequestDTO {
  @IsNumber()
  @IsOptional()
  codigo?: HttpStatus

  @IsString()
  @IsOptional()
  mensaje?: string

  @IsString()
  @IsOptional()
  causa?: string

  @IsString()
  @IsOptional()
  sistema?: string

  @IsString()
  @IsOptional()
  origen?: string

  @IsString()
  @IsOptional()
  accion?: string

  // Info adicional propios del frontend

  @IsString()
  @IsOptional()
  fecha?: string

  @IsObject()
  @IsOptional()
  detalle?: unknown

  @IsString()
  @IsOptional()
  navegador?: string
}
