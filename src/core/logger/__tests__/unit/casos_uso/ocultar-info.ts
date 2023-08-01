import { LoggerService } from '../../../../logger'

const logger = LoggerService.getInstance()

export async function ocultarInfo() {
  const data = {
    some: 'value',
    token: 'abc123',
    headers: {
      authorization: 'Bearer eyJhbGciOiJIUzI1.eyJzdWI.jAHI9Q_CwSKhl6d_9rhM3N',
    },
    refreshToken:
      'eyJhbGciOiJIUz.I6IkpvaG4gRG9lIiwiYWR.HI9Q_CwSKhl6d_9rhM3NrXu',
    datos_sensibles: {
      contrasena: 'contrasena',
      password: 'password',
      authorization: 'authorization',
      cookie: 'cookie',
      token: 'token',
      access_token: 'access_token',
      idToken: 'idToken',
      accesstoken: 'accesstoken',
      refreshtoken: 'refreshtoken',
      refresh_token: 'refresh_token',
    },
    DatosSensibles: {
      Contrasena: 'Contrasena',
      Password: 'Password',
      Authorization: 'Authorization',
      Cookie: 'Cookie',
      Token: 'Token',
      Access_Token: 'Access_Token',
      IdToken: 'IdToken',
      AccessToken: 'AccessToken',
      RefreshToken: 'RefreshToken',
      Refresh_Token: 'Refresh_Token',
    },
    response: {
      finalizo: true,
      mensaje: 'GET /api/users X (Bearer eyJhbGciOiJI.eyJzdWIi.VjAHI9Q_CwSKh)',
      fecha: Date.now(),
      secret: 'some secret Bearer abc.xyz.123 value',
    },
  }

  logger.error({ metadata: data })
}
