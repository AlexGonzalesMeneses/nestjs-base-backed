# Proyecto base backend
[![pipeline status](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/badges/develop/pipeline.svg)](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/-/commits/develop)

## Descripción
El proyecto Base backend cuenta con las siguientes funcionalidades y módulos:

  - Autenticación JWT
  - Autenticación con Ciudadania Digital
  - Roles, Módulos, usuarios
  - Paramétricas
  - Cliente para Interoperabilidad
  - Cliente para Mensajería Electrónica
  - Generación de reportes

## Tecnologías

- [NestJS](https://nestjs.com/)
- [Jest](https://jestjs.io/)
- [Passport.js](http://www.passportjs.org/)
- [OpenApi](https://www.openapis.org/)
- [TypeORM](https://typeorm.io/)
- [PinoJs](https://getpino.io/#/)
- [Casbin](https://casbin.org/)
- [Postgresql](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## Comandos Útiles

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
Este proyecto incluye el directorio **docs** con más detalle de:
1. [Instalación y Configuración](INSTALL.md)
2. [Arquitectura](/docs/arquitectura.md)
3. [Documentacion de APIS](/docs/openapi.yaml)
4. [Documentacion de Permisos](/docs/permisos.md)

## Licencia

[LGP-Bolivia](LICENSE).
