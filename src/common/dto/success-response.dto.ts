import { IsOptional } from '../../common/validation'

export class SuccessResponseDto {
  @IsOptional()
  finalizado: boolean

  @IsOptional()
  mensaje: string

  @IsOptional()
  datos: any
}
