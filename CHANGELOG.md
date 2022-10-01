# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/compare/v1.6.0...v1.6.1) (2022-10-01)


### Features

* añadido servicio que reenvia el correo de activación para usuarios con cuenta sin verificación para rol administrador ([bd584a3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/bd584a3b78e3334b4f3882e2421eb3e8ea1f7899))
* se agregó el validador de tipos enumerados buildCheck ([6e2a1c4](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/6e2a1c4f3f66c87139888579e96d3758c89c9c52))


### Bug Fixes

* corregido método que crea usuarios con Ciudadanía Digital con rol usuario por defecto, logs de correos fallidos, refactor de validarOCrearUsuarioOidc ([2fb1ac1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/2fb1ac122ef2a53c5eb510aedae3a29533ea4fae))
* corregidos repositorios de actualización de datos de activación y recuperación de cuenta ([3a8db8c](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/3a8db8c617e4c11a271c01edd6f93bf7487afbab))
* modificadas funciones de repositorio de usuario para usar update en lugar de save, dado que TypeOrm soporta ambas ([2fd90cc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/2fd90cc5124b9eb6f5c87e32ab02410ddd79429c))
* modificados métodos de usuario.service que usaban if's anidados, varias optimizaciones de código ([1a7070c](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/1a7070c1ff8786f4ce48f60b72b2dfb7e4ce85a9))
* respuesta del refresh token ([6eb6eaf](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/6eb6eaf5938885388745ebdf947ae490e694aff1))

## [1.6.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/compare/v1.5.0...v1.6.0) (2022-09-26)


### Features

* :sparkles: validación global de parámetros adicionado ([496a222](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/496a22235349d59c217be218dc08d15b9986b347))
* actualización de dependencias Nest 9.1.1 ([b32b66e](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/b32b66e178c1b5cbfec66488efafb75277683e38))
* actualizando servicios y controladores con BaseService y BaseController ([48ca6f0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/48ca6f07281b2a2e1175378050ec8c48c7bc0c93))
* adicionando id del usuario autenticado a reqId ([56ebae0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/56ebae04a0dc913bac6568ba3537fd4522161660))
* adicionando transacción a crear usuario ([a6545be](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/a6545be39c73894373bc818ebba97868e611d6dd))
* adicionando validaciones para dto ([75256df](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/75256df4efc53af785da05641efa950833e2526d))
* buildCheck adicionado para validar estados ([0aa29e5](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/0aa29e5147295b91b86b456c39821cb8f4056098))
* cambios en la forma de instanciar logger ([cea5ad0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/cea5ad0aae73630891b5fd11a0ae81e1f177e565))
* clase BaseExternalService adicionado para instanciar los servicios externos ([902aef5](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/902aef5c74539c1102a0d9cca09ea5418b829bb5))
* desactivando logs de JWTGuard ([c6f0a7c](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/c6f0a7c4813a6fdd127a004bd53fc7536173c39f))
* incorporación de transaccion por defecto ([afe8219](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/afe8219b889043537909565d38510b7dc2a07d3e))
* ip address adicionado al log de inicio de la aplicación ([d2faeeb](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d2faeebe73ab9ef65af90a42fd65aa751d4e60ca))
* logger module actualizado ([146d16f](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/146d16f07eb7eb1c4d0f3827e9e19fa52c9861cb))
* loggerService adicionado a OidcStrategy del módulo de autenticación ([d151610](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d1516106dc85b71c6d468f94c67f6ba8e6f1c147))
* mejoras en logo nest ([9ce9e76](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/9ce9e763abe64df6b9f82521e833160caf0ba0c1))
* mejoras en los mensajes de error de los metodos de autenticación ([644a7e7](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/644a7e7ddc94be5d84748765067a28b465bd0895))
* merge con feature/log-files ([bba7883](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/bba78831ff7cf52c0517a059fbe5024d8c8bd56c))
* normalizando modelos con el campo _estado ([269aa71](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/269aa7111332450d1ed73f241d6187efbd5a1f22))
* parámetro LOG_LEVEL adicionado a las variables de entorno ([2201cc2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/2201cc23d21101293e2d80acf4896f5a2ef0e2f4))
* redact path adicionado para ocultar información sensible en la consola ([bd955aa](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/bd955aa9f48e3778eead97830ca5253c09f2f66c))
* regla de eslint eqeqeq adicionado ([7cad55e](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/7cad55e7520387dcaea09d80060735151e7c908b))
* resolviendo conflictos del merge con develop ([a7e3a31](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/a7e3a31b203e399c9121114900843bbc1f71247b))
* se adicionó la impresión de rutas en el cargado de la aplicación ([391df10](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/391df1014baac00a851089c55208d9a8eba3ed23))
* se cambió la forma de instanciar logger ([f89f691](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/f89f69171fb54b8109038b061033bc62318a2bee))
* servicio estado actualizado con más información ([38e221e](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/38e221ee138a8390084c8e6183fa7ba9db3d086b))
* servicio SIN actualizado con BaseExternalService ([c0878fc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/c0878fc41d059c2cbf5fc770dc2b7f36e948727a))
* timestamp adicionado para los logs de la consola ([028480a](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/028480a3b7c66b046086a38e12d60867c02d1223))


### Bug Fixes

