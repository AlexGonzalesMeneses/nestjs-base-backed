import { IsNotEmpty } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearParametroDto {
  @ApiProperty()
  @IsNotEmpty()
  codigo: string
  @ApiProperty()
  @IsNotEmpty()
  nombre: string
  @ApiProperty()
  @IsNotEmpty()
  grupo: string
  @ApiProperty()
  @IsNotEmpty()
  descripcion: string
  estado?: string
}
