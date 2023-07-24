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
  SERVER_CONEXION = 'E3', // error = { code: 'ECONNREFUSED' }
  SERVER_ERROR_1 = 'E4', // body = { message: "detalle del error" }
  SERVER_ERROR_2 = 'E5', // body = { data: "detalle del error" }
  SERVER_TIMEOUT = 'E6', // response = { data: "The upstream server is timing out" }
  SERVER_CERT_EXPIRED = 'E7', // error = { code: 'CERT_HAS_EXPIRED' }
  HTTP_EXCEPTION = 'E8', // error = new HttpException()
  AXIOS_ERROR = 'E9', // error = axios().catch(err => ...)
  SQL_ERROR = 'E10', // error = { name: "QueryFailedError" }
  // BASE_EXCEPTION = 'E100', // error = new BaseException()
}
