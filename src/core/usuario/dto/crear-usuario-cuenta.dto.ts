import { CorreoLista, IsEmail, IsNotEmpty } from '../../../common/validation'
import { IsString } from 'class-validator'

export class CrearUsuarioCuentaDto {
  nombres: string
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}
