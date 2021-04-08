import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SINCredencialesDTO {
  @ApiProperty()
  Nit: string;
  @ApiProperty()
  @IsNotEmpty()
  Usuario: string;
  @ApiProperty()
  @IsNotEmpty()
  Contrasena: string;
}
