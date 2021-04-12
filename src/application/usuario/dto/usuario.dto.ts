import { IsNotEmpty } from 'class-validator';
import { PersonaDto } from 'src/application/persona/persona.dto';
export class UsuarioDto {
  @IsNotEmpty()
  usuario: string;

  @IsNotEmpty()
  contrasena: string;

  estado?: string;

  persona: PersonaDto;

  usuarioCreacion?: string;
  /*   @ApiProperty()
  email: string;

  @ApiProperty()
  code_activacion: string;

  @ApiProperty()
  last_login: string;

  @ApiProperty()
  end_last_login: string; */
}
