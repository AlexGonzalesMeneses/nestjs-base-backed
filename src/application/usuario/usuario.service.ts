import { Injectable, PreconditionFailedException, Query } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from '../../common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { UsuarioDto } from './dto/usuario.dto';
import { Persona } from '../persona/persona.entity';
import { Status } from '../../common/constants';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { TextService } from '../../common/lib/text.service';
import { MensajeriaService } from '../../core/external-services/mensajeria/mensajeria.service';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../common/constants/response-messages';
import { AuthorizationService } from '../../core/authorization/controller/authorization.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    private readonly mensajeriaService: MensajeriaService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  // GET USERS
  async listar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ): Promise<TotalRowsResponseDto> {
    const resultado = await this.usuarioRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(resultado);
  }

  async buscarUsuario(usuario: string): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuario(usuario);
  }

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    const result = await this.usuarioRepositorio.crear(
      usuarioDto,
      usuarioAuditoria,
    );
    const { id, estado } = result;
    return { id, estado };
  }

  async activar(idUsuario, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING];
    if (usuario && statusValid.includes(usuario.estado as Status)) {
      // TODO: realizar validacion con segip
      // cambiar estado al usuario y generar una nueva contrasena
      const contrasena = TextService.generateShortRandomText();
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.contrasena = await TextService.encrypt(contrasena);
      usuarioDto.estado = Status.PENDING;
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      // const result = await this.usuarioRepositorio.save(usuario);
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);
      // si todo bien => enviar el mail con la contraseña generada
      await this.enviarCorreoContrasenia(usuario.correoElectronico, contrasena);
      return { id: idUsuario, estado: usuarioDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  async inactivar(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    if (usuario) {
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      usuarioDto.estado = Status.INACTIVE;
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);
      return {
        id: idUsuario,
        estado: usuarioDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  private async enviarCorreoContrasenia(correo, contrasena) {
    const mensaje = `La contraseña para su inicio de sesión es: ${contrasena}`;
    const result = await this.mensajeriaService.sendEmail(
      correo,
      Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
      mensaje,
    );
    return result.finalizado;
  }

  async actualizarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
    const hash = TextService.decodeBase64(contrasenaActual);
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(
      idUsuario,
    );
    if (usuario && (await TextService.compare(hash, usuario.contrasena))) {
      // validar que la contrasena nueva cumpla nivel de seguridad
      const contrasena = TextService.decodeBase64(contrasenaNueva);
      if (TextService.validateLevelPassword(contrasena)) {
        // guardar en bd
        const usuarioDto = new ActualizarUsuarioDto();
        usuarioDto.contrasena = await TextService.encrypt(contrasena);
        usuarioDto.estado = Status.ACTIVE;
        await this.usuarioRepositorio.update(idUsuario, usuarioDto);
        return {
          id: idUsuario,
          estado: usuarioDto.estado,
        };
      }
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE);
    }
    throw new PreconditionFailedException(Messages.INVALID_CREDENTIALS);
  }

  async restaurarContrasena(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    const statusValid = [Status.ACTIVE, Status.PENDING];
    if (usuario && statusValid.includes(usuario.estado as Status)) {
      const contrasena = TextService.generateShortRandomText();
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.contrasena = await TextService.encrypt(contrasena);
      usuarioDto.estado = Status.PENDING;
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);

      // si todo bien => enviar el mail con la contraseña generada
      await this.enviarCorreoContrasenia(usuario.correoElectronico, contrasena);
      return { id: idUsuario, estado: usuarioDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  // update method
  async update(id: string, usuarioDto: UsuarioDto) {
    const usuario = await this.usuarioRepositorio.preload({
      id: id,
      ...usuarioDto,
    });
    if (!usuario) {
      throw new EntityNotFoundException(Messages.INVALID_USER);
    }
    return this.usuarioRepositorio.save(usuario);
  }

  async buscarUsuarioId(id: string): Promise<any> {
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(id);
    let roles = [];
    if (usuario?.usuarioRol?.length) {
      roles = await Promise.all(
        usuario.usuarioRol.map(async (usuarioRol) => {
          const { rol } = usuarioRol.rol;
          const modulos = await this.authorizationService.obtenerPermisosPorRol(
            rol,
          );
          return {
            rol,
            modulos,
          };
        }),
      );
    } else {
      throw new EntityNotFoundException(Messages.INVALID_USER);
    }
    return {
      id: usuario.id,
      usuario: usuario.usuario,
      estado: usuario.estado,
      roles,
      persona: usuario.persona,
    };
  }

  async buscarUsuarioPorCI(persona: Persona): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuarioPorCI(persona);
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    const usuario = await this.usuarioRepositorio.actualizarContadorBloqueos(
      idUsuario,
      intento,
    );
    return usuario;
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    const usuario = await this.usuarioRepositorio.actualizarDatosBloqueo(
      idUsuario,
      codigo,
      fechaBloqueo,
    );
    return usuario;
  }

  async desbloquearCuenta(codigo: string) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoDesbloqueo(
      codigo,
    );
    if (usuario?.fechaBloqueo) {
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.fechaBloqueo = null;
      usuarioDto.intentos = 0;
      usuarioDto.codigoDesbloqueo = null;
      await this.usuarioRepositorio.update(usuario.id, usuarioDto);
    }
    return {
      id: usuario.id,
      estado: usuario.estado,
    };
  }
}
