# Proyecto Base Backend - Manual de instalación para entornos de desarrollo

## 1. Requerimientos

| Nombre       | Versión | Descripción                                            | Instalación                                      |
|--------------|---------|--------------------------------------------------------|--------------------------------------------------|
| `PostgreSQL` | ^14     | Gestor de base de datos.                               | https://www.postgresql.org/download/linux/debian |
| `NodeJS`     | ^16     | Entorno de programación de JavaScript.                 | `nvm install 16` https://github.com/nvm-sh/nvm   |
| `NPM`        | ^8      | Gestor de paquetes de NodeJS.                          | `npm install -g npm@8.5.5`                       |
| `PM2`        | ^5.2    | Gestor avanzado de procesos de producción para NodeJS. | `npm install -g pm2@5.2`                         |

## 2. Instalación

### Clonación del proyecto e instalación de dependencias

```bash
# Clonación del proyecto
git clone git@gitlab.agetic.gob.bo:agetic/agetic/proyectos-base/agetic-nestjs-base-backend.git

# Ingresamos dentro de la carpeta del proyecto
cd agetic-nestjs-base-backend

# Cambiamos a la rama develop
git checkout develop

# Instalamos dependencias
npm install
```

### Archivos de configuración.

Crear los archivos de configuración con base en los archivos `sample` y modificar los valores que sean necesarios.

```bash
# Variables de entorno globales
cp .env.sample .env

# Otros parámetros requeridos
cp src/common/params/index.ts.sample src/common/params/index.ts

# [OPCIONAL] Para el modo producción
cp ecosystem.config.js.sample ecosystem.config.js
```

## Creación y configuración de la Base de Datos

```bash
# Crear los siguientes esquemas de base de datos:
create schema usuarios;
create schema parametricas;
```

Para más detalles ver el archivo [backups/CREAR_BASE_DE_DATOS.md](./backups/CREAR_BASE_DE_DATOS.md)

```bash
# Configura la base de datos.
npm run setup
```

## Despliegue de la aplicación

```bash
# Ejecución en modo desarrollo
npm run start

# Ejecución en modo desarrollo (live-reload)
npm run start:dev

# Ejecución en modo PRODUCCIÓN
npm run build
npm run start:prod

# Ejecución en modo PRODUCCIÓN (con proceso activo en segundo plano)
npm run build
pm2 start ecosystem.config.js
```

## Ejecución de pruebas unitarias y de integración

```bash
# Todas las pruebas
npm run test

# Pruebas e2e
npm run test:e2e

# Pruebas de cobertura
npm run test:cov
```

## Comandos útiles para el modo desarrollo

```bash
# Verifica la sintaxis
npm run lint

# Crea una nueva migración
npm run seeds:create adicionarColumnaEstado

# Ejecuta las migraciones
npm run seeds:run
```

## Variables de entorno

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
- LOG_STD_OUT:
- REFRESH_TOKEN_REVISIONS=`*/5 * * * *`
