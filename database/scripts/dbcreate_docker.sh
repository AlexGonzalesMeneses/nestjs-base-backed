#!/usr/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

arg1=${1:-pg16}

dockerContainer="${arg1}"

echo -e "\n\n >>> Creando Base de datos...\n"

echo -e "\nReiniciando el contenedor $dockerContainer...\n";
docker restart $dockerContainer
sleep 2;

echo -e "\nPreparando script de creación...\n";
docker cp $(dirname "$0")/dbcreate.sql $dockerContainer:/tmp/dbcreate.sql
sleep 2;

echo -e "\nEjecutando script de creación...\n";
docker exec $dockerContainer bash -c 'psql -U postgres -f /tmp/dbcreate.sql'
sleep 2;

echo -e "\n [éxito] :)\n"
