import { NotFoundException } from '@nestjs/common'

export default async () => {
  throw new NotFoundException()
}
