import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadRepositorio } from './entidad.repositorio';
import { Entidad } from './entidad.entity';
import { EntidadDto } from './dto/entidad.dto';

@Injectable()
export class EntidadService {
  constructor(
    @InjectRepository(EntidadRepositorio)
    private entidadRepositorio: EntidadRepositorio,
  ) {}

  async guardar(entidadDto: EntidadDto): Promise<Entidad> {
/*     const { razonSocial, nit, web, descripcion, sigla } = entidadDto;
    const entidad = new Entidad();
    entidad.razonSocial = razonSocial;
    entidad.nit = nit;
    entidad.web = web;
    entidad.descripcion = descripcion;
    entidad.sigla = sigla; */
    console.log('carjo.as ', entidadDto);
    const entidad = this.entidadRepositorio.create(entidadDto);
    return this.entidadRepositorio.save(entidad);
  }

  async recuperar(): Promise<Entidad[]> {
    return this.entidadRepositorio.find();
  }
}
