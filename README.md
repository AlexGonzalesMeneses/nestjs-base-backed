<h1 align="center">Proyecto base backend</h1>

<p align="center">
  <a href="./">
    <img src="https://img.shields.io/badge/version-v1.0.2-blue" alt="Versión">
  </a>
  <a href="./LICENSE">
      <img src="https://img.shields.io/static/v1?label=Licencia&message=LPG%20-%20Bolivia&color=green" alt="Licencia: LPG - Bolivia" />
  </a>
</p>

Proyecto Base para el inicio de proyectos basados en NestJS.

## Tabla de contenido

- [Proyecto base backend](#proyecto-base-backend)
  - [Descripción](#descripción)
  - [Tabla de contenido](#tabla-de-contenido)
  - [Tecnologías](#tecnologías)
  - [Funcionalidades](#funcionalidades)
  - [Documentación](#documentación)
  - [Comandos útiles](#comandos-útiles)
  - [Colaboradores](#colaboradores)
  - [Licencia](#licencia)
  - [Información de contacto](#información-de-contacto)

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

## Comandos útiles

1. Ejecución de contenedor con instancia postgres
   Para ejecutar este comando se debe tener instalado docker y configurar en el archivo `scripts/database.sh` los datos de conexión a la base de datos de la cual se quiere generar el diagrama:

> Para instalar docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

```bash
$ npm run start:database
```

2. Generación del diagrama ERD

```bash

$ npm run db:diagram
```

3. Generación de documentación

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

- contacto@agetic.gob.bo
