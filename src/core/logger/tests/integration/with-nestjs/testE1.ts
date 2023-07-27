import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testE1() {
  const { error } = await peticionAxios({ url: '/api/error/E1' })
  const result = error.response.data
  const expected = {
    finalizado: false,
    codigo: 500,
    mensaje: 'Error Interno (E1)',
    datos: { causa: '', accion: '' },
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('codigo', expected.codigo)
  expect(result).toHaveProperty('mensaje', expected.mensaje)
  expect(result).toHaveProperty('datos', expected.datos)

  const zeroLine = 7
  const linesCount = zeroLine + 3
  const traceFile = expectFile<BaseLog | BaseException>('trace.log', linesCount)

  // LINEA 1
  traceFile.line(zeroLine + 1).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:13:12',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
    mensaje: 'GET /api/error/E1...',
  })
  traceFile.line(zeroLine + 1).toHaveProperty('reqId')

  // LINEA 2
  traceFile.line(zeroLine + 2).toHaveObj({
    level: 50,
    caller: 'exception.filter.ts:30:12',
    levelText: 'error',
    appName: 'server',
    modulo: '',
    mensaje: 'Error Interno (E1)',
    httpStatus: 500,
    codigo: 'E1',
    causa: '',
    accion: '',
  })
  const logEntry2 = traceFile.line(zeroLine + 2).getValue()
  expect(logEntry2.metadata.req).toHaveObj({
    method: 'GET',
    originalUrl: '/api/error/E1',
    params: { codigo: 'E1' },
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
  })
  const logEntry3 = traceFile.line(zeroLine + 3).getValue()
  expect(logEntry3.metadata.req).toHaveObj({
    method: 'GET',
    url: '/api/error/E1',
    statusCode: 500,
    statusText: 'Internal Server Error',
  })
  expect(logEntry3.metadata.req).toHaveProperty('elapsedTime')
}
