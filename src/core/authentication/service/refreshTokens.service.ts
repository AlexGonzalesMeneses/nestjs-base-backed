import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

import { RefreshTokensRepository } from '../repository/refreshTokens.repository';
import { RefreshTokens } from '../entity/refreshTokens.entity';
import { UsuarioService } from '../../usuario/service/usuario.service';

import { Cron } from '@nestjs/schedule';

import * as dotenv from 'dotenv';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';
import { EntityUnauthorizedException } from '../../../common/exceptions/entity-unauthorized.exception';
import { TextService } from '../../../common/lib/text.service';

dotenv.config();

@Injectable()
export class RefreshTokensService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(RefreshTokensRepository)
    private refreshTokensRepository: RefreshTokensRepository,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: string): Promise<RefreshTokens> {
    return this.refreshTokensRepository.findById(id);
  }

  async create(grantId: string): Promise<RefreshTokens> {
    const ttl = parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      10,
    );
    const currentDate = new Date();
    const refreshToken = this.refreshTokensRepository.create({
      id: TextService.generateNanoId(),
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
      throw new EntityNotFoundException(
        Messages.EXCEPTION_REFRESH_TOKEN_NOT_FOUND,
      );
    }

    if (!dayjs().isBefore(dayjs(refreshToken.expiresAt))) {
      throw new EntityUnauthorizedException(
        Messages.EXCEPTION_REFRESH_TOKEN_EXPIRED,
      );
    }

    // usuario
    const usuario = await this.usuarioService.buscarUsuarioId(
      refreshToken.grantId,
    );

    const roles = [];
    if (usuario.roles.length) {
      usuario.roles.map((usuarioRol) => {
        roles.push(usuarioRol.rol);
      });
    }

    let newRefreshToken = null;
    const rft = parseInt(this.configService.get('REFRESH_TOKEN_ROTATE_IN'), 10);

    // crear rotacion de refresh token
    if (dayjs(refreshToken.expiresAt).diff(dayjs()) < rft) {
      newRefreshToken = await this.create(refreshToken.grantId);
    }
    const payload = { id: usuario.id, roles };
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    };

    return {
      data,
      refresh_token: newRefreshToken ? { id: newRefreshToken.id } : null,
    };
  }

  async removeByid(id: string) {
    const refreshToken = await this.refreshTokensRepository.findOne(id);
    if (!refreshToken) {
      return {};
    }
    return this.refreshTokensRepository.remove(refreshToken);
  }

  @Cron(process.env.REFRESH_TOKEN_REVISIONS)
  async eliminarCaducos() {
    return this.refreshTokensRepository.eliminarTokensCaducos();
  }
}
