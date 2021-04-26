/* eslint-disable prettier/prettier */
import {
  ValidationOptions,
  IsDefined as _IsDefined,
  IsOptional as _IsOptional,
  Equals as _Equals,
  NotEquals as _NotEquals,
  IsEmpty as _IsEmpty,
  IsNotEmpty as _IsNotEmpty,
  IsIn as _IsIn,
  IsNotIn as _IsNotIn,
  IsBoolean as _IsBoolean,
  IsDate as _IsDate,
  IsString as _IsString,
  IsNumber as _IsNumber,
  IsInt as _IsInt,
  IsArray as _IsArray,
  IsEnum as _IsEnum,
  IsDivisibleBy as _IsDivisibleBy,
  IsPositive as _IsPositive,
  IsNegative as _IsNegative,
  Min as _Min,
  Max as _Max,
  MinDate as _MinDate,
  MaxDate as _MaxDate,
  IsBooleanString as _IsBooleanString,
  IsDateString as _IsDateString,
  IsNumberString as _IsNumberString,
  Contains as _Contains,
  NotContains as _NotContains,
  IsAlpha as _IsAlpha,
  IsAlphanumeric as _IsAlphaNumeric,
  IsDecimal as _IsDecimal,
  IsAscii as _IsAscii,
  IsBase32 as _IsBase32,
  IsBase64 as _IsBase64,
  ArrayContains as _ArrayContains,
  ArrayNotContains as _ArrayNotContains,
  ArrayNotEmpty as _ArrayNotEmpty,
  ArrayMinSize as _ArrayMinSize,
  ArrayMaxSize as _ArrayMaxSize,
  ArrayUnique as _ArrayUnique,
  IsEmail as _IsEmail,
  IsFullWidth as _IsFullWidth,
  IsHalfWidth as _IsHalfWidth,
  IsVariableWidth as _IsVariableWidth,
  IsCreditCard as _IsCreditCard,
  IsCurrency as _IsCurrency,
  IsDataURI as _IsDataURI,
  IsHexColor as _IsHexColor,
  IsRgbColor as _IsRgbColor,
  IsIdentityCard as _IsIdentityCard,
  IsHexadecimal as _IsHexadecimal,
  IsIP as _IsIP,
  IsPort as _IsPort,
  IsJSON as _IsJSON,
  IsJWT as _IsJWT,
  IsLatLong as _IsLatLong,
  IsLatitude as _IsLatitude,
  IsLongitude as _IsLongitude,
  IsUrl as _IsUrl,
  IsUUID as _IsUUID,
  Length as _Length,
  MinLength as _MinLength,
  MaxLength as _MaxLength,
  Matches as _Matches,
  IsMilitaryTime as _IsMilitaryTime,
  IsHash as _IsHash,
  IsMimeType as _IsMimeType,
  IsLowercase as _IsLowercase,
  IsUppercase as _IsUppercase,
  IsNotEmptyObject as _IsNotEmptyObject,
  IsObject as _IsObject,
  IsInstance as _IsInstance,
} from 'class-validator';

import { IsNroDoc as _IsNroDoc } from './IsNroDoc.validator';
const make = (_function, _message) => (validationOptions?: ValidationOptions): PropertyDecorator => 
  _function({ ...validationOptions, message: () => _message });

const makeWithOptions = (_function, _message) => (options?: any, validationOptions?: ValidationOptions): PropertyDecorator => 
  _function(options, { ...validationOptions, message: () => _message });

const makeWithTwoOptions = (_function, _message) => (options1?: any, options2?: any, validationOptions?: ValidationOptions): PropertyDecorator => 
_function(options1, options2, { ...validationOptions, message: () => _message });

