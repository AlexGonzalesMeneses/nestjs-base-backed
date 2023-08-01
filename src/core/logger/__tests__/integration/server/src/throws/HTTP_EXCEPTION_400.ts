import { BadRequestException } from '@nestjs/common'

export default async () => {
  throw new BadRequestException()
}
