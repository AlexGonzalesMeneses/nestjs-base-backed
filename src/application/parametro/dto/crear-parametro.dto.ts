import { IsNotEmpty } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearParametroDto {
  @ApiProperty({ example: 'TD-2' })
  @IsNotEmpty()
  codigo: string
  @ApiProperty({ example: 'Documento de extranjería' })
  @IsNotEmpty()
  nombre: string
  @ApiProperty({ example: 'TD' })
  @IsNotEmpty()
  grupo: string
  @ApiProperty({ example: 'Tipo de documento de extranjería' })
  @IsNotEmpty()
  descripcion: string
  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
