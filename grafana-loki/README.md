# Instrucciones para desplegar el servidor de logs

Primero levantar el proyecto base backend con las variables de entorno habilitadas para el registro de logs en ficheros (1ra forma)

```bash
# Para guardar logs 1ra forma - en ficheros Ej: LOG_PATH=/tmp/logs/
LOG_PATH=/tmp/logs/
LOG_SIZE=5M
LOG_INTERVAL=1d
LOG_COMPRESS=false
```

Una vez el servicio se encuentre activo verificar la existencia de los ficheros de logs:

- Archivo: `/tmp/logs/agetic-nestjs-base-backend/info.log`

## Despliegue en modo desarrollo.
  
- `http://localhost/grafana` Grafana

Archivo `grafana.env`

```bash
GF_SERVER_DOMAIN=localhost
GF_SERVER_ROOT_URL=http://localhost/grafana
GF_SERVER_SERVE_FROM_SUB_PATH=false
```

Desplegamos los servicios de grafana, loki y promtail con docker:

```bash
docker compose up -d
```

## Despliegue en producción 2da forma - en el mismo servidor dentro de una subcarpeta

**Ejemplo:** Si tenemos el dominio: `http://localhost`

Config de ejemplo de nginx

```config
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }

    location /grafana/ {
        proxy_pass         http://127.0.0.1:5000;
        proxy_set_header   Host $http_host;
    }
}
```

Archivo `grafana.env`

```bash
GF_SERVER_DOMAIN=localhost
GF_SERVER_ROOT_URL=http://localhost/grafana
GF_SERVER_SERVE_FROM_SUB_PATH=true
```
