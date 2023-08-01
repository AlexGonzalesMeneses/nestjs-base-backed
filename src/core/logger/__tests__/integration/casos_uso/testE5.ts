import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testE5() {
  const { error } = await consulta({ url: '/api/error/E5' })
  const result = error.response.data

  expect(result).toMatchObject({
    finalizado: false,
    codigo: 500,
    mensaje: 'Ocurrió un error con un servicio externo (E5)',
  })

  const zeroLine = 7
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
    mensaje: 'Ocurrió un error con un servicio externo (E5)',
    traceStack: '.../src/exception.filter.ts:24:20',
    httpStatus: 500,
    codigo: 'E5',
    causa: 'detalle del error',
    accion:
      'Verificar que el servicio en cuestión se encuentre activo y respondiendo correctamente',
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
    originalUrl: '/api/error/E5',
    params: { codigo: 'E5' },
    query: {},
    body: {},
  })
  expect(firstEntry.error).toMatchObject({
    response: {
      data: {
        data: 'detalle del error',
      },
    },
  })
}
