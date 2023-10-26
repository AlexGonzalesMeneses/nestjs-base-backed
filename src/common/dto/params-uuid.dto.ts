import { IsUUID } from '../validation'

export class ParamUuidDto {
  @IsUUID({ example: 'a9d1a5cc-4590-5c67-a0b2-a4b37b862802' })
  id: string
}
