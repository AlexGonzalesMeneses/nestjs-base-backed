import path from 'path'
import { Server } from 'http'
import { LoggerService } from '../../../logger'
import { createLogFile, delay, detenerServer, iniciarServer } from '../utils'
import { testEstado } from './casos_uso/testA'
import { testE0 } from './casos_uso/testE0'
import { testE1 } from './casos_uso/testE1'
import { testE2 } from './casos_uso/testE2'
import { testE3_1 } from './casos_uso/testE3_1'
import { testE3_2 } from './casos_uso/testE3_2'
import { testE3_3 } from './casos_uso/testE3_3'
import { testE4 } from './casos_uso/testE4'
import { testE5 } from './casos_uso/testE5'
import { testE6 } from './casos_uso/testE6'
import { testE7 } from './casos_uso/testE7'
import { testE8_1 } from './casos_uso/testE8_1'
import { testE8_2 } from './casos_uso/testE8_2'
import { testE8_5 } from './casos_uso/testE8_5'
import { testE9 } from './casos_uso/testE9'
import { testE10 } from './casos_uso/testE10'

let server: Server | null = null

describe('Logger prueba de integración', () => {
  beforeAll(async () => {
    await createLogFile('server/50_app_error.log')
    await createLogFile('server/40_app_warn.log')
    await createLogFile('server/30_app_info.log')
    await createLogFile('server/20_app_debug.log')
    await createLogFile('server/10_app_trace.log')
    await createLogFile('server/100_audit_application.log')

    server = await iniciarServer(path.resolve(__dirname, 'server/src/main'))
    await delay()
  })

  afterAll(async () => {
    if (server) {
      await detenerServer(server)
      await delay()
    }
  })

  it('[logger] Verificando parámetros de configuración', async () => {
    const params = LoggerService.getLoggerParams()
    expect(params).toMatchObject({
      appName: 'server',
      level: 'error,warn,info,debug,trace',
      hide: '',
      lokiParams: undefined,
      auditParams: { context: 'application,request,response' },
      _levels: ['error', 'warn', 'info', 'debug', 'trace'],
      _audit: ['application', 'request', 'response'],
    })
    expect(params).toHaveProperty('fileParams')
    expect(params).toHaveProperty('projectPath')
    expect(params?.fileParams).toMatchObject({
      size: '5M',
      rotateInterval: '1d',
      compress: 'false',
    })
    expect(params?.fileParams).toHaveProperty('path')
  })

  it('[logger] servicio estado', async () => {
    await testEstado()
  })

  it('[logger] error de tipo E0 (UNKNOWN_ERROR) ', async () => {
    await testE0()
  })

  it('[logger] error de tipo E1 (EMPTY_ERROR) ', async () => {
    await testE1()
  })

  it('[logger] error de tipo E2 (STRING_ERROR) ', async () => {
    await testE2()
  })

  it('[logger] error de tipo testE3_1 (SERVER_CONEXION axios) ', async () => {
    await testE3_1()
  })

  it('[logger] error de tipo testE3_2 (SERVER_CONEXION fetch) ', async () => {
    await testE3_2()
  })

  it('[logger] error de tipo testE3_3 (SERVER_CONEXION http) ', async () => {
    await testE3_3()
  })

  it('[logger] error de tipo testE4 (SERVER_ERROR_1) ', async () => {
    await testE4()
  })

  it('[logger] error de tipo testE5 (SERVER_ERROR_2) ', async () => {
    await testE5()
  })

  it('[logger] error de tipo testE6 (SERVER_TIMEOUT) ', async () => {
    await testE6()
  })

  it('[logger] error de tipo testE7 (SERVER_CERT_EXPIRED) ', async () => {
    await testE7()
  })

  it('[logger] error de tipo testE8_1 (HTTP_EXCEPTION BadRequestException) ', async () => {
    await testE8_1()
  })

  it('[logger] error de tipo testE8_2 (HTTP_EXCEPTION UnauthorizedException) ', async () => {
    await testE8_2()
  })

  it('[logger] error de tipo testE8_5 (HTTP_EXCEPTION RequestTimeoutException) ', async () => {
    await testE8_5()
  })

  it('[logger] error de tipo testE9 (AXIOS_ERROR) ', async () => {
    await testE9()
  })

  it('[logger] error de tipo testE10 (SQL_ERROR) ', async () => {
    await testE10()
  })
})
