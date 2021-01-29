import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { UsuarioRepositorio } from './usuario.repositorio';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { TotalRowsResponseDto } from 'src/common/dto/total-rows-response.dto';
import { totalRowsResponse } from 'src/common/lib/http.module';
import { UsuarioDto } from './dto/usuario.dto';
import { Persona } from '../persona/persona.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepositorio)
    private usuarioRepositorio: UsuarioRepositorio,
  ) {}
  // GET USERS  
/*   async recuperar(): Promise<Usuario[]> {
    return this.usuarioRepositorio.recuperar();
  } */
  async recuperar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ): Promise<TotalRowsResponseDto> {
    const { limite, pagina } = paginacionQueryDto;
    const resultado = await this.usuarioRepositorio.findAndCount({
      skip: pagina || 0,
      take: limite || 10,
    });
    return totalRowsResponse(resultado);
  }  

  async buscarUsuario(usuario: string): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuario(usuario);
  }
  // post method 
  async guardar(usuarioDto: UsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepositorio.create(usuarioDto);
    return this.usuarioRepositorio.save(usuario);
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

    const roles = [];
    if (usuario.usuarioRol.length) {
      usuario.usuarioRol.map((usuarioRol) => {
        const modulos = usuarioRol.rol.rolModulo.map((m) => m.modulo);
        roles.push({ rol: usuarioRol.rol.rol, modulos });
      });
    }
    return {
      id: usuario.id,
      usuario: usuario.usuario,
      roles,
    };
  }

  async buscarUsuarioPorCI(persona: Persona): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuarioPorCI(persona);
  }
}
