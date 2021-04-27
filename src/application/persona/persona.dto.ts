import { ValidateIf } from 'class-validator';
import {
  IsNotEmpty,
  IsString,
  NombreApellido,
  NroDocumento,
} from '../../common/validation';

export class PersonaDto {
  @IsNotEmpty()
  @NroDocumento()
  nroDocumento: string;

  @IsNotEmpty()
  @NombreApellido()
  nombres: string;

  @IsString()
  @ValidateIf((o) => !o.segundoApellido)
  @NombreApellido()
  primerApellido?: string;

  @ValidateIf((o) => !o.primerApellido)
  @NombreApellido()
  segundoApellido?: string;

  @IsString()
  fechaNacimiento: string;
}
