import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE0() {
  const { error } = await consulta({ url: '/api/error/E0' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 500,
    mensaje: 'Error Interno (E0)',
    datos: { causa: 'Error', accion: '' },
  })

  const zeroLine = 0
  const linesCount = zeroLine + 1
  const traceFile = readLogFile<LogEntry>('server/10_app_trace.log')

  expect(traceFile.getValue()).toHaveLength(linesCount)

  // LINEA 1
  const firstEntry = traceFile.getEntry(zeroLine + 1)

  expect(firstEntry).toMatchObject({
    level: 50,
    caller: 'exception.filter.ts:30:12',
    levelText: 'error',
    appName: 'server',
    modulo: '',
    mensaje: 'Error Interno (E0)',
    httpStatus: 500,
    codigo: 'E0',
    causa: 'Error',
    accion: '',
    error: {},
  })
  expect(firstEntry).toHaveProperty('hostname')
  expect(firstEntry).toHaveProperty('time')
  expect(firstEntry).toHaveProperty('pid')
  expect(firstEntry).toHaveProperty('reqId')
  expect(firstEntry).toHaveProperty('fecha')
  expect(firstEntry).toHaveProperty('origen')
  expect(firstEntry).toHaveProperty('formato')
  expect(firstEntry).toHaveProperty('errorStack')
  expect(firstEntry).toHaveProperty('traceStack')
  expect(firstEntry).toHaveProperty('metadata')
  expect(firstEntry.metadata?.req).toMatchObject({
    method: 'GET',
    originalUrl: '/api/error/E0',
    params: { codigo: 'E0' },
    query: {},
    body: {},
  })
}