// COMMON VALIDATION
export const IsDefined = makeWithOptions(_IsDefined, '$property no debe ser nulo o indefinido.');
export const IsOptional = make(_IsOptional, '$property es opcional.');
export const Equals = makeWithOptions(_Equals, '$property debe ser igual a $constraint1');
export const NotEquals = makeWithOptions(_NotEquals, '$property no debe ser igual a $constraint1');
export const IsEmpty = make(_IsEmpty, '$property debe estar vacio.');
export const IsNotEmpty = make(_IsNotEmpty, '$property no debe estar vacío.');
export const IsIn = makeWithOptions(_IsIn, '$property debe ser uno de los siguientes valores: $constraint1.');
export const IsNotIn = makeWithOptions(_IsNotIn, '$property no debe ser uno de los siguientes valores: $constraint1.');

// TYPE VALIDATION
export const IsBoolean =  make(_IsBoolean, '$property debe ser un valor booleano.');
export const IsDate = make(_IsDate, '$property debe ser una instancia de fecha.');
export const IsString = make(_IsString, '$property debe ser una cadena.');
export const IsNumber = makeWithOptions(_IsNumber, '$property debe ser un número conforme a las restricciones especificadas.');
export const IsInt = make(_IsInt, '$property debe ser un número entero.');
export const IsArray = make(_IsArray, '$property debe ser un arreglo.');
export const IsEnum = makeWithOptions(_IsEnum, '$property debe ser un valod de enum válido.');

// NUMBER VALIDATION
export const IsDivisibleBy = makeWithOptions(_IsDivisibleBy, '$property debe ser divisible por $constraint1.');
export const IsPositive = make(_IsPositive, '$property debe ser un número positivo.');
export const IsNegative = make(_IsNegative, '$property debe ser un número negativo.');
export const Min = makeWithOptions(_Min, '$property no debe ser menor que $constraint1.');
export const Max = makeWithOptions(_Max, '$property no debe ser mayor que $constraint1.');

// DATE VALIDATION
export const MinDate = makeWithOptions(_MinDate, 'fecha mínima permitida para ');
export const MaxDate = makeWithOptions(_MaxDate, 'fecha máxima permiida para ');

// STRING-TYPE VALIDATION
export const IsBooleanString = make(_IsBooleanString, '$property debe ser una cadena booleana.');
export const IsDateString = make(_IsDateString, '$property debe ser una fecha válida ISO 8601.');
export const IsNumberString = makeWithOptions(_IsNumberString, '$property debe ser un número conforme a las restricciones especificadas.');

