import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CrearRolDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Dumi' })
  rol: string

  @IsNotEmpty()
  @ApiProperty({ example: 'Rol Fake' })
  nombre: string
  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
