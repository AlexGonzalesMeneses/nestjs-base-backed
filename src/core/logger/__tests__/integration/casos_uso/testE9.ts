import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE9() {
  const { error } = await consulta({ url: '/api/error/E9' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 404,
    mensaje: 'Ocurrió un error con un servicio externo (E9)',
  })

  const zeroLine = 14
  const linesCount = zeroLine + 1
  const traceFile = readLogFile<LogEntry>('server/10_app_trace.log')

  expect(traceFile.getValue()).toHaveLength(linesCount)

  // LINEA 1
  const firstEntry = traceFile.getEntry(zeroLine + 1)
  expect(firstEntry).toMatchObject({
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
  expect(firstEntry).toHaveProperty('hostname')
  expect(firstEntry).toHaveProperty('time')
  expect(firstEntry).toHaveProperty('pid')
  expect(firstEntry).toHaveProperty('reqId')
  expect(firstEntry).toHaveProperty('fecha')
  expect(firstEntry).toHaveProperty('origen')
  expect(firstEntry).toHaveProperty('formato')
  expect(firstEntry).toHaveProperty('errorStack')
  expect(firstEntry).toHaveProperty('metadata')
  expect(firstEntry.metadata?.req).toMatchObject({
    method: 'GET',
    originalUrl: '/api/error/E9',
    params: { codigo: 'E9' },
    query: {},
    body: {},
  })
}
