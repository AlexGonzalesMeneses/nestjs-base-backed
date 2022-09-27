export class ActualizarUsuarioDto {
  id?: string
  estado?: string | null
  correoElectronico: string
  contrasena?: string | null
  intentos?: number | null
  fechaBloqueo?: string | null
  codigoDesbloqueo?: string | null
  usuarioActualizacion: string
}
