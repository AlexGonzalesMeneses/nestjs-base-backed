import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from '../../common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { UsuarioDto } from './dto/usuario.dto';
import { Persona } from '../persona/persona.entity';
import { STATUS_ACTIVE } from '../../common/constants';
import { PersonaRepository } from '../persona/persona.repository';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    private personaRepositorio: PersonaRepository,
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
  // post method
  async crear(usuarioDto: UsuarioDto, usuarioAuditoria: string) {
    const result = await this.usuarioRepositorio.crear(
      usuarioDto,
      usuarioAuditoria,
    );
    return result;
  }

  async activar(idUsuario: string) {
    const usuario = await this.usuarioRepositorio.preload({ id: idUsuario });
    if (usuario && ['CREADO', 'INACTIVO'].includes(usuario.estado)) {
      // TODO: realizar validacion con segip
      usuario.estado = 'ACTIVO';
      const result = await this.usuarioRepositorio.save(usuario);
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
        if (usuarioRol.estado === STATUS_ACTIVE) {
          const modulos = usuarioRol.rol.rolModulo.map((m) => {
            if (
              m.estado === STATUS_ACTIVE &&
              m.modulo.estado === STATUS_ACTIVE
            ) {
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
