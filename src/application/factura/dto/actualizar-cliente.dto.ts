import { IsNotEmpty, IsOptional } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ActualizarClienteDto {
  @ApiProperty({ example: 'AG789123' })
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  nombre: string

  @ApiProperty({ example: 'Gonzales' })
  @IsNotEmpty()
  apellido: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}
