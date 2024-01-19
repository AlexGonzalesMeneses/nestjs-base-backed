export enum ERROR_CODE {
  UNKNOWN_ERROR = 'E50', // error = 'BOOM' | { name: 'Error' } | new Error() | undefined | null | ''
  HTTP_EXCEPTION = 'E40', // error = new HttpException()

  SQL_ERROR = 'EDB-50', // error = { name: "QueryFailedError" }
  AXIOS_ERROR = 'AXS-50', // error = axios().catch(err => ...)
  DTO_VALIDATION_ERROR = 'EVAL-40', // error = new BadRequestException() - DTO

  SERVER_CONEXION = 'ES-CONN', // error = { code: 'ECONNREFUSED' }
  SERVER_TIMEOUT = 'ES-TIMEOUT', // response = { data: "The upstream server is timing out" }
  SERVER_CERT_EXPIRED = 'ES-CERT', // error = { code: 'CERT_HAS_EXPIRED' }
  SERVER_ERROR_1 = 'ES-MSG', // body = { message: "detalle del error" }
  SERVER_ERROR_2 = 'ES-DAT', // body = { data: "detalle del error" }
}

export enum ERROR_NAME {
  E50 = 'ERROR DESCONOCIDO',
  E40 = 'ERROR HTTP',

  'EDB-50' = 'ERROR DE CONSULTA CON LA BASE DE DATOS',
  'AXS-50' = 'ERROR DE CONSULTA CON EL SERVICIO EXTERNO',
  'EVAL-40' = 'ERROR DE VALIDACIÓN CON EL DTO',

  'ES-CONN' = 'ERROR DE CONEXIÓN CON EL SERVICIO EXTERNO',
  'ES-TIMEOUT' = 'ERROR DE TIMEOUT CON EL SERVICIO EXTERNO',
  'ES-CERT' = 'ERROR DE CERTIFICADO CON EL SERVICIO EXTERNO',

  'ES-MSG' = 'ERROR DESCONOCIDO CON EL SERVICIO EXTERNO (message)',
  'ES-DAT' = 'ERROR DESCONOCIDO CON EL SERVICIO EXTERNO (data)',
}
