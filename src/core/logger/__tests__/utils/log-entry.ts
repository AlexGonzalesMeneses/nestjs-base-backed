import fs from 'fs'
import path from 'path'
import { cmd } from './cmd'

export async function createLogFile(filename: string) {
  const basePath = path.resolve(__dirname, '../log-storage')
  const filePath = path.resolve(basePath, filename)

  // Se elimina el contenido del fichero
  if (fs.existsSync(filePath)) {
    const command = `truncate -s 0 ${filename}`
    await cmd(command, basePath).catch(() => {})
  }

  // Se crea el fichero
  else {
    const command = `touch ${filename}`
    await cmd(command, basePath).catch(() => {})
  }
}

export const readLogFile = <T>(filename: string) => {
  const fileContent = fs
    .readFileSync(path.resolve(__dirname, '../log-storage', filename))
    .toString()

  const rows = fileContent
    .split('\n')
    .filter((line) => line)
    .map((line) => JSON.parse(line) as T)

  return {
    getEntry: (line: number) => {
      process.stdout.write(`\nlogEntry line: ${line}\n`)
      return rows[line - 1]
    },
    getValue: (fromLine?: number) => {
      if (fromLine) {
        return rows.filter((row, index) => index + 1 >= fromLine)
      }
      return rows
    },
  }
}
