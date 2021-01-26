# Proyecto base backend
[![pipeline status](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/badges/develop/pipeline.svg)](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/-/commits/develop)

## Description

Proyecto base backend

## Tecnologías
- Nestjs
- Jest
- Docker
- TypeORM
- Postgresql
- Pinojs

## Instalación

1. Instalación de paquetes
```bash
$ npm install
```
2. Copiar el archivo .env.example y realizar las configuraciones necesarias
```
$ cp .env.example .env
```
## Ejecución

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support


## Estructura de directorios


Modules:

    Autenticacion
        Ciudadanía Digital
            Tokens
    Autorizacion
        Usuarios
        Roles
        Menus
        Permisos
    Entidades
    Personas
    Parametricas
    Servicios


Commons:

    utilitarios
    constantes


Config:

    config

## Licencia

[LGP-Bolivia](LICENSE).
