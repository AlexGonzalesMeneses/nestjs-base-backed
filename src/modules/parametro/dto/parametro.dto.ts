import { IsNotEmpty } from 'class-validator';
export class ParametroDto {
  id: number;
  @IsNotEmpty()
  codigo: string;
  @IsNotEmpty()
  nombre: string;
  @IsNotEmpty()
  grupo: string;
  @IsNotEmpty()
  descripcion: string;
}
