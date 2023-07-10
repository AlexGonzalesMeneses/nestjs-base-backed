# Exception Manager

Librería para registrar eventos o capturar errores del sistema.

## Modo de uso

Desde cualquier parte de la aplicación, importamos `LoggerService` y `ExceptionManager`.

```ts
import { LoggerService } from '../src/core/logger'
import { ExceptionManager } from '../src/common/exception-manager'

const logger = LoggerService.getInstance()

ExceptionManager.initialize({
  appName: 'app-demo-backend',
  appVersion: '1.0.0',
  logger,
})
```

Luego configuramos el manejador de errores para una determinada tarea:

```ts
try {
  // Tareas a controlar
} catch (error: unknown) {
  const errorInfo = ExceptionManager.handleError(error, 'Nombre del Servicio', {
    mensaje: 'Mensaje para el cliente',
  })
}
```

## Casos de uso

- Para registrar errores críticos. Ej.: errores de conexión con la base de datos. Registro manual
- Para registrar errores. Ej.: errores en tiempo de ejecución. Registro manual (errores controlados) y registro automático (errores no controlados)
- Para registrar eventos. Ej.: cuando un servicio ha sido iniciado o detenido, cuando un componente ha sido activado. Registro manual

## 1. Para registrar errores críticos

Los errores críticos son aquellos que interrumpen o impiden el funcionamiento normal del sistema y pueden causar fallas graves o incluso la detención completa del sistema.

**Ejemplo:** Errores de conexión con la base de datos

```ts
db.open((error) => {
  if (error) {
    logger.fatal('No se pudo establecer conexión con la base de datos', error)
    process.exit(1)
  }
})
```

## 2. Para capturar errores en tiempo de ejecución

Los errores en tiempo de ejecución son problemas que se producen durante la ejecución de un programa y pueden interrumpir su funcionamiento normal.

Estos errores son capturados como excepciones y requieren un proceso de depuración para identificar y corregir la causa subyacente.

## 2.1 Errores Controlados

Nest proporciona un conjunto de [excepciones estándar](https://docs.nestjs.com/exception-filters#built-in-http-exceptions) que se heredan de la base `HttpException`. Estos se exponen desde el paquete `@nestjs/common`, las excepciones HTTP más comunes:

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `ConflictException`
- `PreconditionFailedException`
- `...`

**Ejemplo 1:** Archivo `src/core/usuario/service/usuario.service.ts`

```ts
import { PreconditionFailedException } from '@nestjs/common'

if (!usuario) {
  throw new PreconditionFailedException(Messages.INVALID_USER)
}
```

**Ejemplo 2:** Archivo `src/core/authentication/controller/authentication.controller.ts`

```ts
import { BadRequestException } from '@nestjs/common'

if (!req.user) {
  throw new BadRequestException(
    `Es necesario que esté autenticado para consumir este recurso.`
  )
}
```

## 2.2 Errores No Controlados

Este tipo de errores siempre serán considerados de tipo `500 Internal Server Error`

**Ejemplo 1:** Archivo `src/common/lib/util.service.ts`

```ts
if (values.length === 0) {
  throw new Error('[buildCheck] Debe especificarse al menos un item')
}
```

**Ejemplo 2:** Archivo `src/core/usuario/repository/usuario.repository.ts`

```ts
async recuperar() {
  return await this.dataSource
    .getRepository(Usuario)
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.relacioninexistente', 'relacioninexistente')
    .getMany()
}
```

## 3. Para registrar eventos

**Ejemplo 1:** Archivo `src/core/authentication/oidc.client.ts`

```ts
logger.trace('Creando cliente de ciudadanía...', {
  oidcIssuer,
})
```

**Ejemplo 2:** Archivo `src/core/external-services/mensajeria/mensajeria.service.ts`

```ts
logger.trace('Instanciando servicio de MENSAJERÍA...', {
  baseURL: httpService.axiosRef.defaults.baseURL,
})
```
