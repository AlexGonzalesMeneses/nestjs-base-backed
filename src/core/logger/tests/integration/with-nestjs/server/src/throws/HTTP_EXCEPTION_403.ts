import { ForbiddenException } from '@nestjs/common'

export default async () => {
  throw new ForbiddenException()
}
