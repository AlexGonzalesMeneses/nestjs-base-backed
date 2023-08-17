import { LoggerService } from '../classes'

const ignoreStackPaths = [
  './node_modules',
  './src/driver',
  './src/query-builder',
  './src/entity-manager',
  './src/core/logger',
  './src/common/exceptions',
]

export function getErrorStack(error: Error) {
  try {
    const loggerParams = LoggerService.getLoggerParams()
    const projectPath = loggerParams?.projectPath
    const customErrorStack = String(error.stack)
      .split('\n')
      .map((line) =>
        projectPath ? line.replace(new RegExp(projectPath, 'g'), '.') : line
      )
      .filter(
        (line) =>
          line.includes('./') && !ignoreStackPaths.some((x) => line.includes(x))
      )
      .map((line) => line.substring(line.indexOf('./'), line.length - 1))
      .join('\n')
      .trim()
    return customErrorStack || ''
  } catch (err) {
    return error.stack || ''
  }
}

export function getFullErrorStack(error: Error) {
  try {
    const loggerParams = LoggerService.getLoggerParams()
    const projectPath = loggerParams?.projectPath
    const customErrorStack = String(error.stack)
      .split('\n')
      .map((line) =>
        projectPath ? line.replace(new RegExp(projectPath, 'g'), '.') : line
      )
      .join('\n')
      .trim()
    return customErrorStack || ''
  } catch (err) {
    return error.stack || ''
  }
}
