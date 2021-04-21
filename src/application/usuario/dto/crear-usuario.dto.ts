import { IsEmail, IsNotEmpty } from 'class-validator';
import { PersonaDto } from '../../../application/persona/persona.dto';

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
