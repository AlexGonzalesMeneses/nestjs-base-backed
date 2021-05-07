import {
  IsNotEmpty,
  IsArray,
  IsEmail,
  CorreoLista,
} from '../../../common/validation';
import { ValidateIf } from 'class-validator';

export class ActualizarUsuarioRolDto {
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @ValidateIf((o) => !o.roles)
  correoElectronico?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  roles?: Array<string>;
}
