import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  CorreoLista,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from '../../../common/validation'
import { PersonaDto } from './persona.dto'

export class ActualizarUsuarioRolDto {
  @ApiProperty({ example: 'correo@yopmail.com' })
  @ValidateNested()
  @Type(() => PersonaDto)
  persona?: PersonaDto

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @ValidateIf((o) => !o.roles)
  correoElectronico?: string | null

  @ApiProperty({ example: ['3'] })
  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  roles: Array<string>

  @IsOptional()
  ciudadaniaDigital?: boolean
}
