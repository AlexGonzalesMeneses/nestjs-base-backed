import { EntityRepository, getRepository, Repository } from 'typeorm';

import { RefreshTokens } from './refreshTokens.entity';

@EntityRepository(RefreshTokens)
export class RefreshTokensRepository extends Repository<RefreshTokens> {
  findById(id: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('refreshTokens')
      .where('refreshTokens.id = :id', { id })
      .getOne();
  }
}
