import { IsString, IsNotEmpty } from 'class-validator';

export class CrearModuloDto {
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  icono: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;
}
