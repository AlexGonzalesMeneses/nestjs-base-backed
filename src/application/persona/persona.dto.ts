import { IsNotEmpty, IsString } from 'class-validator';
export class PersonaDto {
  @IsNotEmpty()
  nroDocumento: string;

  @IsNotEmpty()
  nombres: string;

  @IsString()
  primerApellido: string;

  @IsString()
  segundoApellido: string;

  @IsString()
  fechaNacimiento: string;
}
