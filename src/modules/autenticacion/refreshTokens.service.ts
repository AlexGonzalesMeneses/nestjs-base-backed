import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { RefreshTokensRepository } from './refreshTokens.repository';
import { RefreshTokens } from './refreshTokens.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokensRepository)
    private refreshTokensRepository: RefreshTokensRepository
  ) {}
  
  async findById(id: string): Promise<RefreshTokens> {
    return this.refreshTokensRepository.findById(id);
  }
  
  async create(grantId: string, ttl: number): Promise<RefreshTokens> {
    const currentDate = new Date();
    const refreshToken = this.refreshTokensRepository.create({
      id: nanoid(),
      grantId,
      iat: currentDate,
      expiresAt: new Date(currentDate.getTime() + ttl),
      isRevoked: false,
      data: {}
    });
    return this.refreshTokensRepository.save(refreshToken);
  }
}
