export enum ValidationMessageEnum {
  IS_DEFINED = '$property no debe ser nulo o indefinido.',
  IS_OPTIONAL = '$property es opcional.',
  EQUALS = '$property debe ser igual a $constraint1.',
  NOT_EQUALS = '$property no debe ser igual a $constraint1.',
  IS_EMPTY = '$property debe estar vació.',
  IS_NOT_EMPTY = '$property no debe estar vacío.',
  IS_IN = '$property debe ser uno de los siguientes valores: $constraint1.',
  IS_NOT_IN = '$property no debe ser uno de los siguientes valores: $constraint1.',
  IS_BOOLEAN = '$property debe ser un valor booleano.',
  IS_DATE = '$property debe ser una instancia de fecha.',
  IS_STRING = '$property debe ser una cadena.',
  IS_NUMBER = '$property debe ser un número.',
  IS_INT = '$property debe ser un número entero.',
  IS_ARRAY = '$property debe ser un arreglo.',
  IS_ENUM = '$property debe ser un valor de enum válido.',
  IS_DIVISIBLE_BY = '$property debe ser divisible por $constraint1.',
  IS_POSITIVE = '$property debe ser un número positivo.',
  IS_NEGATIVE = '$property debe ser un número negativo.',
  MIN = '$property no debe ser menor que $constraint1.',
  MAX = '$property no debe ser mayor que $constraint1.',
  MIN_DATE = 'fecha mínima permitida para ',
  MAX_DATE = 'fecha máxima permitida para ',
  IS_BOOLEAN_STRING = '$property debe ser una cadena booleana.',
  IS_DATE_STRING = '$property debe ser una fecha válida ISO 8601.',
  IS_NUMBER_STRING = '$property debe ser un número conforme a las restricciones especificadas.',
  CONTAINS = '$property debe contener una cadena $constraint1.',
  NOT_CONTAINS = '$property no debe contener una cadena $constraint1.',
  IS_ALPHA = '$property debe contener solo letras (a-zA-Z).',
  IS_ALPHA_NUMERIC = '$property debe contener sólo letras y números.',
  IS_DECIMAL = '$property no es un número decimal válido.',
  IS_ASCII = '$property debe contener solo caracteres ASCII.',
  IS_BASE32 = '$property debe ser codificado en base32.',
  IS_BASE64 = '$property debe ser codificado en base64.',
  IS_CREDIT_CARD = '$property debe ser una tarjeta de crédito.',
  IS_CURRENCY = '$property debe ser una moneda.',
  IS_DATA_URI = '$property debe ser un formato uri de datos.',
  IS_EMAIL = '$property debe ser un correo electrónico.',
  IS_FULL_WIDTH = '$property debe contener un ancho completo de caracteres.',
  IS_HALF_WIDTH = '$property debe contener un ancho medio.',
  IS_VARIABLE_WIDTH = 'property debe contener un ancho completo y caracteres de tamaño medio.',
  IS_HEX_COLOR = '$property debe ser un color hexadecimal.',
  IS_RGB_COLOR = '$property debe ser color RGB.',
  IS_IDENTITY_CARD = '$property debe ser un número de tarjeta de identidad.',
  IS_HEXADECIMAL = '$property debe ser un número hexadecimal.',
  IS_IP = '$property debe ser una dirección IP.',
  IS_PORT = '$property debe ser un puerto.',
  IS_JSON = '$property debe ser una cadena json.',
  IS_JWT = '$property debe ser una cadena jwt.',
  IS_OBJECT = '$property debe ser un objeto.',
  IS_NOT_EMPTY_OBJECT = '$property debe ser un objeto no vacío.',
  IS_LOWERCASE = '$property debe ser una cadena en minúsculas.',
  IS_UPPERCASE = '$property debe ser una cadena en mayúsculas.',
  IS_LAT_LONG = '$property debe ser una latitud, longitud.',
  IS_LATITUDE = '$property debe ser una cadena o número en formato latitud.',
  IS_LONGITUDE = '$property debe ser una cadena o número en formato longitud.',
  IS_URL = '$property debe ser una dirección URL válida.',
  IS_UUID = '$property debe ser un UUID.',
  LENGTH = '$property debe tener entre $constraint1 y $constraint2 caracteres',
  MIN_LENGTH = '$property debe ser mayor o igual a $constraint1 caracteres.',
  MAX_LENGTH = '$property debe ser menor o igual a $constraint1 caracteres.',
  MATCHES = '$property debe coincidir con $constraint1 expresión regular.',
  IS_MILITARY_TIME = '$property debe ser una representación válida del tiempo militar en el formato HH:MM.',
  IS_HASH = '$property debe ser un hash de tipo $constraint1.',
  IS_MIME_TYPE = '$property debe ser un formato de tipo MIME.',
  ARRAY_CONTAINS = '$property debe contener $contraint valores.',
  ARRAY_NOT_CONTAINS = '$property no debe contener $contraint valores.',
  ARRAY_NOT_EMPTY = '$property debe contener algún valor',
  ARRAY_MIN_SIZE = '$property debe contener al menos $constraint1 elementos.',
  ARRAY_MAX_SIZE = '$property no debe contener más de $constraint1 elementos.',
  ARRAY_UNIQUE = 'Todos los elementos de $property deben ser únicos.',
  IS_INSTANCE = 'El decorador $IS_INSTANCE tiene un valor incorrecto.',
  // CUSTOM
  NRO_DOC = '$property debe ser un número de documento válido.',
  NOMBRE_APELLIDO = '$property debe contener caracteres válidos.',
  CORREO_LISTA = '$property no contiene un dominio de correo permitido.',
}
