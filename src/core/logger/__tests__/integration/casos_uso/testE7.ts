import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE7() {
  const { error } = await consulta({ url: '/api/error/E7' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 500,
    mensaje: 'Ocurrió un error con un servicio externo (E7)',
  })

  const zeroLine = 9
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
    mensaje: 'Ocurrió un error con un servicio externo (E7)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 500,
    codigo: 'E7',
    causa: 'CERT_HAS_EXPIRED',
    accion: 'Renovar el certificado digital',
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
    originalUrl: '/api/error/E7',
    params: { codigo: 'E7' },
    query: {},
    body: {},
  })
  expect(firstEntry.error).toMatchObject({
    code: 'CERT_HAS_EXPIRED',
  })
}
