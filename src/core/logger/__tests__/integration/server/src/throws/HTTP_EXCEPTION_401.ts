import { UnauthorizedException } from '@nestjs/common'

export default async () => {
  throw new UnauthorizedException()
}
