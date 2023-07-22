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
    logger.error(error, {
      mensaje: 'mensaje genérico opcional',
      detalle: ['info adicional', datos],
      modulo: 'MENSAJERÍA'
    })
  }
}
```

Ejemplos de implementación:

```ts
logger.error(error)
logger.error(error, mensaje)
logger.error(error, mensaje, detalle)
logger.error(error, mensaje, detalle. modulo)
logger.error(error, {
  mensaje,
  detalle,
  modulo,
})

// todos los parámetros posibles
logger.error(error, {
  httpStatus,
  mensaje,
  detalle,
  sistema,
  modulo,
  causa,
  accion,
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
      detalle: ['info adicional', datos],
      modulo: 'MENSAJERÍA'
    })
  }
}
```

Ejemplos de implementación:

```ts
// Si se conoce el error, el httpStatus y la causa se asignan automáticamente en base a este
throw new BaseException(error)

// Si no conoce el error, puede especificar manualmente el httpStatus y la causa del mismo
throw new BaseException(null, {
  httpStatus,
  causa,
})

// Todos los valores posibles
throw new BaseException(error, {
  httpStatus,
  causa,
  mensaje,
  detalle,
  sistema,
  modulo,
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
      detalle: { headers },
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
