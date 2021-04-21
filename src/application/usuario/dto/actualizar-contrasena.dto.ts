import { IsNotEmpty, IsString } from 'class-validator';

export class ActualizarContrasenaDto {
  @IsString()
  @IsNotEmpty()
  contrasenaActual: string;

  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string;
}
