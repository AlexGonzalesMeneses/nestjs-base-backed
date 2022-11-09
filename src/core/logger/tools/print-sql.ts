import { AdvancedConsoleLogger, LoggerOptions } from 'typeorm'
import { format } from 'sql-formatter'
import { COLOR } from '../constants'
import { PlatformTools } from 'typeorm/platform/PlatformTools'
import dotenv from 'dotenv'

dotenv.config()

export class PrintSQL extends AdvancedConsoleLogger {
  private readonly loggerOptions?: LoggerOptions

  constructor(options?: LoggerOptions) {
    super(options)
    this.loggerOptions = options
  }

  logQuery(query: string, parameters?: any[]) {
    const opt = this.loggerOptions
    if (
      !(opt === 'all') &&
      !(opt === true) &&
      !(Array.isArray(opt) && opt.includes('query'))
    ) {
      return
    }

    const sql = this.buildSql(query, parameters, false)
    process.stdout.write(`\n${COLOR.LIGHT_GREY}\n${sql}\n${COLOR.RESET}\n`)
  }

  logQueryError(error: string, query: string, parameters?: any[]): void {
    const opt = this.loggerOptions
    if (
      !(opt === 'all') &&
      !(opt === true) &&
      !(Array.isArray(opt) && opt.includes('error'))
    ) {
      return
    }

    const sql = this.buildSql(query, parameters, true)
    process.stdout.write(
      `${COLOR.LIGHT_RED}//////////////////// QUERY FAILED ////////////////////${COLOR.RESET}`
    )
    process.stdout.write(`${COLOR.LIGHT_GREY}\n${sql}\n${COLOR.RESET}\n`)
    process.stdout.write(
      `${COLOR.LIGHT_RED}//////////////////// QUERY ERROR ////////////////////\n${COLOR.RESET}`
    )
    console.log(error)
    process.stdout.write('\n')
  }

  private getValueToPrintSql(val: unknown): string {
    if (typeof val === 'string') {
      return val.indexOf("'") >= 0
        ? `E'${String(val.replace(/'/g, `\\'`))}'` // for postgres
        : `'${String(val)}'`
    }
    if (typeof val === 'number') return `${Number(val)}`
    if (typeof val === 'boolean') return `${Boolean(val)}`
    if (val instanceof Date) return `'${String(val.toISOString())}'`
    if (Array.isArray(val)) {
      throw new Error('array not support, possible JSON value')
    }
    if (typeof val === 'object' && val !== null) {
      throw new Error('object not support, possible JSON value')
    }
    return String(val)
  }

  private buildSql(query: string, parameters?: Array<any>, pretty?: boolean) {
    let queryParsed =
      parameters && parameters.length > 0
        ? `${query} -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : query

    try {
      if (!parameters || parameters.length === 0) {
        queryParsed = format(query, {
          language: 'postgresql',
          indentStyle: 'standard',
        })
      }
      if (parameters) {
        const params = {}
        for (const [index, param] of parameters.entries()) {
          params[index + 1] = this.getValueToPrintSql(param)
        }
        queryParsed = format(query, {
          language: 'postgresql',
          params,
          indentStyle: 'standard',
        })
      }

      queryParsed = PlatformTools.highlightSql(queryParsed)

      if (!pretty) {
        queryParsed = queryParsed
          .split('\n')
          .map((line) => line.trim())
          .join(' ')
      }

      return queryParsed
    } catch (err: any) {
      return parameters && parameters.length > 0
        ? `${query} -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : query
    }
  }
}
