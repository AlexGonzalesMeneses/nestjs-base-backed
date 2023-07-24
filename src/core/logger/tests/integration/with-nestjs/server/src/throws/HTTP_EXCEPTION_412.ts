import { PreconditionFailedException } from '@nestjs/common'

export default async () => {
  throw new PreconditionFailedException()
}
