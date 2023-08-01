import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE8_2() {
  const { error } = await consulta({ url: '/api/error/E8?variant=401' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 401,
    mensaje: 'Usuario no autorizado.',
  })

  const zeroLine = 11
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
    mensaje: 'Usuario no autorizado.',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 401,
    codigo: 'E8',
    causa: 'UnauthorizedException: Unauthorized',
    accion:
      'Verifique que las credenciales de acceso se estén enviando correctamente',
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
    originalUrl: '/api/error/E8?variant=401',
    params: { codigo: 'E8' },
    query: { variant: '401' },
    body: {},
  })
}
