# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/compare/v1.3.2...v1.4.0) (2022-08-15)


### Features

* actualización de librerías NestJS 9.0.9 ([b309f4d](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/b309f4d0b6e91c0ace7c4ec43e0ec3283e64f8c9))


### Bug Fixes

* corrección en paginado para API's de parámetros, módulos y usuarios ([2c6e5d8](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/2c6e5d8f397f4812027f673b3f9b0eca46ccbc76))

### [1.3.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/compare/v1.3.0...v1.3.2) (2022-08-07)


### Bug Fixes

* actualización de dependencias NestJS 9.0.7 ([dccd447](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/dccd4479e2fd422281cb8ec8c5cb190f894d43fc))
* actualización de manual, mencionando la creación de esquemas ([107d921](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/107d921abe522881c2a0b0ea1f126d1cf2a9d33a))
* añadido tipado en transacción para restaurar contraseña ([d3b836b](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d3b836b35bd822a60c34b1dc5ee531ecd62a07e4))
* modificadas instancias condicionales anidadas, para evitar anidación de condicionales ([ad75c94](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/ad75c94a1bb236fe4c9aeb6605eb585d89c7f4de))

## [1.3.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/compare/v1.2.0...v1.3.0) (2022-07-31)

### Features

- añadido filtro para secciones en API en módulos ([92e3816](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/92e3816eaad63fe1eb5dcfd7ac31447bfc7c4657))

### Bug Fixes

- :wrench: Ajustes en actualizacion de un modulo ([516b147](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/516b1473da0d260e2fa500ead719f52a8bc6d94a))
- :wrench: Ajustes en creacion de modulos ([d3f5b24](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d3f5b24356c864399de34b9ba21d8f6992766861))
- correcciones de ortografía y versión de @types/pdfmake ([def332c](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/def332ca0c23541609e2546b67322116cd42d2b9))

## [1.2.0](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/compare/v1.1.6...v1.2.0) (2022-07-26)

### Features

- removiendo paquete requerido pm2 ([f7829cf](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/f7829cfcc7c4f2efd0df03cfa765af6a94fda3a3))
- respuesta this.success adicionado para responder desde el crontrolador ([42f262b](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/42f262be0f9be1ead218d448b187901ba29a8aa0))
- versión actualizada en package-lock.json ([326621a](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/326621a5fa0805303379527a5b594ef0338d1acd))

### Bug Fixes

- añadidas API para activar/inactivar módulos con permisos y ajuste en API de perfil para módulos activos ([eb3c607](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/eb3c60708e20fcf09bd9c74342b10f6fe29eab8e))
- cambio columna tipo enum por varchar ([9f7af7f](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/9f7af7f87b2416480b502cf9b83b2d90e0f86834))
- **ci:** comando para inicio ([e95e567](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/e95e5672e5fbdbda3d349ed00e09de032ac0a791))
- **ci:** copy default index.ts.sample ([2ff6f8e](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/2ff6f8e833ba929451efdfae16bc4a8868183ad8))
- **ci:** correcciones para cicd ([c0d66e5](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/c0d66e5296b6862a005fe46b327b025c00e2751b))
- **ci:** legacy-peer-deps ([91c5403](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/91c54035aec056c03099fe1966ff73e1b506adad))
- **ci:** obtener desde vault el nombre de chart ([6e5339e](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/6e5339ebcc0d7bdd0ba42ed65ad5e675e302ec8f))
- **ci:** permitir copia node_modules en pipeline ([0f81b1f](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/0f81b1fde0366bbb90d2597106aa70972b9f71e3))
- corrección de parámetros de paginado para API de modulos, actualización de dependencias ([b94dfc7](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/b94dfc77d6e9af996ad288457bcb2c1799a1111b))
- corrección en filtro de rutas con submodulos ([2d6531e](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs/commit/2d6531e1a4e17000b67f6f5163ee2dff27543931))
