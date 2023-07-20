import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'
import { PersonaDto } from './persona.dto'
export class UsuarioDto {
  @ApiProperty()
  @IsNotEmpty()
  usuario: string
  @ApiProperty()
  @IsNotEmpty()
  contrasena: string
  @ApiProperty()
  estado?: string
  @ApiProperty()
  persona: PersonaDto
  @ApiProperty()
  usuarioCreacion?: string
  /*   @ApiProperty()
  email: string;

  @ApiProperty()
  code_activacion: string;

  @ApiProperty()
  last_login: string;

  @ApiProperty()
  end_last_login: string; */
}
