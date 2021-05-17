# Proyecto base backend
[![pipeline status](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/badges/develop/pipeline.svg)](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/-/commits/develop)

## Descripción
 Proyecto Base para el inicio de proyectos

## Tabla de contenido
* [Tecnologías](#tecnologias)
* [Funcionalidades](#funcionalidades)
* [Documentación](#documentacion)
* [Comandos Utiles](#comandos)
* [Colaboradores](#colaboradores)
* [Licencia](#licencia)
* [Información de contacto](#contacto)

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

## Funcionalidades

El proyecto Base backend cuenta con las siguientes funcionalidades y módulos:
  - Autenticación JWT
  - Autenticación con Ciudadania Digital
  - Refresh Token
  - Autorización (Roles, Módulos, Usuarios, Permisos)
  - Paramétricas
  - Clientes para Interoperabilidad (SEGIP, SIN)
  - Cliente para Mensajería Electrónica
  - Proveedores de:
    - Logger
    - Reportes
    - Manejo de errores

## Documentación
Documentación relacionada al proyecto:
1. [Instalación y Configuración](INSTALL.md)
2. [Arquitectura](/docs/arquitectura.md)
3. [Documentacion de APIS](/docs/openapi.yaml)
4. [Documentacion de Permisos](/docs/permisos.md)

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

### Linterna
- Ejecucion de linterna eslint
```bash
$ npm run lint
```

### Tests
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

### Otros
- Ejecución de contenedor con instancia postgres
```bash
$ npm run start:database
```
- Generación del diagrama ERD
```bash
$ npm run db:diagram
```
- Generación de documentación
```bash
$ npm run compodoc
```

## Colaboradores
- almamani@agetic.gob.bo
- jpoma@agetic.gob.bo
- rquispe@agetic.gob.bo

## Licencia

[LGP-Bolivia](LICENSE).

## Información de contacto

* contacto@agetic.gob.bo