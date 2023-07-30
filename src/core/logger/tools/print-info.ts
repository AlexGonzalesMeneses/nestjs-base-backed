import { COLOR } from '../constants'
import ip from 'ip'
import { LoggerService } from '../classes'
import { stdoutWrite } from '../tools'
import { AppInfo } from '../types'

export function printInfo(appInfo: AppInfo) {
  const logger = LoggerService.getInstance()

  const appName = appInfo.name
  const appVersion = appInfo.version
  const nodeEnv = appInfo.env
  const port = appInfo.port
  const appLocalUrl = `http://localhost:${port}`
  const appNetworkUrl = `http://${ip.address()}:${port}`

  logger.audit({
    mensaje: '🚀 Servicio desplegado',
    metadata: {
      app: appName,
      version: appVersion,
    },
  })

  const serviceInfo = `
 ${COLOR.LIGHT_GREY}-${COLOR.RESET} Servicio    : ${COLOR.GREEN}Activo
 ${COLOR.LIGHT_GREY}-${COLOR.RESET} Entorno     : ${COLOR.GREEN}${nodeEnv}
 ${COLOR.LIGHT_GREY}-${COLOR.RESET} URL (local) : ${COLOR.GREEN}${appLocalUrl}
 ${COLOR.LIGHT_GREY}-${COLOR.RESET} URL (red)   : ${COLOR.GREEN}${appNetworkUrl}
  `
  stdoutWrite(serviceInfo)
  stdoutWrite(`${COLOR.RESET}\n`)
}
