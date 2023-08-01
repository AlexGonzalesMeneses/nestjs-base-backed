# Logger

Librería para registrar eventos o capturar errores del sistema.

## Modo de uso

**Ejemplo 1** Para registrar un error controlado manualmente

```ts
import { LoggerService } from '../src/core/logger'

const logger = LoggerService.getInstance()

function tarea(datos) {
  try {
    // código inseguro
  } catch (error) {
    logger.error(error)
  }
}
```

Ejemplos de implementación:

```ts
logger.error(error)
logger.error(error, mensaje)
logger.error(error, mensaje, metadata)
logger.error(error, mensaje, metadata, modulo)
logger.error(error, {
  mensaje,
  metadata,
  modulo,
})

logger.warn(mensaje)
logger.warn(mensaje, metadata)
logger.warn(mensaje, metadata, modulo)
logger.warn({
  mensaje,
  metadata,
  modulo,
})

logger.info(mensaje)
logger.info(mensaje, metadata)
logger.info(mensaje, metadata, modulo)
logger.info({
  mensaje,
  metadata,
  modulo,
})

logger.debug(mensaje)
logger.debug(mensaje, metadata)
logger.debug(mensaje, metadata, modulo)
logger.debug({
  mensaje,
  metadata,
  modulo,
})

logger.trace(mensaje)
logger.trace(mensaje, metadata)
logger.trace(mensaje, metadata, modulo)
logger.trace({
  mensaje,
  metadata,
  modulo,
})
```

**Ejemplo 2** Para lanzar una excepción controlada

```ts
import { BaseException } from '../src/core/logger'

function tarea(datos) {
  try {
    // código inseguro
  } catch (error) {
    throw new BaseException(error, {
      mensaje: 'mensaje genérico opcional',
      modulo: 'MENSAJERÍA',
      metadata: { info: 'info adicional', datos },
    })
  }
}
```

Ejemplos de implementación:

```ts
throw new BaseException(error)
throw new BaseException(error, {
  mensaje,
  metadata,
  modulo,
  httpStatus,
  causa,
  accion,
})
```

## Casos de uso

- Para registrar errores. Ej.: errores en tiempo de ejecución. Registro manual (errores controlados) y registro automático (errores no controlados)
- Para registrar eventos. Ej.: cuando un servicio ha sido iniciado o detenido, cuando un componente ha sido activado. Registro manual

## 1. Para capturar errores en tiempo de ejecución

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

**Ejemplo 1:** Para lanzar una excepción propia de NestJS (de tipo `HttpException`)

```ts
import { UnauthorizedException } from '@nestjs/common'

function validar(headers) {
  if (!headers.authorization) {
    throw new UnauthorizedException()
  }
}
```

**Ejemplo 2:** Para lanzar una excepción personalizada (de tipo `BaseException`)

```ts
import { BaseException } from '../src/core/logger'
import { HttpStatus } from '@nestjs/common'

function validar(headers) {
  if (!headers.authorization) {
    throw new BaseException(null, {
      httpStatus: HttpStatus.UNAUTHORIZED,
      causa: 'Valor no definido "headers.authorization"',
      metadata: { headers },
    })
  }
}
```

## 2.2 Errores No Controlados

Algunos errores que pueden presentarse de manera imprevista son los siguientes:

**Ejemplo 1:** Cuando una consulta SQL no se encuentra bien formulada:

```ts
async recuperar() {
  return await this.dataSource
    .getRepository(Usuario)
    .createQueryBuilder('usuario')
    .leftJoinAndSelect('usuario.relacioninexistente', 'relacioninexistente')
    .getMany()
}
```

**Nota.-** Estos tipos de errores siempre serán de tipo `500 Internal Server Exception`

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

## 3. Logs de auditoría

Estos registros se crean en ficheros independientes y son utilizados para registrar eventos del sistema.

**Ejemplo** Para registrar un error controlado manualmente

```ts
import { LoggerService } from '../src/core/logger'

const logger = LoggerService.getInstance()

function login(user) {
  this.logger.audit('authentication', {
    mensaje: 'Ingresó al sistema',
    metadata: { usuario: user.id, tipo: 'básico' },
  })
}
```

Ejemplos de implementación:

```ts
logger.audit('application', mensaje)
logger.audit('application', mensaje, metadata)
logger.audit('application', {
  mensaje,
  metadata,
})
```
