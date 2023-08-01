// import { HttpStatus } from '@nestjs/common'
// import { LoggerService } from '../../../../logger'

// const logger = LoggerService.getInstance()

// export async function printWarn() {
//   const msg = 'Mensaje de advertencia (warn)'
//   logger.warn(msg)
//   logger.warn(msg, { algun: 'metadato' })
//   logger.warn(msg, { algun: 'metadato' }, 'ALGÚN MÓDULO')
//   logger.warn({
//     httpStatus: HttpStatus.BAD_REQUEST,
//     mensaje: 'Mensaje para el cliente (warn)',
//     metadata: { algun: 'metadato', adicional: 'clave:valor', tipo: 'warn' },
//     appName: 'proyecto-base-backend',
//     modulo: 'ALGÚN MÓDULO',
//     causa: 'Esta podría ser la causa aparente (warn)',
//     accion: 'Y las acciones a realizar para solucionar este incidente (warn)',
//     // errorStack: '',
//     // errorStackOriginal: '',
//     // origen: '',
//     // traceStack: '',
//     // level: 'error',
//   })
// }

// export async function printInfo() {
//   const msg = 'Mensaje informativo (info)'
//   logger.info(msg, { algun: 'metadato' })
//   logger.info(msg, { algun: 'metadato' }, 'ALGÚN MÓDULO')
//   logger.info({
//     appName: 'proyecto-base-backend',
//     mensaje: 'Mensaje informativo (info)',
//     metadata: { algun: 'metadato', adicional: 'clave:valor' },
//     modulo: 'ALGÚN MÓDULO',
//     // traceStack: '',
//     // level: 'info',
//   })
// }

// export async function printDebug() {
//   const msg = 'Mensaje para el depurador (debug)'
//   logger.debug(msg)
// }

// export async function printTrace() {
//   const msg = 'Mensaje de trazabilidad (trace)'
//   logger.trace(msg, { algun: 'metadato' })
//   logger.trace(msg, { algun: 'metadato' }, 'ALGÚN MÓDULO')
//   logger.trace({
//     appName: 'proyecto-base-backend',
//     mensaje: 'Mensaje de trazabilidad (trace)',
//     metadata: { algun: 'metadato', adicional: 'clave:valor' },
//     modulo: 'ALGÚN MÓDULO',
//     // traceStack: '',
//     // level: 'info',
//   })
// }
