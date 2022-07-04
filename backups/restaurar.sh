#!/usr/bin/bash

arg1=${1:-database_db.gz}
arg2=${2:-database_db}
filename="${arg1/.gz/''}"
database="${arg2}"

dbfile="$filename.gz"
dbname="$database"

dbschema="public"
dbhost="localhost"
dbuser="postgres"
dbpass="postgres"

dockerContainer="pg14"

# [INI] SQL
echo -e "\n\n >>> Restaurando SQL backup desde $dbfile a $dbname ($dbhost)...\n"

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

echo -e "\n - [success] $dbname ($dbhost)"
# [END] SQL

echo -e "\n\n >>> ¡SQL backup restaurado con éxito! :)\n"
