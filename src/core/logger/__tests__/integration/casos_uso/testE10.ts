import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE10() {
  const { error } = await consulta({ url: '/api/error/E10' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 500,
    mensaje: 'Ocurrió un error interno (E10)',
  })

  const zeroLine = 15
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
    mensaje: 'Ocurrió un error interno (E10)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 500,
    codigo: 'E10',
    causa: '',
    accion: 'Verificar la consulta SQL',
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
    originalUrl: '/api/error/E10',
    params: { codigo: 'E10' },
    query: {},
    body: {},
  })
}
