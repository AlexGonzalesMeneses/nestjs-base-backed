import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export function isNroDoc(nroDoc: string): boolean {
  const regex = new RegExp(
    /^([eE][-]{1}){0,1}[0-9]{4,10}(-[A-Za-z0-9]{2}){0,1}$/,
  );
  return regex.test(nroDoc);
}

export function IsNroDoc(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validationsOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy({
    name: 'IS_NRODOC',
    constraints: [],
    validator: {
      validate: (value): boolean => isNroDoc(value),
      defaultMessage: buildMessage(
        () => `$property debe ser un número de documento válido.`,
      ),
    },
  });
}
