export class TemplateEmailService {
  static obtenerPlantillaActivacionCuenta(url, usuario, contrasena) {
    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
        </head>
        <body>
          <div class="container">
            Para acceder al sistema ingrese a la siguiente url: <a href="${url}">${url}</a><br/>
            Los datos de acceso se detallan a continuación:
              <ul>
                <li><b>Usuario:</b></li> ${usuario}
                <li><b>Contraseña:</b></li> ${contrasena}
              </ul>
          </div>
        </body>
      </html>
    `;
  }
}
