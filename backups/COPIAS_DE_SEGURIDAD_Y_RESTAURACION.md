# Copias de seguridad y restauración de bases de datos con docker

Ejemplo si la base de datos es `database_db`.

## Prerequisitos:

### Tener instalado docker y la instancia correcta de PostgreSQL:

```bash
# Crea una instancia de postgres (Solo para desarrollo)
docker run --name pg14 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:14.2
```

**Nota.-** Para `entornos de producción` se recomienda instalar PostgreSQL sin docker.

## Creando backup

```bash
pg_dump -h localhost -p 5432 -U postgres database_db | gzip > database_db_$(date '+%Y%m%d%H%M%S').gz
```

## Restaurando backup (de forma automática)

- `host: localhost`
- `port: 5432`
- `user: postgres`
- `pass: postgres`

Si tenemos el archivo del backup (Ej.: `database_db.gz`).

```txt
/agetic-nestjs-base-backend/backups
    |-- .gitignore
    |-- database_db.gz
    |-- restaurar.sh
```

Desde la carpeta: `/agetic-nestjs-base-backend/backups` ejecuta el siguiente comando:

```bash
# Ejemplo: bash restaurar.sh <dockerContainer> <dbname> <filename>
bash restaurar.sh pg14 database_db database_db.gz
```

#### 4. Restaurando base de datos (manualmente)

```bash
# descomprimiendo backup
gunzip -kf database_db.gz

# creando base de datos
psql -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS database_db"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE database_db ENCODING 'UTF-8'"

# restaurando backup
psql -h localhost -p 5432 -U postgres -d database_db -f database_db

# removiendo archivo temporal
rm -rf database_db
```
