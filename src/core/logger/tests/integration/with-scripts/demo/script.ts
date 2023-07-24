import path from 'path'
import { LoggerService } from '../../../../../logger'
import { HttpStatus } from '@nestjs/common'

LoggerService.initialize({
  appName: 'demo',
  level: 'trace',
  fileParams: {
    path: path.resolve(__dirname, 'logs'),
  },
  projectPath: path.resolve(__dirname),
})

const logger = LoggerService.getInstance()

logger.info('info message')
logger.debug('debug message')
logger.trace('trace message', {
  req: {
    method: 'get',
    path: '/api/users',
    httpStatus: '200',
    httpCode: 'OK',
    elapsedTime: 0.02,
  },
})

const err = new Error('BOOM')
const datos = { some: 'value' }

logger.error(err)
logger.error(err, 'custom err message')
logger.error(err, 'custom err message', { some: 'metadata' })
logger.error(err, 'custom err message', { some: 'metadata' }, 'MÓDULO')
logger.error(err, {
  mensaje: 'custom err message',
  metadata: { some: 'metadata' },
  modulo: 'MÓDULO',
})

logger.error(err, {
  mensaje: 'mensaje genérico opcional',
  modulo: 'MENSAJERÍA',
  metadata: { info: 'info adicional', datos },
})

logger.error(err, {
  httpStatus: HttpStatus.BAD_REQUEST,
  mensaje: '__MENSAJE__',
  metadata: { some: '__METADATA__' },
  appName: '__APP_NAME__',
  modulo: '__MODULO__',
  causa: '__CAUSA__',
  accion: '__ACCION__',
})

const data = {
  some: 'value',
  token: 'abc123',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1.eyJzdWI.jAHI9Q_CwSKhl6d_9rhM3N',
  },
  refreshToken: 'eyJhbGciOiJIUz.I6IkpvaG4gRG9lIiwiYWR.HI9Q_CwSKhl6d_9rhM3NrXu',
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
}

const err2 = {
  finalizo: true,
  mensaje: 'GET /api/users X (Bearer eyJhbGciOiJI.eyJzdWIi.VjAHI9Q_CwSKh)',
  fecha: Date.now(),
  secret: 'some secret Bearer abc.xyz.123 value',
}
logger.error(err2, { metadata: { data } })

process.stdout.write('\nTarea completada con éxito\n\n')
