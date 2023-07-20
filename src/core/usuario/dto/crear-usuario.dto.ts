import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  CorreoLista,
  ValidateNested,
} from '../../../common/validation'
import { PersonaDto } from './persona.dto'
import { Type } from 'class-transformer'

export class CrearUsuarioDto {
  usuario?: string
  estado?: string
  contrasena?: string
  @ApiProperty({ example: '123456@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string
  @ApiProperty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto
  @ApiProperty({ example: false })
  ciudadaniaDigital?: boolean = false
  @ApiProperty({ example: ['3'] })
  @IsNotEmpty()
  roles: Array<string>
  usuarioCreacion?: string
}
