# Proyecto Base Backend

## Requerimientos

Para continuar con la instalación del proyecto se necesita contar con las siguientes instalaciones ya realizadas:

1. [Postgres](https://www.postgresql.org/download/linux/debian/)
2. [Node y Npm](https://github.com/nodesource/distributions/blob/master/README.md)
3. [NVM](https://github.com/nvm-sh/nvm) Se recomienda NVM solo para ambientes de DESARROLLO.
4. [Manejador de procesos PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)


## Instalación

1. Instalación de paquetes
```bash
$ npm install
```
2. Copiar el archivo .env.sample y realizar las configuraciones necesarias
```
$ cp .env.sample .env
```

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
- Ejecución en modo PRODUCCIÓN
```bash
# production mode
$ npm run start:prod
```
