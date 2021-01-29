import { IsOptional } from 'class-validator';

export class SuccessResponseDto {
  @IsOptional()
  finalizado: boolean;

  @IsOptional()
  mensaje: string;

  @IsOptional()
  datos: any;
}
