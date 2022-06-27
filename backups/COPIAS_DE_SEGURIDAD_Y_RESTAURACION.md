# Copias de seguridad y restauración de bases de datos con docker

## Backup

```bash
pg_dump -h localhost -p 5432 -U postgres database_db | gzip > database_db_$(date '+%Y%m%d%H%M%S').gz
```

## Restore

Prerequisitos:

#### 1. Tener instalado docker y la instancia correcta de PostgreSQL:

```bash
# Crea una instancia de postgres
docker run --name pg14 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:14.2
```

#### 2. Tener el archivo del backup (Ej.: `database_db.gz`).

```txt
/agetic-nestjs-base-backend/backups
    |-- .gitignore
    |-- database_db.gz
    |-- restaurar.sh
```

#### 3. Restaurando base de datos (de forma automática)

Desde la carpeta: `/agetic-nestjs-base-backend/backups` ejecuta el siguiente comando:

```bash
# Ejemplo: bash restaurar.sh <filename> <dbname>
bash restaurar.sh database_db.gz database_db
```

#### 4. Restaurando base de datos (manualmente)

```bash
# descomprimiendo backup
gunzip -kf database_db.gz

# creando base de datos
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS database_db"
psql -h localhost -U postgres -c "CREATE DATABASE database_db ENCODING 'UTF-8'"

# restaurando backup
psql -h localhost -U postgres -d database_db -f database_db
```
