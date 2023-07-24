import { Server } from 'http'
import { exec } from 'child_process'
import axios, { AxiosRequestConfig } from 'axios'

export async function delay(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export async function cmd(command: string, executePath: string) {
  await new Promise((resolve, reject) => {
    process.stdout.write(`[cmd] ${command}\n`)
    exec(command, { cwd: executePath }, (error, stdout, stderr) => {
      process.stdout.write(`${stdout}\n`)
      if (error !== null) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
  await delay()
}

export async function iniciarServer(serverPath: string) {
  const bootstrap = (await import(serverPath)).default
  let server: Server | null = null
  await delay()

  server = await bootstrap(3333)

  await delay()
  return { server }
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

export async function peticionAxios(options: AxiosRequestConfig) {
  try {
    options.baseURL = 'http://localhost:3333'
    const response = await axios(options)
    process.stdout.write('(-_-) zzz...\n')
    await delay(1000) // da tiempo al servidor para actualizar los ficheros logs
    return { error: null, response }
  } catch (error) {
    process.stdout.write('(-_-) zzz...\n')
    await delay(1000) // da tiempo al servidor para actualizar los ficheros logs
    return { error, response: null }
  }
}
