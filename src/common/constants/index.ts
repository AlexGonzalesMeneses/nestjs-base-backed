// swagger config
export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = 'Proyecto base';
export const SWAGGER_API_DESCRIPTION = 'Documentación de proyecto base';
export const SWAGGER_API_CURRENT_VERSION = '1.0';

export enum Status {
  CREATE = 'CREADO',
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
  PENDING = 'PENDIENTE',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Configurations {
  SCORE_PASSWORD = 3,
  SALT_ROUNDS = 10,
  WRONG_LOGIN_LIMIT = 3,
  MINUTES_LOGIN_LOCK = 15,
}
