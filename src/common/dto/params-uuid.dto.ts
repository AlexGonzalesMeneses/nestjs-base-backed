import { IsUUID } from 'class-validator';

export class ParamUuidDto {
  @IsUUID()
  id: string;
}
