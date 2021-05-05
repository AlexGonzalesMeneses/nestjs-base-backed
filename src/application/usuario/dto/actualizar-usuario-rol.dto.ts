import { IsNotEmpty, IsArray } from '../../../common/validation';

export class ActualizarUsuarioRolDto {
  @IsNotEmpty()
  @IsArray()
  roles: Array<string>;
}
