import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CrearRolDto {
  @IsNotEmpty()
  @ApiProperty()
  rol: string

  @IsNotEmpty()
  @ApiProperty()
  nombre: string

  estado?: string
}
