import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testE8_5() {
  const { error } = await peticionAxios({
    url: '/api/error/E8?variant=408',
  })
  const result = error.response.data
  const expected = {
    finalizado: false,
    codigo: 408,
    mensaje: 'La solicitud no se pudo completar, tardó demasiado en responder.',
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('codigo', expected.codigo)
  expect(result).toHaveProperty('mensaje', expected.mensaje)
  expect(result).toHaveProperty('datos')
  expect(result.datos).toHaveProperty('causa')
  expect(result.datos).toHaveProperty('accion')

  const zeroLine = 40
  const linesCount = zeroLine + 4
  const traceFile = expectFile<BaseLog | BaseException>('trace.log', linesCount)

  // LINEA 1
  traceFile.line(zeroLine + 1).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:13:12',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
    mensaje: 'GET /api/error/E8...',
  })
  traceFile.line(zeroLine + 1).toHaveProperty('reqId')

  // LINEA 2
  traceFile.line(zeroLine + 3).toHaveObj({
    level: 40,
    caller: 'exception.filter.ts:30:12',
    levelText: 'warn',
    appName: 'server',
    modulo: '',
    mensaje: 'La solicitud no se pudo completar, tardó demasiado en responder.',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 408,
    codigo: 'E8',
    causa: 'RequestTimeoutException: Request Timeout',
    accion:
      'Verifique que el servicio responda en un tiempo menor al tiempo máximo de espera establecido en la variable de entorno REQUEST_TIMEOUT_IN_SECONDS',
  })
  const logEntry2 = traceFile.line(zeroLine + 3).getValue()
  expect(logEntry2.metadata.req).toHaveObj({
    method: 'GET',
    originalUrl: '/api/error/E8?variant=408',
    params: { codigo: 'E8' },
    query: { variant: '408' },
    body: {},
  })

  // LINEA 3
  traceFile.line(zeroLine + 4).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:21:14',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
  })
  const logEntry3 = traceFile.line(zeroLine + 4).getValue()
  expect(logEntry3.metadata.req).toHaveObj({
    method: 'GET',
    url: '/api/error/E8',
    statusCode: 408,
    statusText: 'Request Timeout',
  })
  expect(logEntry3.metadata.req).toHaveProperty('elapsedTime')
}
