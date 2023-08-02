import { LogEntry } from '../../../../logger'
import { consulta, createLogFile, readLogFile } from '../../utils'

export async function testE8_E400() {
  await createLogFile('server/40_app_warn.log')

  const { error } = await consulta({ url: '/api/error/E8?variant=E400' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 400,
    mensaje:
      'La solicitud no se puede completar, existen errores de validación.',
  })

  const zeroLine = 0
  const linesCount = zeroLine + 1
  const errorFile = readLogFile<LogEntry>('server/40_app_warn.log')

  expect(errorFile.getValue()).toHaveLength(linesCount)

  // LINEA 1
  const firstEntry = errorFile.getEntry(zeroLine + 1)
  expect(firstEntry).toMatchObject({
    level: 40,
    caller: 'exception.filter.ts:30:12',
    levelText: 'warn',
    appName: 'server',
    modulo: '',
    mensaje:
      'La solicitud no se puede completar, existen errores de validación.',
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
  expect(firstEntry).toHaveProperty('traceStack')
  expect(firstEntry).toHaveProperty('metadata')
  expect(firstEntry.metadata?.req).toMatchObject({
    method: 'GET',
    originalUrl: '/api/error/E8?variant=E400',
    params: { codigo: 'E8' },
    query: { variant: 'E400' },
    body: {},
  })
}
