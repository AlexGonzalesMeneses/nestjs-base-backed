import path from 'path'
import { LoggerService } from '../../../logger'
import { createLogFile } from '../utils'
import { printError } from './casos_uso/printError'

describe('Logger prueba unitaria', () => {
  beforeAll(async () => {
    await createLogFile('script/50_app_error.log')
    await createLogFile('script/40_app_warn.log')
    await createLogFile('script/30_app_info.log')
    await createLogFile('script/20_app_debug.log')
    await createLogFile('script/10_app_trace.log')
    await createLogFile('script/100_audit_application.log')

    LoggerService.initialize({
      appName: 'script',
      level: 'error,warn,info,debug,trace',
      fileParams: {
        path: path.resolve(__dirname, '../log-storage'),
      },
      projectPath: path.resolve(__dirname),
    })
  })

  it('[logger] Verificando parámetros de configuración', async () => {
    const params = LoggerService.getLoggerParams()
    expect(params).toMatchObject({
      appName: 'script',
      level: 'error,warn,info,debug,trace',
      hide: '',
      lokiParams: undefined,
      auditParams: { context: 'application' },
      _levels: ['error', 'warn', 'info', 'debug', 'trace'],
      _audit: ['application'],
    })
    expect(params).toHaveProperty('fileParams')
    expect(params).toHaveProperty('projectPath')
    expect(params?.fileParams).toMatchObject({
      size: '5M',
      rotateInterval: '1d',
      compress: 'false',
    })
    expect(params?.fileParams).toHaveProperty('path')
  })

  it('[logger] probando print error', async () => {
    await printError()
  })

  // printFatal()
  // printError()
  // printWarn()
  // printInfo()
  // printDebug()
  // printTrace()
  // ocultarInfo()
})
