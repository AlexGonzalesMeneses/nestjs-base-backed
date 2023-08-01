import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE3_3() {
  const { error } = await consulta({ url: '/api/error/E3?variant=http' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 500,
    mensaje: 'Error de conexión con un servicio externo (E3)',
  })

  const zeroLine = 5
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
    mensaje: 'Error de conexión con un servicio externo (E3)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 500,
    codigo: 'E3',
    causa: '',
    accion:
      'Verifique la configuración de red y que el servicio al cual se intenta conectar se encuentre activo',
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
    originalUrl: '/api/error/E3?variant=http',
    params: { codigo: 'E3' },
    query: { variant: 'http' },
    body: {},
  })
  expect(firstEntry.error).toMatchObject({
    code: 'ECONNREFUSED',
    errno: -111,
    syscall: 'connect',
    address: '127.0.0.1',
    port: 9999,
  })
}
