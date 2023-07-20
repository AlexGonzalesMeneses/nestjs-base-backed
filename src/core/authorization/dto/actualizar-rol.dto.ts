import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ActualizarRolDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Dumi actualizado' })
  rol: string

  @IsNotEmpty()
  @ApiProperty({ example: 'Rol fake actualizado' })
  nombre: string
  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
