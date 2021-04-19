// response messages

export enum Messages {
  // generic Messages exceptions
  EXCEPTION_BAD_REQUEST = 'Error de validación',
  EXCEPTION_UNAUTHORIZED = 'Usuario no autorizado',
  EXCEPTION_NOT_FOUND = 'Recurso no encontrado',
  EXCEPTION_DEFAULT = 'Ocurrio un error desconocido',

  // generic messages success
  SUCCESS_DEFAULT = 'ok',
  SUCCESS_LIST = 'Registro(s) obtenido(s) con exito!',
  SUCCESS_CREATE = 'Registro creado con exito!',
  SUCCESS_UPDATE = 'Registro actualizado con exito!',
  SUCCESS_DELETE = 'Registro eliminado con exito!',

  // business login messages
  SUCCESS_RESTART_PASSWORD = 'Restauración de contraseña exitosa!!!',
  INVALID_USER = 'El usuario no existe o no contiene un estado valido.',
  INVALID_CREDENTIALS = 'Credenciales incorrectas!!!',
  INVALID_PASSWORD_SCORE = 'La contraseña nueva no cumple el nivel de seguridad necesario.',
}
