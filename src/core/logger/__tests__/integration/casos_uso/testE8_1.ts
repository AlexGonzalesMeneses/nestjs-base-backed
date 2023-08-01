import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE8_1() {
  const { error } = await consulta({ url: '/api/error/E8?variant=400' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 400,
    mensaje:
      'La solicitud no se puede completar, existen errores de validación.',
  })

  const zeroLine = 10
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
      'La solicitud no se puede completar, existen errores de validación.',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 400,
    codigo: 'E8',
    causa: 'BadRequestException: Bad Request',
    accion:
      'Verifique que los datos de entrada se estén enviando correctamente',
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
    originalUrl: '/api/error/E8?variant=400',
    params: { codigo: 'E8' },
    query: { variant: '400' },
    body: {},
  })
}
