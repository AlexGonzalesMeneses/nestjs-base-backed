import { IsNotEmpty } from 'class-validator';
export class EntidadDto {
  id: number;
  @IsNotEmpty()
  usuario: string;
  @IsNotEmpty()
  contrasena: string;
  estado: string;
}
