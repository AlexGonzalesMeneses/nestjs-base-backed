# Crear base de datos

Ejemplo si la base de datos es `database_db`.

## Prerequisitos:

### Tener instalado docker y la instancia correcta de PostgreSQL:

```bash
# Crea una instancia de postgres (Solo para desarrollo)
docker run --name pg14 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:14.2
```

**Nota.-** Para `entornos de producción` se recomienda instalar PostgreSQL sin docker.

## Creando base de datos (de forma automática)

- `host: localhost`
- `port: 5432`
- `user: postgres`
- `pass: postgres`

Desde la carpeta: `/agetic-nestjs-base-backend/backups` ejecuta el siguiente comando:

```bash
# Ejemplo: bash crear.sh <dockerContainer> <dbname>
bash crear.sh pg14 database_db
```

## Creando base de datos (manualmente)

```bash
# creando base de datos
psql -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS database_db"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE database_db ENCODING 'UTF-8'"

# creando esquemas
psql -h localhost -p 5432 -U postgres -d database_db -c "CREATE SCHEMA usuarios AUTHORIZATION postgres"
psql -h localhost -p 5432 -U postgres -d database_db -c "CREATE SCHEMA parametricas AUTHORIZATION postgres"
```
