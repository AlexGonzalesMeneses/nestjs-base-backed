import { IsPositive } from 'class-validator';
import { EntidadDto } from 'src/modules/entidad/dto/entidad.dto';

export class ResponseTotalRowsDto {
  @IsPositive()
  total: number;

  rows: EntidadDto[];
}
