import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { RefreshTokensService } from '../service/refreshTokens.service';

@Controller('refreshtoken')
export class RefreshTokensController {
  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  @UseGuards(LocalAuthGuard)
  @UseGuards(OidcAuthGuard)
  @Delete(':id')
  async eliminarRefreshToken(@Param('id') id: string) {
    //
    return this.refreshTokensService.removeByid(id);
  }
}
