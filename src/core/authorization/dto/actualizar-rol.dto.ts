import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ActualizarRolDto {
  @IsNotEmpty()
  @ApiProperty()
  rol: string

  @IsNotEmpty()
  @ApiProperty()
  nombre: string

  estado?: string
}
