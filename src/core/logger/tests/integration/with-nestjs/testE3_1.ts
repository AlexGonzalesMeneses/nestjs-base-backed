import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testE3_1() {
  const { error } = await peticionAxios({
    url: '/api/error/E3?variant=axios',
  })
  const result = error.response.data
  const expected = {
    finalizado: false,
    codigo: 500,
    mensaje: 'Error de conexión con un servicio externo (E3)',
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('codigo', expected.codigo)
  expect(result).toHaveProperty('mensaje', expected.mensaje)
  expect(result).toHaveProperty('datos')
  expect(result.datos).toHaveProperty('causa')
  expect(result.datos).toHaveProperty('accion')

  const zeroLine = 13
  const linesCount = zeroLine + 3
  const traceFile = expectFile<BaseLog | BaseException>('trace.log', linesCount)

  // LINEA 1
  traceFile.line(zeroLine + 1).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:13:12',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
    mensaje: 'GET /api/error/E3...',
  })
  traceFile.line(zeroLine + 1).toHaveProperty('reqId')

  // LINEA 2
  traceFile.line(zeroLine + 2).toHaveObj({
    level: 50,
    caller: 'exception.filter.ts:30:12',
    levelText: 'error',
    appName: 'server',
    modulo: '',
    mensaje: 'Error de conexión con un servicio externo (E3)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 500,
    codigo: 'E3',
    causa: 'Error: connect ECONNREFUSED 127.0.0.1:9999',
    accion:
      'Verifique la configuración de red y que el servicio al cual se intenta conectar se encuentre activo',
  })
  const logEntry2 = traceFile.line(zeroLine + 2).getValue()
  expect(logEntry2.metadata.req).toHaveObj({
    method: 'GET',
    originalUrl: '/api/error/E3?variant=axios',
    params: { codigo: 'E3' },
    query: { variant: 'axios' },
    body: {},
  })
  if ('error' in logEntry2) {
    expect(logEntry2.error).toHaveObj({
      name: 'Error',
      message: 'connect ECONNREFUSED 127.0.0.1:9999',
      code: 'ECONNREFUSED',
    })
  }

  // LINEA 3
  traceFile.line(zeroLine + 3).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:21:14',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
  })
  const logEntry3 = traceFile.line(zeroLine + 3).getValue()
  expect(logEntry3.metadata.req).toHaveObj({
    method: 'GET',
    url: '/api/error/E3',
    statusCode: 500,
    statusText: 'Internal Server Error',
  })
  expect(logEntry3.metadata.req).toHaveProperty('elapsedTime')
}
