import { IsNotEmpty } from 'class-validator';
import { PersonaDto } from 'src/application/persona/persona.dto';
// import { UsuarioRolDto } from './usuario-rol.dto';

export class CrearUsuarioDto {
  @IsNotEmpty()
  usuario: string;

  estado?: string;

  contrasena?: string;

  persona: PersonaDto;

  @IsNotEmpty()
  roles: Array<string>;

  usuarioCreacion?: string;
}
