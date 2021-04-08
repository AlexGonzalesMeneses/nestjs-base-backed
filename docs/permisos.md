## PERMISOS
### Backend

#### RUTAS sin autenticacion
|verbo|ruta|
|-|-|
|GET|/estado|
|POST|/auth|

#### Rutas - Usuario loggeado
|verbo|ruta|
|-|-|
|GET|/usuarios/profile|
|GET|/parametros/grupo/:grupo|
|GET|/autorizacion/politicas/roles|

#### Rutas - Roles
|ruta/roles|ADMINISTRADOR|TECNICO|
|-|-|-|
|GET /autorizacion/politicas|||
|POST /autorizacion/politicas|||
|POST /autorizacion/politicas/eliminar|||
|GET /roles|x|||
|GET /modulos|||
|POST /token|||
|GET /ciudadania-auth|||
|GET /ciudadania-callback|||
|GET /logout|||
|GET /usuarios|x||
|GET /usuarios/profile|x||
|POST /usuarios|||
|PATCH /usuarios/:id|||
|DELETE /usuarios/:id|||
|GET /entidades|x|x|
|POST /entidades|x||
|PATCH /entidades/:id|x||
|DELETE /entidades/:id|x||
|GET /parametricas|x||
|POST /parametricas|x||