// STRING VALIDATION
export const Contains = makeWithOptions(_Contains, '$property debe contener una cadena $constraint1' );
export const NotContains = makeWithOptions(_NotContains, '$property no debe contener una cadena $constraint1' );
export const IsAlpha = make(_IsAlpha, '$property debe contener sólo letras (a-zA-Z).');
export const IsAlphaNumeric = make(_IsAlphaNumeric, '$property debe contener sólo letras y números.');
export const IsDecimal = makeWithOptions(_IsDecimal, '$property no es un número decimal válido.' );
export const IsAscii = make(_IsAscii, '$property debe contener sólo caracteres ASCII.');
export const IsBase32 = make(_IsBase32, '$property debe ser codificado en base32.');
export const IsBase64 = make(_IsBase64, '$property debe ser codificado en base64.');
// TODO: falta IsIBAN, IsBIC, IsByteLength, IsEthereumAddress, IsBtcAddress, IsFQDN, IsHSLColor, IsPassportNumber, IsPostalCode
// IsOctal, IsMACAddress, IsISBN, IsEAN, IsISIN, IsISO8601, IsMobilePhone, IsISO31661Alpha2, IsISO31661Alpha3, IsLocale, IsPhoneNumber
// IsMongoId, IsMultibyte, IsSurrogatePair, IsMagnetURI, IsFirebasePushId, IsSemVer, IsISSN, IsISRC, IsRFC3339
export const IsCreditCard = make(_IsCreditCard, '$property debe ser una tarjeta de crédito.');
export const IsCurrency = makeWithOptions(_IsCurrency, '$property debe ser una moneda.');
export const IsDataURI = make(_IsDataURI, '$property debe ser un formato uri de datos.');
export const IsEmail = makeWithOptions(_IsEmail, '$property debe ser un correo electrónico.');
export const IsFullWidth = make(_IsFullWidth, '$property debe contener un ancho completo de caracteres.');
export const IsHalfWidth = make(_IsHalfWidth, '$property debe contener un ancho medio.');
export const IsVariableWidth = make(_IsVariableWidth, 'property debe contener un ancho completo y caracteres de ancho medio.');
export const IsHexColor = make(_IsHexColor, '$property debe ser un color hexadecimal.');
export const IsRgbColor = makeWithOptions(_IsRgbColor, '$property debe ser color RGB.');
export const IsIdentityCard = makeWithOptions(_IsIdentityCard, '$property debe ser un número de tarjeta de identidad.');
export const IsHexadecimal = make(_IsHexadecimal, '$property debe ser un número hexadecimal.');
export const IsIP = makeWithOptions(_IsIP, '$property debe ser una dirección IP.');
export const IsPort = make(_IsPort, '"$property debe ser un puerto.');
export const IsJSON = make(_IsJSON, '$property debe ser una cadena json.');
export const IsJWT = make(_IsJWT, '$property debe ser una cadena jwt.');
export const IsObject = make(_IsObject, '$property debe ser un objeto.');
export const IsNotEmptyObject = make(_IsNotEmptyObject, '$property debe ser un objeto no vacío.');
export const IsLowercase = make(_IsLowercase, '$property debe ser una cadena en minúsculas.');
export const IsUppercase = make(_IsUppercase, '$property debe ser una cadena en mayúsculas.');
export const IsLatLong = make(_IsLatLong, '$property debe ser una latitud, longitud.');
export const IsLatitude = make(_IsLatitude, '$property debe ser una cadena o número de latitud.');
export const IsLongitude = make(_IsLongitude, '$property debe ser una cadena o número de longitud.');
export const IsUrl = makeWithOptions(_IsUrl, '$property debe ser una dirección URL válida.');
export const IsUUID = makeWithOptions(_IsUUID, '$property debe ser un UUID.');
export const Length = makeWithTwoOptions(_Length, '$property debe ser mayor o igual a $constraint1 y menor o igual a $constraint2 caracteres');
export const MinLength = makeWithOptions(_MinLength, '$property debe ser mayor o igual a $constraint1 caracteres.');
export const MaxLength = makeWithOptions(_MaxLength, '$property debe ser menor o igual a $constraint1 caracteres.');
export const Matches = makeWithTwoOptions(_Matches, '$property debe ser menor o igual a $constraint1 caracteres.');
export const IsMilitaryTime = make(_IsMilitaryTime, '$property debe ser una representación válida del tiempo militar en el formato HH:MM.');
export const IsHash = makeWithOptions(_IsHash, '$property debe ser menor o igual a $constraint1 caracteres.');
export const IsMimeType = make(_IsMimeType, '$property debe ser un formato de tipo MIME.');

// ARRAY VALIDATION 
export const ArrayContains = makeWithOptions(_ArrayContains, '$property debe contener $contraint valores.' );
export const ArrayNotContains = makeWithOptions(_ArrayNotContains, '$property no debe contener $contraint valores.' );
export const ArrayNotEmpty = make(_ArrayNotEmpty, '$property no debe estar vacío.' );
export const ArrayMinSize = makeWithOptions(_ArrayMinSize, '$property debe contener al menos $constraint1 elementos.' );
export const ArrayMaxSize = makeWithOptions(_ArrayMaxSize, '$property no debe contener mas de $constraint1 elementos.' );
export const ArrayUnique = makeWithOptions(_ArrayUnique, 'Todos los elementos de $property deben ser únicos.' );

// OBJECT VALIDATION
export const IsInstance = makeWithOptions(_IsInstance, 'El decorador $IS_INSTANCE espera y el objeto como valor, pero tiene un valor incorrecto.' );

// OTHER DECORATORS

// CUSTOM VALIDATION
export const IsNroDoc = _IsNroDoc;
