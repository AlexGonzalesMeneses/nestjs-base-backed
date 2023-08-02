import { EntityBadRequestException } from '../../../../../../../common/exceptions'

export default async () => {
  throw new EntityBadRequestException()
}
