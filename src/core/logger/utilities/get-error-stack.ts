import { LoggerService } from '../classes'

export function getErrorStack(error: Error) {
  try {
    const loggerParams = LoggerService.getLoggerParams()
    const projectPath = loggerParams?.projectPath || process.cwd()
    const customErrorStack = String(error.stack)
      .split('\n')
      .map((line) => line.replace(new RegExp(projectPath, 'g'), '...'))
      .filter((line) => line.includes('.../'))
      .map((line) => line.substring(line.indexOf('.../'), line.length - 1))
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
    const projectPath = loggerParams?.projectPath || process.cwd()
    const customErrorStack = String(error.stack)
      .split('\n')
      .map((line) => line.replace(new RegExp(projectPath, 'g'), '...'))
      .join('\n')
      .trim()
    return customErrorStack || ''
  } catch (err) {
    return error.stack || ''
  }
}
