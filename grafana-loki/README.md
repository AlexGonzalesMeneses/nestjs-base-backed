# Instrucciones para desplegar el servidor de logs

Primero levantar el proyecto base backend con las variables de entorno habilitadas para el registro de logs en ficheros (1ra forma) 

```bash
# Para guardar logs 1ra forma - en ficheros Ej: LOG_PATH=/tmp/logs/
LOG_PATH=/tmp/logs/
LOG_SIZE=5M
LOG_INTERVAL=1d
LOG_COMPRESS=false
```

Una vez el servicio se encuentre activo verificar la existencia de los ficheros de logs (archivo: `/tmp/logs/agetic-nestjs-base-backend/info.log`)

## 1. Archivos de configuración:

Crea el archivo `grafana.env` en base al archivo de ejemplo `grafana.env.sample`

Para levantar los servicios de grafana y loki se utilizará docker:

```bash
docker compose up -d
```

**Nota.-** El comando `-d` permite que los servicios sigan activos en segundo plano

Dashboard Grafana [http://localhost:5000/](http://localhost:5000/)

### Credenciales por defecto
```bash
user: admin
pass: admin
```
