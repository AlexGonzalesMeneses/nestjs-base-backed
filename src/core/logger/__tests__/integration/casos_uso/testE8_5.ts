import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE8_5() {
  const { error } = await consulta({ url: '/api/error/E8?variant=408' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 408,
    mensaje:
      'La solicitud está demorando demasiado (tiempo transcurrido: 2 seg)',
  })

  const zeroLine = 12
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
    mensaje:
      'La solicitud está demorando demasiado (tiempo transcurrido: 2 seg)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 408,
    codigo: 'E8',
    causa:
      'RequestTimeoutException: La solicitud está demorando demasiado (tiempo transcurrido: 2 seg)',
    accion:
      'Verifique que el servicio responda en un tiempo menor al tiempo máximo de espera establecido en la variable de entorno REQUEST_TIMEOUT_IN_SECONDS',
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
    originalUrl: '/api/error/E8?variant=408',
    params: { codigo: 'E8' },
    query: { variant: '408' },
    body: {},
  })
}
