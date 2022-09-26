import {
  IsNotEmpty,
  IsArray,
  IsEmail,
  CorreoLista,
  ValidateIf,
} from '../../../common/validation'

export class ActualizarUsuarioRolDto {
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @ValidateIf((o) => !o.roles)
  correoElectronico?: string | null

  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  roles?: Array<string>
}
