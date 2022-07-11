#!/usr/bin/bash

arg1=${1:-pg14}
arg2=${2:-database_db}
arg3=${3:-database_db.gz}

arg4=${4:-localhost}
arg5=${5:-5432}
arg6=${6:-postgres}
arg7=${7:-postgres}

dockerContainer="${arg1}"

dbname="${arg2}"
dbhost="${arg4}"
dbport="${arg5}"
dbuser="${arg6}"
dbpass="${arg7}"

filename="${arg3/.gz/''}"
dbfile="$filename.gz"

# [INI] SQL
echo -e "\n\n >>> Restaurando SQL backup desde $dbfile a $dbname ($dbhost:$dbport)...\n"

docker restart $dockerContainer
docker exec $dockerContainer psql -h $dbhost -U postgres -c "DROP DATABASE IF EXISTS $dbname"
docker exec $dockerContainer psql -h $dbhost -U postgres -c "CREATE DATABASE $dbname ENCODING 'UTF-8'"
docker exec $dockerContainer psql -h $dbhost -U postgres -c "SELECT 1 FROM pg_user WHERE usename = '$dbuser'" | grep -q 1 \
|| docker exec $dockerContainer psql -h $dbhost -U postgres -c "CREATE USER $dbuser WITH LOGIN SUPERUSER PASSWORD '$dbpass'"
docker exec $dockerContainer psql -h $dbhost -U postgres -c "ALTER DATABASE $dbname OWNER TO $dbuser"

echo " - Copiando..."
docker cp "$dbfile" $dockerContainer:/
sleep 2;

echo " - Descomprimiendo..."
docker exec $dockerContainer gunzip -kf "$filename".gz
sleep 2;

echo " - Removiendo $filename.gz..."
docker exec $dockerContainer rm -rf "$filename".gz
sleep 2;

echo " - Restaurando..."
docker exec $dockerContainer psql -h $dbhost -U postgres -d "$dbname" -f "$filename"
sleep 2;

echo " - Removiendo $filename..."
docker exec $dockerContainer rm -rf "$filename"
sleep 2;

echo -e "\n - [éxito] $dbname ($dbhost)"
# [END] SQL

echo -e "\n\n >>> ¡Base de datos restaurada con éxito! :)\n"
