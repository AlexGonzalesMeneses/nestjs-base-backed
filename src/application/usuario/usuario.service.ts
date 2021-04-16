import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  Query,
} from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from '../../common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { UsuarioDto } from './dto/usuario.dto';
import { Persona } from '../persona/persona.entity';
import {
  ACTIVE,
  CREATE,
  INACTIVE,
  PENDING,
} from '../../common/constants/status';
import { PersonaRepository } from '../persona/persona.repository';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { TextService } from '../../common/lib/text.service';
import { MensajeriaService } from '../../core/external-services/mensajeria/mensajeria.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    private personaRepositorio: PersonaRepository,
    private readonly mensajeriaService: MensajeriaService,
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

  async activar(idUsuario: string) {
    const usuario = await this.usuarioRepositorio.preload({ id: idUsuario });
    const statusValid = [CREATE, INACTIVE, PENDING];
    if (usuario && statusValid.includes(usuario.estado)) {
      // TODO: realizar validacion con segip
      // cambiar estado al usuario y generar una nueva contrasena
      const contrasena = TextService.generateShortRandomText();
      usuario.contrasena = TextService.encrypt(contrasena);
      usuario.estado = 'PENDIENTE';
      const result = await this.usuarioRepositorio.save(usuario);

      // si todo bien => enviar el mail con la contraseña generada
      await this.enviarCorreoContrasenia(usuario.correoElectronico, contrasena);
      return { id: result.id, estado: result.estado };
    }
    throw new NotFoundException(
      'El usuario no existe o no contiene un estado valido.',
    );
  }

  private async enviarCorreoContrasenia(correo, contrasena) {
    const asunto = 'Generacion de credenciales';
    const mensaje = `La contraseña para su inicio de sesión es: ${contrasena}`;
    const result = await this.mensajeriaService.sendEmail(
      correo,
      asunto,
      mensaje,
    );
    return result.finalizado;
  }

  async actualizarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioId(idUsuario);
    if (
      usuario &&
      usuario.contrasena === TextService.encrypt(contrasenaActual)
    ) {
      // validar que la contrasena nueva cumpla nivel de seguridad
      if (TextService.validateLevelPassword(contrasenaNueva)) {
        // guardar en bd
        usuario.contrasena = TextService.encrypt(contrasenaNueva);
        usuario.estado = ACTIVE;
        const result = await this.usuarioRepositorio.save(usuario);
        return {
          id: result.id,
          estado: result.estado,
        };
      }
      throw new PreconditionFailedException(
        'La contraseña nueva no cumple el nivel de seguridad necesario.',
      );
    }
    throw new PreconditionFailedException(`Credenciales incorrectas!!!`);
  }

  async restaurarContrasena(idUsuario: string) {
    const usuario = await this.usuarioRepositorio.preload({ id: idUsuario });
    const statusValid = [ACTIVE];
    if (usuario && statusValid.includes(usuario.estado)) {
      const contrasena = TextService.generateShortRandomText();
      usuario.contrasena = TextService.encrypt(contrasena);
      usuario.estado = PENDING;
      const result = await this.usuarioRepositorio.save(usuario);

      // si todo bien => enviar el mail con la contraseña generada
      await this.enviarCorreoContrasenia(usuario.correoElectronico, contrasena);
      return { id: result.id, estado: result.estado };
    }
    throw new NotFoundException(
      'El usuario no existe o no contiene un estado valido.',
    );
  }

  // update method
  async update(id: string, usuarioDto: UsuarioDto) {
    const usuario = await this.usuarioRepositorio.preload({
      id: id,
      ...usuarioDto,
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.usuarioRepositorio.save(usuario);
  }

  // delete method
  async remove(id: string) {
    const usuario = await this.usuarioRepositorio.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`usuario con id ${id} no encontrado`);
    }
    return this.usuarioRepositorio.remove(usuario);
  }

  async buscarUsuarioId(id: string): Promise<any> {
    const usuario = await this.usuarioRepositorio.buscarUsuarioId(id);
    let roles = [];
    if (usuario.usuarioRol.length) {
      roles = usuario.usuarioRol.map((usuarioRol) => {
        if (usuarioRol.estado === ACTIVE) {
          const modulos = usuarioRol.rol.rolModulo.map((m) => {
            if (m.estado === ACTIVE && m.modulo.estado === ACTIVE) {
              return m.modulo;
            }
          });
          return { rol: usuarioRol.rol.rol, modulos };
        }
      });
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

  private async preloadPersonaByNroDocumento(persona: any): Promise<any> {
    const existingPersona = await this.personaRepositorio.findOne({
      nroDocumento: persona.nroDocumento,
    });
    if (existingPersona) {
      return existingPersona;
    }
    const per = this.personaRepositorio.create(persona);
    return this.personaRepositorio.save(per);
  }
}
