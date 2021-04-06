import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

import { RefreshTokensRepository } from './refreshTokens.repository';
import { RefreshTokens } from './refreshTokens.entity';
import { UsuarioService } from '../usuario/usuario.service';

import { Cron } from '@nestjs/schedule';

@Injectable()
export class RefreshTokensService {
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
    console.log(' **** ', refreshToken);
    if (!refreshToken) {
      throw new NotFoundException();
    }
    console.log(
      ' ++++++++++++ isbefore ',
      dayjs().isBefore(dayjs(refreshToken.expiresAt)),
    );
    if (!dayjs().isBefore(dayjs(refreshToken.expiresAt))) {
      throw new UnauthorizedException();
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
    const ttl = parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      10,
    );
    // crear rotacion de refresh token
    console.log(
      ' ++++++++++++ diff ',
      dayjs(refreshToken.expiresAt).diff(dayjs()),
    );
    if (dayjs(refreshToken.expiresAt).diff(dayjs()) < 60000) {
      newRefreshToken = await this.create(refreshToken.grantId, ttl);
    }
    const payload = { id: usuario.id, roles };
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    };

    return {
      data,
      refresh_token: newRefreshToken
        ? { id: newRefreshToken.id, exp_in: ttl }
        : null,
    };
  }

  async removeByid(id: string) {
    const refreshToken = await this.refreshTokensRepository.findOne(id);
    if (!refreshToken) {
      throw new NotFoundException(`refreshToken con id ${id} no encontrado`);
    }
    return this.refreshTokensRepository.remove(refreshToken);
  }

  // @Cron('5 * * * * *')
  async eliminarCaducos() {
    return this.refreshTokensRepository.eliminarTokensCaducos();
  }
}
