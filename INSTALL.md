# Proyecto Base Backend - Manual de instalación

## Requerimientos

Para continuar con la instalación del proyecto se necesita contar con las siguientes instalaciones ya realizadas:

1. [Postgres](https://www.postgresql.org/download/linux/debian/)
2. [Node y Npm](https://github.com/nodesource/distributions/blob/master/README.md)
3. [NVM](https://github.com/nvm-sh/nvm) Se recomienda NVM solo para ambientes de DESARROLLO.
4. [Manejador de procesos PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)


## Instalación

1. Instalación de paquetes.
```bash
$ npm install
```

2. Copiar el archivo .env.sample y realizar las configuraciones necesarias.
```
$ cp .env.sample .env
```

3. Revisar el archivo creado `.env` y configurar las variables necesarias. Los ejemplos se encuentran en el archivo `.env.sample` de configuración.

**NOTA**: PARA MAYOR DETALLE REVISAR LA ÚLTIMA VERSIÓN DEL ARCHIVO .env.sample.

**Datos de despliegue**
- NODE_ENV: ambiente de despliegue.
- PORT: Puerto en el que se levantará la aplicación.

**Configuración de la base de datos**
- DB_HOST: Host de la base de datos.
- DB_USERNAME: nombre de usuario de la base de datos.
- DB_PASSWORD: contraseña de la base de datos.
- DB_DATABASE: nombre de la base de datos.
- DB_PORT: puerto de despliegue de la base de datos.
- PATH_SUBDOMAIN: `api` - mantener.

**Configuración para módulo de autenticación**
- JWT_SECRET: Llave para generar los tokens de autorización. Genera una llave fuerte para producción.
- JWT_EXPIRES_IN: Tiempo de expiración del token de autorización en milisegundos.
- REFRESH_TOKEN_NAME: `jid`
- REFRESH_TOKEN_EXPIRES_IN: tiempo en milisegundos
- REFRESH_TOKEN_ROTATE_IN: tiempo en milisegundos
- REFRESH_TOKEN_SECURE: `false`
- REFRESH_TOKEN_DOMAIN: dominio de despligue
- REFRESH_TOKEN_PATH: `/`

**Configuración para el servicio de Mensajería Electrónica (Alertín), si se utiliza en el sistema**
- MSJ_URL: URL de consumo al servicio de Mensajería Electrónico (Alertín).
- MSJ_TOKEN: TOKEN de consumo al servicio de Mensajería Electrónico (Alertín).

**Configuración para el servicio SEGIP de IOP, si corresponde**
- IOP_SEGIP_URL: URL de consumo al servicio interoperabilidad de SEGIP.
- IOP_SEGIP_TOKEN: Token de consumo al servicio interoperabilidad de SEGIP.

**Configuración para el servicio SIN de IOP, si corresponde**
- IOP_SIN_URL:
- IOP_SIN_TOKEN:

**Configuración para la integracion de autenticación con Ciudadanía Digital**
- OIDC_ISSUER
- OIDC_CLIENT_ID
- OIDC_CLIENT_SECRET
- OIDC_SCOPEoffline_access
- OIDC_REDIRECT_URI
- OIDC_POST_LOGOUT_REDIRECT_URI
- SESSION_SECRET

**Configurar la URL del frontend, según el ambiente de despliegue**
- URL_FRONTEND: dominio en el que se encuentra levantado el frontend, si corresponde.

**Configuración para almacenamiento de archivos**
- PDF_PATH: ruta en el que se almacenarán los archivos, si corresponde.

**Configuración de Logs, según el ambiente**
- LOG_PATH:
- LOG_HIDE:request.headers.host request.headers.authorization request.body.contrasena
- LOG_URL:
- LOG_URL_TOKEN:
- LOG_PATH:
- LOG_STD_OUT:
- REFRESH_TOKEN_REVISIONS=`*/5 * * * *`

4. Copiar el archivo src/common/params/index.ts.sample y realizar las configuraciones necesarias.
```
$ cp src/common/params/index.ts.sample src/common/params/index.ts
```

5. Revisar el archivo creado `index.ts` y configurar las variables necesarias. Los ejemplos se encuentran en el archivo `index.ts.sample` de parametros de configuración.

## Preparación

- Generación de migraciones
```
$ npm run migrations:generate <nombre-migracion>
```
- Ejecución de migraciones
```
$ npm run migrations:run
```
- Ejecucion de seeders
```
$ npm run seeds:run
```

## Ejecución manual

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
- Ejecución en modo PRODUCCIÓN
```bash
# production mode
$ npm run start:prod
```

## Ejecución con PM2

Generar archivos para producción.

```
$ npm run build
```

Para ambientes de producción se recomienda levantar la aplicación con el manejador de procesos `pm2`. Ejemplo:

```sh
pm2 start dist/src/main.js --name backend-base
```

(Recomendado) Se puede levantar la aplicación con múltiples procesos. Ejemplo, para levantar 4 procesos del mismo:

```sh
pm2 start dist/src/main.js --name backend-base -i 4
```
