import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UsuarioDto {
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  usuario: string;
  @ApiProperty()
  @IsNotEmpty()
  contrasena: string;
  @ApiProperty()
  estado: string;
}
