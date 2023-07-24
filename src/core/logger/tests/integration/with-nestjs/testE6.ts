import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testE6() {
  const { error } = await peticionAxios({
    url: '/api/error/E6',
  })
  const result = error.response.data
  const expected = {
    finalizado: false,
    codigo: 500,
    mensaje: 'Ocurrió un error con un servicio externo (E6)',
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('codigo', expected.codigo)
  expect(result).toHaveProperty('mensaje', expected.mensaje)
  expect(result).toHaveProperty('datos')
  expect(result.datos).toHaveProperty('causa')
  expect(result.datos).toHaveProperty('accion')

  const zeroLine = 28
  const linesCount = zeroLine + 3
  const traceFile = expectFile<BaseLog | BaseException>('trace.log', linesCount)

  // LINEA 1
  traceFile.line(zeroLine + 1).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:13:12',
    levelText: 'trace',
    appName: 'server',
    formato: 'GET /api/error/E6...',
    modulo: '',
    mensaje: 'GET /api/error/E6...',
    traceStack: '.../src/app.middleware.ts:13:12',
    metadata: {},
  })
  traceFile.line(zeroLine + 1).toHaveProperty('reqId')

  // LINEA 2
  traceFile.line(zeroLine + 2).toHaveObj({
    level: 50,
    caller: 'exception.filter.ts:30:12',
    levelText: 'error',
    appName: 'server',
    modulo: '',
    mensaje: 'Ocurrió un error con un servicio externo (E6)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 500,
    codigo: 'E6',
    causa: 'The upstream server is timing out',
    accion:
      'Verificar que el servicio en cuestión se encuentre activo y respondiendo correctamente',
    error: {
      response: {
        data: 'The upstream server is timing out',
      },
    },
  })
  const logEntry2 = traceFile.line(zeroLine + 2).getValue()
  expect(logEntry2.metadata.req).toHaveObj({
    method: 'GET',
    originalUrl: '/api/error/E6',
    params: { codigo: 'E6' },
    query: {},
    body: {},
  })

  // LINEA 3
  traceFile.line(zeroLine + 3).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:21:14',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
    traceStack: '.../src/app.middleware.ts:21:14',
  })
  const logEntry3 = traceFile.line(zeroLine + 3).getValue()
  expect(logEntry3.metadata).toHaveObj({
    method: 'GET',
    url: '/api/error/E6',
    statusCode: 500,
    statusText: 'Internal Server Error',
  })
  expect(logEntry3.metadata).toHaveProperty('elapsedTime')
}
