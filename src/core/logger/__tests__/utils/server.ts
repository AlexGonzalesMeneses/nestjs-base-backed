import { Server } from 'http'
import { delay } from './delay'
import axios, { AxiosRequestConfig } from 'axios'

const TEST_PORT = 3333

export async function iniciarServer(serverPath: string) {
  const bootstrap = (await import(serverPath)).default
  let server: Server | null = null
  await delay()

  server = await bootstrap(TEST_PORT)

  await delay()
  return server
}

export async function detenerServer(server: Server) {
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err)
      resolve(1)
    })
  })
  await delay()
}

export async function consulta(options: AxiosRequestConfig) {
  try {
    options.baseURL = `http://localhost:${TEST_PORT}`
    const response = await axios(options)
    // da tiempo al servidor para actualizar los ficheros logs
    await delay(1000)
    return { error: null, response }
  } catch (error) {
    await delay(1000) // da tiempo al servidor para actualizar los ficheros logs
    return { error, response: null }
  }
}
