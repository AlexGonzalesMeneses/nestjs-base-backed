import { InternalServerErrorException } from '@nestjs/common'

export default async () => {
  throw new InternalServerErrorException()
}
