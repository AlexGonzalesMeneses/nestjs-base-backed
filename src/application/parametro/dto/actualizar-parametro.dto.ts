import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarParametroDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string
  @IsNotEmpty()
  @ApiProperty({ example: 'Documento de extranjería actualizado' })
  nombre: string
  @IsNotEmpty()
  @ApiProperty({ example: 'TD' })
  grupo: string
  @ApiProperty({ example: 'Tipo de documento de extranjería actualizado' })
  descripcion: string
  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
