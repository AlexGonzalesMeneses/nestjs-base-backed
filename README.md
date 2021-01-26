# Proyecto base backend
[![pipeline status](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/badges/develop/pipeline.svg)](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/-/commits/develop)

## Descripción
Proyecto base backend con modulos:
  - Autenticación JWT
  - Autenticación con Ciudadania Digital
  - Roles, Modulos, usuarios
  - Parametricas
  - Cliente para Interoperabilidad
  - Cliente para Mensajería Electrónica
  - Generación de reportes

## Tecnologías
- Nestjs
- Jest
- Passport
- Swagger
- TypeORM
- Pinojs
- Postgresql
- Docker

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
- Ejecución en modo desarrollo
```bash
# development
$ npm run start
```
- Ejecución en modo desarrollo (live-reload)
```bash
# watch mode
$ npm run start:dev
```
- Ejecución en modo producción
```bash
# production mode
$ npm run start:prod
```

## Comandos Utiles
### Migraciones
- Generación de migraciones
```bash
$ npm run migrations:generate <nombre-migracion>
```

- Ejecución de migraciones
```bash
$ npm run migrations:run
```

- Crear plantilla seeder
```bash
$ npm run seeds:create
```

- Ejecución de seeders
```bash
$ npm run seeds:run
```
### Scripts
- Ejecución de contenedor con instancia postgres
```bash
$ npm run start:database
```
### Linterna
- Ejecucion de linterna eslint
```bash
$ npm run lint
```


### Test
- Ejecución de test unitarios
```bash
# unit tests
$ npm run test
```

- Ejecución de test e2e
```bash
# e2e tests
$ npm run test:e2e
```

- Ejecución de test de cobertura
```bash
# test coverage
$ npm run test:cov
```
## Estructura de directorios

```
.
├─src
|  ├── common 
|  |    ├── constants
|  |    ├── exceptions
|  |    ├── interceptors
|  |    ├── helpers
|  |    └── serializers
|  ├── config
|  |    ├── database
|  |    └── logger
|  ├── external
|  |    ├── iop
|  |    └── mensajeria
|  ├── modules
|  |    ├── autenticacion
|  |    ├── autorizacion
|  |    ├── entidad
|  |    ├── parametro
|  |    ├── reporte
|  |    ├── usuario
|  ├── templates
|  ├── app.controller.ts
|  ├── app.module.ts
|  └── main.ts
├──scripts
├──test
├──.Dockerignore
├──.env.example
├──.eslintrc.js
├──.gitignore
├──.gitlab-ci.yml
├──.prettierc
├──Dockerfile
├──LICENSE
├──nest-cli.json
├──ormconfig.ts
├──package-lock.json
├──package.json
├──README.md
├──tsconfig.build.json
└──tsconfig.json

```

## Licencia

[LGP-Bolivia](LICENSE).
