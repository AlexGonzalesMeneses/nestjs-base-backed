import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testE9() {
  const { error } = await peticionAxios({
    url: '/api/error/E9',
  })
  const result = error.response.data
  const expected = {
    finalizado: false,
    codigo: 404,
    mensaje: 'Ocurrió un error con un servicio externo (E9)',
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('codigo', expected.codigo)
  expect(result).toHaveProperty('mensaje', expected.mensaje)
  expect(result).toHaveProperty('datos')
  expect(result.datos).toHaveProperty('causa')
  expect(result.datos).toHaveProperty('accion')

  const zeroLine = 44
  const linesCount = zeroLine + 6
  const traceFile = expectFile<BaseLog | BaseException>('trace.log', linesCount)

  // LINEA 1
  traceFile.line(zeroLine + 1).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:13:12',
    levelText: 'trace',
    appName: 'server',
    formato: 'GET /api/error/E9...',
    modulo: '',
    mensaje: 'GET /api/error/E9...',
    traceStack: '.../src/app.middleware.ts:13:12',
    metadata: {},
  })
  traceFile.line(zeroLine + 1).toHaveProperty('reqId')

  // LINEA 5
  traceFile.line(zeroLine + 5).toHaveObj({
    level: 40,
    caller: 'exception.filter.ts:30:12',
    levelText: 'warn',
    appName: 'server',
    modulo: '',
    mensaje: 'Ocurrió un error con un servicio externo (E9)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 404,
    codigo: 'E9',
    causa: 'Error HTTP 404 (Servicio externo)',
    accion: 'Revisar la respuesta devuelta por el servicio externo',
  })
  const logEntry2 = traceFile.line(zeroLine + 5).getValue()
  expect(logEntry2.metadata.req).toHaveObj({
    method: 'GET',
    originalUrl: '/api/error/E9',
    params: { codigo: 'E9' },
    query: {},
    body: {},
  })

  // LINEA 6
  traceFile.line(zeroLine + 6).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:21:14',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
    traceStack: '.../src/app.middleware.ts:21:14',
  })
  const logEntry3 = traceFile.line(zeroLine + 6).getValue()
  expect(logEntry3.metadata).toHaveObj({
    method: 'GET',
    url: '/api/error/E9',
    statusCode: 404,
    statusText: 'Not Found',
  })
  expect(logEntry3.metadata).toHaveProperty('elapsedTime')
}
