import { EntityRepository, getRepository, Repository } from 'typeorm';

import { RefreshTokens } from '../entity/refreshTokens.entity';

@EntityRepository(RefreshTokens)
export class RefreshTokensRepository extends Repository<RefreshTokens> {
  findById(id: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('refreshTokens')
      .where('refreshTokens.id = :id', { id })
      .getOne();
  }

  eliminarTokensCaducos() {
    const now: Date = new Date();
    return getRepository(RefreshTokens)
      .createQueryBuilder('RefreshTokens')
      .delete()
      .from(RefreshTokens)
      .where('expires_at < :now', { now })
      .execute();
  }
}
