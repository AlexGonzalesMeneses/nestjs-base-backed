// import { IsEmail } from 'class-validator';
import { IsNotEmpty, IsEmail } from '../../../common/lib/class-validator';
import { PersonaDto } from 'src/application/persona/persona.dto';
// import { UsuarioRolDto } from './usuario-rol.dto';

export class CrearUsuarioDto {
  usuario?: string;

  estado?: string;

  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;

  persona: PersonaDto;

  @IsNotEmpty()
  roles: Array<string>;

  usuarioCreacion?: string;
}
