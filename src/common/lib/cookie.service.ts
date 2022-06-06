export class CookieService {
  static makeConfig(configService) {
    const expiresIn = configService.get('REFRESH_TOKEN_EXPIRES_IN');
    const ttl = parseInt(expiresIn, 10);
    return {
      httpOnly: true,
      // secure: configService.get('REFRESH_TOKEN_SECURE'),
      expires: new Date(Date.now() + ttl),
      path: configService.get('REFRESH_TOKEN_PATH'),
    };
  }

  static makeConfigHttpOnlyFalse(configService) {
    const expiresIn = configService.get('REFRESH_TOKEN_EXPIRES_IN');
    const ttl = parseInt(expiresIn, 10);
    return {
      httpOnly: false,
      // secure: configService.get('REFRESH_TOKEN_SECURE'),
      expires: new Date(Date.now() + ttl),
      path: configService.get('REFRESH_TOKEN_PATH'),
    };
  }
}
