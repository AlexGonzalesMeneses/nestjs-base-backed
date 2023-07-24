export default async () => {
  // eslint-disable-next-line no-throw-literal
  throw {
    response: {
      data: 'The upstream server is timing out',
    },
  }
}

// // import axios from 'axios'

// export default async () => {
//   // await axios('http://localhost:3333/api/server-timeout')
//   // Simulamos un tiempo de espera de 5 segundos
//   await new Promise((resolve) => setTimeout(resolve, 5000))

//   // this.logger.log('Data request processed.')
//   console.log('Data request processed.')

//   // return { message: 'Data from upstream server' }

//   // throw new Error('The upstream server is timing out')

//   throw {
//     response: {
//       data: {
//         data: 'detalle del error',
//       },
//     },
//   }
// }
