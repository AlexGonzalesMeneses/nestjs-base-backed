import { IsNotEmpty, IsString } from '../../../common/validation'

export class CambioRolDto {
  @IsString()
  @IsNotEmpty()
  idRol: string
}
