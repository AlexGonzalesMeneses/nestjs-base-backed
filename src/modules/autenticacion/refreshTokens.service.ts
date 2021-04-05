import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';

import { RefreshTokensRepository } from './refreshTokens.repository';
import { RefreshTokens } from './refreshTokens.entity';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokensRepository)
    private refreshTokensRepository: RefreshTokensRepository,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
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
      data: {},
    });
    return this.refreshTokensRepository.save(refreshToken);
  }

  async createAccessToken(refreshTokenId: string) {
    const refreshToken = await this.refreshTokensRepository.findById(
      refreshTokenId,
    );
    if (!refreshToken) {
      throw new NotFoundException();
    }
    const usuario = await this.usuarioService.buscarUsuarioId(
      refreshToken.grantId,
    );
    const payload = {};
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    };
    // TODO: valar la rotacion de refresh token
    return {
      data,
    };
  }
}
