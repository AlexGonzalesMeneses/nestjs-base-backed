# Proyecto Base Backend

## Requerimientos
1. [Postgres](https://www.postgresql.org/download/linux/debian/)
2. [Node y Npm](https://github.com/nodesource/distributions/blob/master/README.md)
3. [Manejador de procesos PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)


## Instalación

1. Instalación de paquetes
```bash
$ npm install
```
2. Copiar el archivo .env.example y realizar las configuraciones necesarias
```
$ cp .env.example .env
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
- Ejecución en modo producción
```bash
# production mode
$ npm run start:prod
```
