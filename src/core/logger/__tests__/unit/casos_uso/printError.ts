import { HttpStatus } from '@nestjs/common'
import { LogEntry, LoggerService } from '../../../../logger'
import { delay, readLogFile } from '../../utils'

const logger = LoggerService.getInstance()

export async function printError() {
  const err = new Error('<<< BOOM >>>')
  logger.error(err)
  logger.error(err, 'Mensaje para el cliente')
  logger.error(err, 'Mensaje para el cliente', { algun: 'metadato' })
  logger.error(err, 'Mensaje para el cliente', { algun: 'metadato' }, 'MÓDULO')
  logger.error(err, {
    mensaje: 'Mensaje para el cliente',
    metadata: { algun: 'metadato', adicional: 'clave:valor' },
    modulo: 'OTRO MÓDULO',
  })
  await delay(2000)

  const zeroLine = 0
  const traceFile = readLogFile<LogEntry>('script/10_app_trace.log')
  expect(traceFile.getValue(zeroLine + 1)).toHaveLength(5)

  const firstEntry = traceFile.getEntry(zeroLine + 1)
  expect(firstEntry).toMatchObject({
    level: 50,
    reqId: '',
    caller: 'printError.ts:9:10',
    levelText: 'error',
    appName: 'script',
    modulo: '',
    mensaje: 'Error Interno (E0)',
    httpStatus: 500,
    codigo: 'E0',
    causa: 'Error: <<< BOOM >>>',
    accion: '',
    error: {},
  })
  expect(firstEntry).toHaveProperty('time')
  expect(firstEntry).toHaveProperty('pid')
  expect(firstEntry).toHaveProperty('hostname')
  expect(firstEntry).toHaveProperty('fecha')
  expect(firstEntry).toHaveProperty('origen')
  expect(firstEntry.origen).toContain(
    'at printError (.../casos_uso/printError.ts'
  )
  expect(firstEntry.errorStack).toContain(
    'at Object.<anonymous> (.../index.spec.ts'
  )
  expect(firstEntry).toHaveProperty('formato')
  expect(firstEntry).toHaveProperty('errorStack')

  const secondEntry = traceFile.getEntry(zeroLine + 2)
  expect(secondEntry).toMatchObject({
    level: 50,
    levelText: 'error',
    mensaje: 'Mensaje para el cliente',
  })

  const thirdEntry = traceFile.getEntry(zeroLine + 3)
  expect(thirdEntry).toMatchObject({
    level: 50,
    levelText: 'error',
    mensaje: 'Mensaje para el cliente',
    metadata: { algun: 'metadato' },
  })

  const fourthEntry = traceFile.getEntry(zeroLine + 4)
  expect(fourthEntry).toMatchObject({
    level: 50,
    levelText: 'error',
    mensaje: 'MÓDULO :: Mensaje para el cliente',
    metadata: { algun: 'metadato' },
    modulo: 'MÓDULO',
  })

  const fifthEntry = traceFile.getEntry(zeroLine + 5)
  expect(fifthEntry).toMatchObject({
    level: 50,
    levelText: 'error',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    mensaje: 'OTRO MÓDULO :: Mensaje para el cliente',
    metadata: { algun: 'metadato', adicional: 'clave:valor' },
    appName: 'script',
    modulo: 'OTRO MÓDULO',
    causa: 'Error: <<< BOOM >>>',
    accion: '',
  })
}
