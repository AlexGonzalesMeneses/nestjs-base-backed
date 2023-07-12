import { toJSON } from 'flatted'
import {
  CLEAN_PARAM_VALUE_MAX_DEEP,
  DEFAULT_SENSITIVE_PARAMS,
} from '../constants'

export function cleanParamValue(
  value: unknown,
  deep = 0,
  sensitiveParams = DEFAULT_SENSITIVE_PARAMS
) {
  try {
    // Para evitar recursividad infinita
    if (deep > CLEAN_PARAM_VALUE_MAX_DEEP) return String(value)

    // START
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) =>
          cleanParamValue(item, deep + 1, sensitiveParams)
        )
      }
      if (isAxiosResponse(value)) {
        return {
          data:
            'data' in value
              ? cleanParamValue(value.data, 0, sensitiveParams)
              : undefined,
          status: 'status' in value ? value.status : undefined,
          statusText: 'statusText' in value ? value.statusText : undefined,
        }
      }
      if (isAxiosRequest(value)) {
        return {
          path: 'path' in value ? value.path : undefined,
          method: 'method' in value ? value.method : undefined,
          host: 'host' in value ? value.host : undefined,
          protocol: 'protocol' in value ? value.protocol : undefined,
        }
      }
      if (isAxiosError(value)) {
        const config =
          'config' in value && value.config && typeof value.config === 'object'
            ? value.config
            : undefined
        const response =
          'response' in value &&
          value.response &&
          typeof value.response === 'object'
            ? value.response
            : undefined
        return {
          code: 'code' in value ? value.code : undefined,
          config: config
            ? {
                headers:
                  'headers' in config
                    ? cleanParamValue(config.headers, 0, sensitiveParams)
                    : undefined,
                baseURL: 'baseURL' in config ? config.baseURL : undefined,
                method: 'method' in config ? config.method : undefined,
                url: 'url' in config ? config.url : undefined,
                data:
                  'data' in config
                    ? cleanParamValue(config.data, 0, sensitiveParams)
                    : undefined,
              }
            : undefined,
          response: response
            ? {
                status: 'status' in response ? response.status : undefined,
                statusText:
                  'statusText' in response ? response.statusText : undefined,
                data:
                  'data' in response
                    ? cleanParamValue(response.data, 0, sensitiveParams)
                    : undefined,
              }
            : undefined,
        }
      }
      if (isConexionError(value)) {
        const config =
          'config' in value && value.config && typeof value.config === 'object'
            ? value.config
            : undefined
        return {
          name: 'name' in value ? value.name : undefined,
          message: 'message' in value ? value.message : undefined,
          code: 'code' in value ? value.code : undefined,
          config: config
            ? {
                headers:
                  'headers' in config
                    ? cleanParamValue(config.headers, 0, sensitiveParams)
                    : undefined,
                baseURL: 'baseURL' in config ? config.baseURL : undefined,
                method: 'method' in config ? config.method : undefined,
                url: 'url' in config ? config.url : undefined,
                data:
                  'data' in config
                    ? cleanParamValue(config.data, 0, sensitiveParams)
                    : undefined,
              }
            : undefined,
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

function isAxiosResponse(data: unknown) {
  const result = Boolean(
    data &&
      typeof data === 'object' &&
      'data' in data &&
      typeof data.data !== 'undefined' &&
      'status' in data &&
      typeof data.status !== 'undefined' &&
      'statusText' in data &&
      typeof data.statusText !== 'undefined' &&
      'headers' in data &&
      typeof data.headers !== 'undefined' &&
      'config' in data &&
      typeof data.config !== 'undefined'
  )
  return result
}

function isAxiosRequest(data: unknown) {
  const result = Boolean(
    data &&
      typeof data === 'object' &&
      'path' in data &&
      typeof data.path !== 'undefined' &&
      'method' in data &&
      typeof data.method !== 'undefined' &&
      'host' in data &&
      typeof data.host !== 'undefined' &&
      'protocol' in data &&
      typeof data.protocol !== 'undefined' &&
      'res' in data &&
      typeof data.res !== 'undefined'
  )
  return result
}

export function isAxiosError(data: unknown): boolean {
  const result = Boolean(data instanceof Error && data.name === 'AxiosError')
  return result
}

export function isConexionError(data: unknown): boolean {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'code' in data &&
      typeof data.code === 'string' &&
      ['ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND'].includes(
        data.code
      )
  )
}

export function isCertExpiredError(data: unknown): boolean {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'code' in data &&
      typeof data.code === 'string' &&
      data.code === 'CERT_HAS_EXPIRED'
  )
}
