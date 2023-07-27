import { BaseLog, BaseException } from '../../../classes'
import { peticionAxios } from '../funciones-comun'
import { expect, expectFile } from './utilities'

export async function testEstado() {
  const { response } = await peticionAxios({ url: '/api/estado' })
  const result = response?.data
  const expected = {
    finalizado: true,
    mensaje: 'Servicio activo',
  }
  expect(result).toHaveProperty('finalizado', expected.finalizado)
  expect(result).toHaveProperty('mensaje', expected.mensaje)

  const zeroLine = 0
  const linesCount = zeroLine + 4
  const traceFile = expectFile<BaseLog | BaseException>('trace.log', linesCount)

  // LINEA 1
  traceFile.line(zeroLine + 1).toHaveObj({
    level: 30,
    reqId: '',
    caller: 'main.ts:25:14',
    levelText: 'info',
    appName: 'server',
    modulo: '',
    mensaje: 'Cargando aplicación...',
  })

  // LINEA 2
  traceFile.line(zeroLine + 2).toHaveObj({
    level: 30,
    reqId: '',
    caller: 'main.ts:27:12',
    levelText: 'info',
    appName: 'server',
    modulo: '',
    mensaje: 'server v0.0.1',
  })

  // LINEA 3
  traceFile.line(zeroLine + 3).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:13:12',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
    mensaje: 'GET /api/estado...',
  })
  traceFile.line(zeroLine + 3).toHaveProperty('reqId')

  // LINEA 4
  traceFile.line(zeroLine + 4).toHaveObj({
    level: 10,
    caller: 'app.middleware.ts:21:14',
    levelText: 'trace',
    appName: 'server',
    modulo: '',
  })
  traceFile.line(zeroLine + 4).toHaveProperty('reqId')
  const logEntry = traceFile.line(4).getValue()
  expect(logEntry.metadata.req).toHaveObj({
    finish: true,
    method: 'GET',
    url: '/api/estado',
    statusCode: 200,
    statusText: 'OK',
  })
  expect(logEntry.metadata.req).toHaveProperty('elapsedTime')
}
