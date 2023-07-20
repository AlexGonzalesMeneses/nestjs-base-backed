import { ApiProperty } from '@nestjs/swagger'
import {
  CorreoLista,
  IsArray,
  IsEmail,
  IsNotEmpty,
  ValidateIf,
} from '../../../common/validation'

export class ActualizarUsuarioRolDto {
  @ApiProperty({ example: 'correo@yopmail.com' })
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
}
