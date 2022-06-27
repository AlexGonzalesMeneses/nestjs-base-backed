import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class PropiedadesDto {
  @IsString()
  icono: string;

  @IsString()
  descripcion?: string;

  @IsString()
  color_light?: string;

  @IsString()
  color_dark?: string;
}

export class CrearModuloDto {

  id: string
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsObject()
  propiedades: PropiedadesDto;

  fidModulo: string
}
