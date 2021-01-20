import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadRepositorio } from 'src/modules/entidad/entidad.repositorio';
import { Entidad } from 'src/modules/entidad/entidad.entity';
import { EntidadDto } from 'src/modules/entidad/dto/entidad.dto';

@Injectable()
export class EntidadService {
  async guardarEntidad(entidadDto: EntidadDto): Promise<Entidad> {
    const { razonSocial, nit, web, descripcion, sigla } = entidadDto;
    const entidad = new Entidad();
    entidad.razonSocial = razonSocial;
    entidad.nit = nit;
    entidad.web = web;
    entidad.descripcion = descripcion;
    entidad.sigla = sigla;
    const entidadCreada = await this.entidadRepositorio.save(entidad);
    return entidadCreada;
  }
  constructor(
    @InjectRepository(EntidadRepositorio)
    private entidadRepositorio: EntidadRepositorio
  ) {}
  async recuperarEntidades(): Promise<Entidad[]> {
    return this.entidadRepositorio.find();
  }
}
