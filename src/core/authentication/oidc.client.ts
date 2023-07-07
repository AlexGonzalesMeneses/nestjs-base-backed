import { Client, Issuer } from 'openid-client'
import { LoggerService } from '../logger'
import { custom } from 'openid-client'

custom.setHttpOptionsDefaults({ timeout: 10000 }) // Valor por defecto: 3500. Para cambiar el timeout del cliente de ciudadanía en caso de ser necesario.
const logger = LoggerService.getInstance()

export class ClientOidcService {
  private static client: Client

  static async getInstance(): Promise<Client | undefined> {
    if (ClientOidcService.client) {
      return ClientOidcService.client
    }
    logger.trace('creando nueva instancia (new issuer.Client)...')

    const oidcIssuer = process.env[`OIDC_ISSUER`] || ''
    const oidcClient = process.env[`OIDC_CLIENT_ID`] || ''
    const oidcSecret = process.env[`OIDC_CLIENT_SECRET`] || ''

    try {
      const issuer = await Issuer.discover(oidcIssuer)
      ClientOidcService.client = new issuer.Client({
        client_id: oidcClient,
        client_secret: oidcSecret,
      })
    } catch (error) {
      const t = 1
      logger.error('////// ERROR DE CONEXIÓN CON CIUDADANIA //////')
      logger.error(
        `${oidcIssuer}\n- Verifique que el servicio de ciudadanía se encuentre activo y funcionando correctamente`
      )
      logger.error(error)
      await new Promise((resolve) => setTimeout(() => resolve(1), t * 1000))
      logger.error(
        `La aplicación continuará sin esta característica dentro de ${t} segundos`
      )
      await new Promise((resolve) => setTimeout(() => resolve(1), t * 1000))
    }
    return ClientOidcService.client
  }
}
