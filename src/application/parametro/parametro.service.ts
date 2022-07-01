import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParametroRepository } from './parametro.repository';
import { Parametro } from './parametro.entity';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../common/constants/response-messages';
import { ActualizarParametroDto } from './dto/actualizar-parametro.dto';
import { Status } from '../../common/constants';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroRepository)
    private parametroRepositorio: ParametroRepository,
  ) {}

  async crear(parametroDto: CrearParametroDto): Promise<Parametro> {
    return await this.parametroRepositorio.crear(parametroDto);
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.parametroRepositorio.listar(paginacionQueryDto);
  }

  async listarPorGrupo(grupo: string) {
    return await this.parametroRepositorio.listarPorGrupo(grupo);
  }

  async actualizarDatos(id: string, parametroDto: ActualizarParametroDto) {
    const parametro = await this.parametroRepositorio.findOne(id);
    if (parametro) {
      await this.parametroRepositorio.update(id, parametroDto);
      return { id };
    }
    throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT);
  }

  async activar(idParametro) {
    const parametro = await this.parametroRepositorio.findOne(idParametro);
    if (parametro) {
      const parametroDto = new ActualizarParametroDto();
      parametroDto.estado = Status.ACTIVE;
      await this.parametroRepositorio.update(idParametro, parametroDto);
      return {
        id: idParametro,
        estado: parametroDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT);
  }

  async inactivar(idParametro) {
    const parametro = await this.parametroRepositorio.findOne(idParametro);
    if (parametro) {
      const parametroDto = new ActualizarParametroDto();
      parametroDto.estado = Status.INACTIVE;
      await this.parametroRepositorio.update(idParametro, parametroDto);
      return {
        id: idParametro,
        estado: parametroDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT);
  }
}
