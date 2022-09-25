import { IsNumberString } from '../validation'

export class ParamNumberStringID {
  @IsNumberString()
  id: string
}
