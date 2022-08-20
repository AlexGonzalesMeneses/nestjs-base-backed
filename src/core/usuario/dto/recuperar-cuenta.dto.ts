import { CorreoLista, IsEmail, IsNotEmpty } from '../../../common/validation'
import { IsString } from 'class-validator'

export class RecuperarCuentaDto {
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string
}

export class ValidarRecuperarCuentaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string
}

export class NuevaContrasenaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}
