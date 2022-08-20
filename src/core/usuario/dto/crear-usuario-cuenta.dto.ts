import { CorreoLista, IsEmail, IsNotEmpty } from '../../../common/validation'
import { PersonaDto } from './persona.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CrearUsuarioCuentaDto {
  usuario?: string

  estado?: string

  contrasena?: string

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto

  usuarioCreacion?: string
}
