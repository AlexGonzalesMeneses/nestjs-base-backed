/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJSON } from 'flatted'
import { DEFAULT_SENSITIVE_PARAMS } from '../constants'

export function cleanParamValue(
  value: any,
  deep = 0,
  sensitiveParams = DEFAULT_SENSITIVE_PARAMS
) {
  try {
    // Para evitar recursividad infinita
    if (deep > 10) return String(value)

    // START
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) =>
          cleanParamValue(item, deep + 1, sensitiveParams)
        )
      }
      if (isAxiosResponse(value)) {
        return {
          data: value.data,
          status: value.status,
          statusText: value.statusText,
        }
      }
      if (isAxiosRequest(value)) {
        return {
          path: value.path,
          method: value.method,
          host: value.host,
          protocol: value.protocol,
        }
      }
      if (isAxiosError(value)) {
        return {
          code: value.code,
          config: {
            headers: value.config?.headers,
            baseURL: value.config?.baseURL,
            method: value.config?.method,
            url: value.config?.url,
            data: value.config?.data,
          },
          response: {
            status: value.response?.status,
            statusText: value.response?.statusText,
            data: value.response?.data,
          },
        }
      }
      if (isConexionError(value)) {
        return {
          name: value.name,
          message: value.message,
          code: value.code,
          config: {
            headers: value.config?.headers,
            baseURL: value.config?.baseURL,
            method: value.config?.method,
            url: value.config?.url,
            data: value.config?.data,
          },
        }
      }
      return Object.keys(value).reduce((prev, curr) => {
        // Por seguridad se ofusca el valor de parámetros con información sensible
        if (sensitiveParams.includes(curr.toLowerCase())) {
          prev[curr] = '*****'
        }

        // en otros casos
        else {
          prev[curr] = cleanParamValue(value[curr], deep + 1, sensitiveParams)
        }

        return prev
      }, {})
    }
    // END

    // Por seguridad se ofuscan los tokens
    if (typeof value === 'string' && value.indexOf('Bearer') > -1) {
      const regex = /(Bearer\s+)([^\s]+)/g
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return value.replace(regex, (match, p1, p2) => `${p1}*****`)
    }

    return value
  } catch (error) {
    try {
      return toJSON(value)
    } catch (e) {
      return e.toString()
    }
  }
}

function isAxiosResponse(data: any) {
  const result = Boolean(
    typeof data === 'object' &&
      typeof data.data !== 'undefined' &&
      typeof data.status !== 'undefined' &&
      typeof data.statusText !== 'undefined' &&
      typeof data.headers !== 'undefined' &&
      typeof data.config !== 'undefined'
  )
  return result
}

function isAxiosRequest(data: any) {
  const result = Boolean(
    typeof data === 'object' &&
      typeof data.path !== 'undefined' &&
      typeof data.method !== 'undefined' &&
      typeof data.host !== 'undefined' &&
      typeof data.protocol !== 'undefined' &&
      typeof data.res !== 'undefined'
  )
  return result
}

export function isAxiosError(data: any): boolean {
  const result = Boolean(data instanceof Error && data.name === 'AxiosError')
  return result
}

export function isConexionError(data: any): boolean {
  const result = Boolean(
    (!isAxiosError(data) || !data.response) &&
      data.code &&
      typeof data.code === 'string' &&
      ['ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND'].includes(
        data.code
      )
  )
  return result
}
