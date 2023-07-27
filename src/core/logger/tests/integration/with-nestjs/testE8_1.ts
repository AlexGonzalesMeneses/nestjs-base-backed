import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testE8_1() {
  const { error } = await peticionAxios({
    url: '/api/error/E8?variant=400',
  })
  const result = error.response.data
  const expected = {
    finalizado: false,
    codigo: 400,
    mensaje:
      'La solicitud no se puede completar, existen errores de validación.',
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('codigo', expected.codigo)
  expect(result).toHaveProperty('mensaje', expected.mensaje)
  expect(result).toHaveProperty('datos')
  expect(result.datos).toHaveProperty('causa')
  expect(result.datos).toHaveProperty('accion')

  const zeroLine = 34
  const linesCount = zeroLine + 3
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
  traceFile.line(zeroLine + 2).toHaveObj({
    level: 40,
    caller: 'exception.filter.ts:30:12',
    levelText: 'warn',
    appName: 'server',
    modulo: '',
    mensaje:
      'La solicitud no se puede completar, existen errores de validación.',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 400,
    codigo: 'E8',
    causa: 'BadRequestException: Bad Request',
    accion:
      'Verifique que los datos de entrada se estén enviando correctamente',
  })
  const logEntry2 = traceFile.line(zeroLine + 2).getValue()
  expect(logEntry2.metadata.req).toHaveObj({
    method: 'GET',
    originalUrl: '/api/error/E8?variant=400',
    params: { codigo: 'E8' },
    query: { variant: '400' },
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
    url: '/api/error/E8',
    statusCode: 400,
    statusText: 'Bad Request',
  })
  expect(logEntry3.metadata.req).toHaveProperty('elapsedTime')
}
