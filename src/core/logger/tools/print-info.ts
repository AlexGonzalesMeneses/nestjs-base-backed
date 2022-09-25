import { INestApplication } from '@nestjs/common'
import { COLOR } from '../constants'
import packageJson from '../../../../package.json'
import ip from 'ip'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '../logger.service'

const logger = LoggerService.getInstance('logger')

export async function printInfo(app: INestApplication) {
  const configService = app.get(ConfigService)

  const appName = packageJson.name
  const appVersion = packageJson.version
  const nodeEnv = configService.get('NODE_ENV')
  const port = configService.get('PORT')
  const appLocalUrl = `http://localhost:${port}`
  const appNetworkUrl = `http://${ip.address()}:${port}`

  logger.info(`${appName} v${appVersion}`)

  const serviceInfo = `
${COLOR.RESET} - Servicio    : ${COLOR.GREEN}Activo
${COLOR.RESET} - Entorno     : ${COLOR.GREEN}${nodeEnv}
${COLOR.RESET} - URL (local) : ${COLOR.GREEN}${appLocalUrl}
${COLOR.RESET} - URL (red)   : ${COLOR.GREEN}${appNetworkUrl}
  `
  process.stderr.write(serviceInfo)
  process.stderr.write(`${COLOR.RESET}\n`)
}
