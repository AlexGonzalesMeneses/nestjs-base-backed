import { LogEntry } from '../../../../logger'
import { consulta, readLogFile } from '../../utils'

export async function testEstado() {
  const { response } = await consulta({ url: '/api/estado' })
  const result = response?.data

  expect(result).toMatchObject({
    finalizado: true,
    mensaje: 'Servicio activo',
  })

  const zeroLine = 0
  const linesCount = zeroLine + 4
  const auditFile = readLogFile<LogEntry>('server/100_audit_application.log')

  expect(auditFile.getValue()).toHaveLength(linesCount)

  // LINEA 1
  const firstEntry = auditFile.getEntry(zeroLine + 1)
  expect(firstEntry).toMatchObject({
    level: 100,
    msg: 'Cargando...',
  })
  expect(firstEntry).toHaveProperty('time')

  // LINEA 2
  const secondEntry = auditFile.getEntry(zeroLine + 2)
  expect(secondEntry).toMatchObject({
    level: 100,
    msg: '🚀 Servicio desplegado',
    app: 'server',
    version: '0.0.1',
  })
  expect(secondEntry).toHaveProperty('time')

  // LINEA 3
  const thirdEntry = auditFile.getEntry(zeroLine + 3)
  expect(thirdEntry).toMatchObject({
    level: 101,
    method: 'GET',
    url: '/api/estado',
  })
  expect(thirdEntry).toHaveProperty('time')

  // LINEA 4
  const fourthEntry = auditFile.getEntry(zeroLine + 4)
  expect(fourthEntry).toMatchObject({
    level: 102,
    method: 'GET',
    url: '/api/estado',
    code: 200,
  })
  expect(fourthEntry).toHaveProperty('time')
}
