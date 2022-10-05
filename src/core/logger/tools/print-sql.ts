import { AdvancedConsoleLogger, LoggerOptions } from 'typeorm'
import { format } from 'sql-formatter'
import { COLOR } from '../constants/index'
import { PlatformTools } from 'typeorm/platform/PlatformTools'
import dotenv from 'dotenv'

dotenv.config()

export class SqlLogger extends AdvancedConsoleLogger {
  private loggerOptions?: LoggerOptions

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
    process.stdout.write(`\n${COLOR.LIGHT_GREY}\n${sql}\n${COLOR.RESET}\n`)
    console.log(error)
  }

  private getValueToPrintSql(val: unknown): string {
    if (typeof val === 'string') {
      return val.indexOf("'") >= 0
        ? `E'${String(val.replace(/'/g, `\\'`))}'` // for postgres
        : `'${String(val)}'`
    }
    if (typeof val === 'number') return `${Number(val)}`
    if (typeof val === 'boolean') return `${Boolean(val)}`
    if (val instanceof Date) return `'${String(val)}'`
    if (Array.isArray(val)) throw new Error('array not support')
    return String(val)
  }

  private buildSql(query: string, parameters?: Array<any>, pretty?: boolean) {
    let queryParsed = parameters
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
    } catch (err) {
      return queryParsed
    }
  }
}
