import { IsUUID } from '../../common/validation';

export class ParamUuidDto {
  @IsUUID()
  id: string;
}
