import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { ValidationMessageEnum } from './i18n/es.enum';

const nroDocComp = /(-[A-Za-z0-9]{2}){0,1}/;
const nroDocExt = /([eE][-]{1}){0,1}/;
const nroDoc = /[0-9]{4,10}/;

export const IS_NRO_DOC = 'isNroDoc';

/**
 * Verifica si una cadena es un numero de documento valido
 * @param value cadena a validar
 * @param param1 Objeto con propiedades de validacion
 *  - complemento (true defecto)
 *  - extranjero (true defecto)
 * @returns Si el valor dado no es una cadena, devuelve falso.
 */
export function isNroDoc(
  value: string,
  {
    complemento = true,
    extranjero = true,
  }: { complemento?: boolean; extranjero?: boolean } = {},
): boolean {
  const regex = new RegExp(
    '^' +
      (extranjero ? nroDocExt.source : '') +
      nroDoc.source +
      (complemento ? nroDocComp.source : '') +
      '$',
  );
  return regex.test(value);
}

export function IsNroDoc(
  options?: any,
  validationsOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IS_NRO_DOC',
      constraints: [],
      validator: {
        validate: (value): boolean => isNroDoc(value, options),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.IS_NRO_DOC,
          validationsOptions,
        ),
      },
    },
    validationsOptions,
  );
}