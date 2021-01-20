import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SegipPersonaDTO {
  @ApiProperty()
  Complemento: string;
  @ApiProperty()
  @IsNotEmpty()
  NumeroDocumento: string;
  @ApiProperty()
  @IsNotEmpty()
  Nombres: string;
  @ApiProperty()
  @IsNotEmpty()
  PrimerApellido: string;
  @ApiProperty()
  @IsNotEmpty()
  SegundoApellido: string;
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/)
  FechaNacimiento: string;
}
