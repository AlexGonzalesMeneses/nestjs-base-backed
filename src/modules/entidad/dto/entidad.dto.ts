import { IsNotEmpty } from 'class-validator';
export class EntidadDto {
  id: number;
  @IsNotEmpty()
  razonSocial: string;
  @IsNotEmpty()
  descripcion: string;
  @IsNotEmpty()
  nit: string;
  @IsNotEmpty()
  sigla: string;
  email: string;
  telefonos: string;
  direccion: string;
  web: string;
  info: string;
  codigoPortalUnico: string;
  estado: string;
}