* ajuste de lint para seeder de parámetros e importacionies de logger ([7c8d408](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/7c8d40814498efb33612baa839c4af3d9c13a412))
* añadido campo _usuarioCreación a repositorios de parámetros, módulos y usuario; nuevo DTO IsNumberString ([ca60c48](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/ca60c48f072dfad960fe4faf9db3b7cb784e60d7))
* cambio de nombre variable paramsIdDto ([cc9879d](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/cc9879dd0795a57909aeee21e3ffd70d40fbcab2))
* cambios en ExternalServiceException para el registro de logs ([d041020](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d041020fe8b85b864cf58a27ec44efc3cd6d5201))
* cargado de las variables de entorno para LoggerConfig ([0e8b783](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/0e8b7839c9f31a17692a65efc519b53bf32952a7))
* corrección en interpretación de formato fecha de persona ([baaa341](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/baaa341d2e36bbe341aaf44a647b1e1f36991f1f))
* corrección en los seeders de usuario ([c40c93e](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/c40c93e67fcd971c110094dd30fa11df5fd1b09f))
* corrección en validación de fidModulo nulo para creación de secciones ([efe20a1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/efe20a1cb39af8ca1b88a4fa8b6d8c009df5e2ec))
* corrección en validación de oidc strategy para formato de user info con scope profile ([0f5b2fb](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/0f5b2fb954d97c92aab6846b7d2c8a1139cb5e21))
* creación automática de la carpeta de logs ([d754b00](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d754b004de00aa23b390c754dda8a5e961bcde76))
* eliminación de pipe validacion en controladores, corrección de path de class-validator ([2301f2d](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/2301f2d1501d885defb56319993ccf7430ca22fb))
* los usuarios creados por administrador tienen estado "ACTIVO" por defecto ([01a7c52](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/01a7c52b6d063d4036bfb09c8a79dd073fa08140))
* manejo de errores en el envio de correos ([9262bc4](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/9262bc4b691e71402e9a3352f64fac19800ac027))
* modificadas instancias condicionales anidadas, para evitar anidación de condicionales ([22a146e](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/22a146e719be9cc7ab1b064778c26e91760d4487))
* obtener appName y appVersion para el modo producción ([6c04f47](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/6c04f47c8ec5b587996a869862ee3ed76d345dad))
* print logo ([8d666f8](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/8d666f8e001f9c33a8c91d929e63218e6cfd9393))
* resuelto el error al imprimir objetos por la consola ([284c0be](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/284c0bee61790dcedebd46a4ca6926fc6a6c57fe))
* sample para crear scripts ([330503b](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/330503b10164ee8f17cbd8dfe321e5f7548f0667))
* solucionado la visualización de logs con pm2 ([52de2c4](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/52de2c47cace371ddb18c3e186f3cf3b9690ea9b))

## [1.5.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/compare/v1.3.2...v1.5.0) (2022-08-24)


### Features

* actualización de librerías NestJS 9.0.9 ([b309f4d](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/b309f4d0b6e91c0ace7c4ec43e0ec3283e64f8c9))
* agregando carpeta de logs por defecto al gitignore ([dd4f28b](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/dd4f28b32e3f14dbb14f5473b981330e905b9530))
* agregando variables de entorno a LogService ([ec329ed](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/ec329ed2657192746057511bfa1d2b76be102041))
* añadidas API's necesarias para crear y recuperar una cuenta con envio de correos ([d2708a3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/d2708a3c994ec2e8f57410f8f58eb2dfe60dfd9f))
* añadido flujo de activación de cuenta, con envio de correo y ajustes menores de logs ([3412178](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/3412178cd23eb77d870988a4b70b1903da9dfc4f))
* añadido PinnoLogger para el contexto de cada controlador, corregidos test de logs y propiedad req ([e20a197](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/e20a197f0d22dc757a82b16fb521a8012cb4e195))
* ficheros de log actualizados ([e587dfb](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/e587dfb5368ed22e4a28451a6adec6418ac520eb))
* mejoras en los mensajes de log para el modo desarrollo ([0b3721f](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/0b3721f2169eac3994b6f10e10835f25739f5a5c))
* se agregó morgan para logs de desarrollo ([b6ddb4e](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/b6ddb4e2d50e72587786bdec547b9b4910cc72a1))


### Bug Fixes

* corrección en paginado para API's de parámetros, módulos y usuarios ([2c6e5d8](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/2c6e5d8f397f4812027f673b3f9b0eca46ccbc76))
* filtros de politicas ([ae277eb](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/ae277eb99181f26a35afd17f5039773a105f1877))
* log de todas las rutas registradas ([5940712](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/5940712b4181cbe066c5deed20ef729b190daa96))
* log en modo producción ([8c5f155](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/8c5f15571f3635018591af26374afccc4300b88e))
* log service test ([66bad15](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/66bad157f44a366880c8563a6de436262e7c9219))
* mejoras en la configuración de logs ([0ed8568](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/0ed85682cb41495250544817488d28f1b7228f0a))
* mensajes de error para errores personalizados ([1867dd7](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/1867dd72768c15b2206f1633056887f98645fb29))
* modificado registro de cuenta con datos del usuario sin datos personales y tipos de dato fecha ([76c39a0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/commit/76c39a01938f3703f32716d68f5925ece764de46))

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
