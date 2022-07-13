
# Backend Base - NestJS

<p>
  <a href="./">
    <img src="https://img.shields.io/badge/version-v1.1.6-blue" alt="Versión">
  </a>
  <a href="./LICENSE">
      <img src="https://img.shields.io/static/v1?label=license&message=LPG%20-%20Bolivia&color=green" alt="Licencia: LPG - Bolivia" />
  </a>
</p>


> Para proyectos desarrollados por AGETIC

## Recomendaciones

- Este proyecto en rama `Develop` usa TypeOrm `v0.3.7`, para usar la versión anterior `v0.2.x` clonar el tag `v1.1.0` 
- Se sugiere crear un Fork, dado que se harán mejoras continuas
- Para añadir este proyecto como otro origen, ejecutar dentro el proyecto Fork:

```
git remote add origin2 git@gitlab.agetic.gob.bo:agetic/agetic/proyectos-base/agetic-nestjs-base-backend.git
```

- Para descargar los commits desde el 2.º origen, ejecutar

```
git pull origin2 master
```

## Tabla de contenido

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

Documentación relacionada con el proyecto:

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
- wilmer.quispe@agetic.gob.bo
- ivillarreal@agetic.gob.bo

## Licencia

[LGP-Bolivia](LICENSE).

## Información de contacto

- contacto@agetic.gob.bo
