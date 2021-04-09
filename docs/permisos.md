## PERMISOS
### Backend

#### RUTAS sin autenticacion
|verbo|ruta|
|-|-|
|GET|/estado|
|POST|/auth|
|GET|/ciudadania-auth|

#### Rutas - Usuario loggeado
|verbo|ruta|
|-|-|
|GET|/usuarios/profile|
|GET|/parametros/grupo/:grupo|
|GET|/autorizacion/politicas/roles|
|POST|/token|
|GET|/logout|

#### Rutas - Roles
|ruta/roles|ADMINISTRADOR|TECNICO|
|-|-|-|
|GET /autorizacion/politicas|x||
|POST /autorizacion/politicas|x||
|POST /autorizacion/politicas/eliminar|x||
|GET /roles|x||
|GET /modulos|x||
|GET /ciudadania-callback|||
|GET /usuarios|x||
|GET /usuarios/profile|x||
|POST /usuarios|x||
|PATCH /usuarios/:id|x||
|DELETE /usuarios/:id|x||
|GET /entidades|x|x|
|POST /entidades|x|x|
|PATCH /entidades/:id|x|x|
|DELETE /entidades/:id|x|x|
|GET /parametricas|x|x|
|POST /parametricas|x|x|