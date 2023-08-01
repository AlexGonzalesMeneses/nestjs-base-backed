// import { inspect } from 'util'
// import { cmd, delay, detenerServer, iniciarServer } from './funciones-comun'
// import path from 'path'
// import { Server } from 'http'
// import fs from 'fs'

// export async function run(fn: () => Promise<void>) {
//   try {
//     await fn()
//     process.stdout.write(
//       `\n [\x1b[32mrun\x1b[0m] ${fn.name} \x1b[32m✓\x1b[0m\n`
//     )
//   } catch (err) {
//     process.stdout.write(err.toString() + '\n')
//     process.stdout.write(
//       `\n [\x1b[31mrun\x1b[0m] ${fn.name} \x1b[31m✕\x1b[0m\n\n`
//     )
//     throw err
//   }
// }

// export const expect = <T>(obj: T) => {
//   return {
//     toHaveProperty: (property: string, value?: unknown) => {
//       if (typeof value === 'undefined') {
//         _haveProp<T>(obj, property)
//       } else {
//         _comparar(obj[property], value, obj)
//       }
//     },
//     toHaveObj: (compareObj: object) => {
//       Object.keys(compareObj).forEach((key) => {
//         _haveProp<T>(obj, key)
//         _comparar(obj[key], compareObj[key], obj)
//       })
//     },
//     getValue: (): T => {
//       return obj
//     },
//   }
// }

// const _haveProp = <T>(obj: T, prop: string) => {
//   if (obj && typeof obj === 'object' && prop in obj) {
//     return
//   }
//   const val1 =
//     typeof obj === 'object' ? inspect(obj, false, null, false) : String(obj)
//   process.stdout.write('\n')
//   process.stdout.write(`Objeto: \x1b[31m${val1}\x1b[0m\n`)
//   process.stdout.write(`Propiedad: \x1b[32m${prop}\x1b[0m\n`)
//   process.stdout.write('\n')
//   throw new Error('El objeto no tiene la propiedad especificada')
// }

// export const expectFile = <T>(filename: string, lines?: number) => {
//   const fileContent = fs
//     .readFileSync(path.resolve(__dirname, `../server/logs/server/${filename}`))
//     .toString()

//   const rows = fileContent
//     .split('\n')
//     .filter((line) => line)
//     .map((line) => JSON.parse(line) as T)

//   if (typeof lines === 'number' && rows.length !== lines) {
//     process.stdout.write('\n')
//     process.stdout.write(`Valor recibido: \x1b[31m${rows.length}\x1b[0m\n`)
//     process.stdout.write(`Valor esperado: \x1b[32m${lines}\x1b[0m\n`)
//     process.stdout.write('\n')
//     throw new Error(
//       `El archivo ${filename} no contiene la cantidad de líneas especificada`
//     )
//   }

//   return {
//     line: (line: number) => {
//       process.stdout.write(`\nlogEntry line: ${line}\n`)
//       return expect<T>(rows[line - 1])
//     },
//     getValue: (fromLine?: number) => {
//       if (fromLine) {
//         return rows.filter((row, index) => index + 1 >= fromLine)
//       }
//       return rows
//     },
//   }
// }

// function _comparar<T>(obj1: unknown, obj2: unknown, parentValue: T) {
//   const obj1String = typeof obj1 === 'string' ? obj1 : JSON.stringify(obj1)
//   const obj2String = typeof obj2 === 'string' ? obj2 : JSON.stringify(obj2)
//   const equals = obj1String === obj2String
//   if (!equals) {
//     const val1 =
//       typeof obj1 === 'object'
//         ? inspect(obj1, false, null, false)
//         : String(obj1)
//     const val2 =
//       typeof obj2 === 'object'
//         ? inspect(obj2, false, null, false)
//         : String(obj2)
//     const rowValue = inspect(parentValue, false, null, false)
//     process.stdout.write('\n')
//     process.stdout.write(`Objeto a comparar: \x1b[31m${rowValue}\x1b[0m\n`)
//     process.stdout.write('\n')
//     process.stdout.write(`Valor recibido: \x1b[31m${val1}\x1b[0m\n`)
//     process.stdout.write(`Valor esperado: \x1b[32m${val2}\x1b[0m\n`)
//     process.stdout.write('\n')
//     throw new Error('Falló al comparar los valores')
//   }
// }

// // export async function testSuit(functions: Array<() => Promise<void>>) {
// //   let server: Server | null = null
// //   try {
// //     await eliminarFicherosLog()
// //     const { server: serverStarted } = await iniciarServer(
// //       path.resolve(__dirname, '../server/src/main.ts')
// //     )
// //     server = serverStarted
// //     for (const fn of functions) {
// //       await run(fn)
// //     }

// //     process.stdout.write('\n( ◠‿◠) Prueba completada!\n\n')
// //   } catch (err) {
// //     console.error(err)
// //     process.stdout.write('\nTerminó con un error (╥_╥)\n\n')
// //   } finally {
// //     if (server) {
// //       await detenerServer(server)
// //     }
// //     process.exit(0)
// //   }
// // }
