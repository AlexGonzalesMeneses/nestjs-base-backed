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
- Winston
- Postgresql
- Docker

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
### Seeders
- Crear plantilla seeder
```bash
$ npm run seeds:create
```

- Ejecución de seeders
```bash
$ npm run seeds:run
```
## Scripts
- Ejecución de contenedor con instancia postgres
```bash
$ npm run start:database
```
## Linterna
- Ejecucion de linterna eslint
```bash
$ npm run lint
```

## Tests
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
## Documentación
Este proyecto incluye el directorio **docs** con mas detalle de:
1. [Instalación y Configuración](/docs/INSTALL.md)
2. [Arquitectura](/docs/arquitectura.md)
3. [Documentacion de APIS](/docs/openapi.yaml)
4. [Documentacion de Permisos](/docs/permisos.md)

## Licencia

[LGP-Bolivia](LICENSE).
