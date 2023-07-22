export enum ERROR_CODE {
  /**
   * Utilizado cuando se trata de un error desconocido
   */
  UNKNOWN_ERROR = 'E0',

  /**
   * Utilizado cuando el objeto error se encuentra vacío. Ej: error = undefined | null | ''
   */
  EMPTY_ERROR = 'E1',
  STRING_ERROR = 'E2', // error = 'BOOM'
  NOT_ERROR_INSTANCE = 'E3', // error = { msg: 'This is not an Error instance' }
  BASE_EXCEPTION = 'E4', // error = new BaseException()
  SERVER_CONEXION = 'E5', // error = { code: 'ECONNREFUSED' }
  SERVER_ERROR_1 = 'E6', // body = { message: "detalle del error" }
  SERVER_ERROR_2 = 'E7', // body = { data: "detalle del error" }
  SERVER_TIMEOUT = 'E8', // response = { data: "The upstream server is timing out" }
  SERVER_CERT_EXPIRED = 'E9', // error = { code: 'CERT_HAS_EXPIRED' }
  HTTP_EXCEPTION = 'E10', // error = new HttpException()
  AXIOS_ERROR = 'E11', // error = axios().catch(err => ...)
  SQL_ERROR = 'E12', // error = { name: "QueryFailedError" }
}
