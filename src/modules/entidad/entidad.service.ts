import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadRepositorio } from './entidad.repositorio';
import { Entidad } from './entidad.entity';
import { EntidadDto } from './dto/entidad.dto';
import { ResponseTotalRowsDto } from 'src/common/dto/response-total-rows.dto';
import { responseTotalRows } from '../../common/lib/http.module'

@Injectable()
export class EntidadService {
  constructor(
    @InjectRepository(EntidadRepositorio)
    private entidadRepositorio: EntidadRepositorio,
  ) {}

  async guardar(entidadDto: EntidadDto): Promise<Entidad> {
    const entidad = this.entidadRepositorio.create(entidadDto);
    return this.entidadRepositorio.save(entidad);
  }

  async recuperar(): Promise<ResponseTotalRowsDto> {
    let resultado = await this.entidadRepositorio.findAndCount();
    return responseTotalRows(resultado);
  }

  // update method
  async update(id: string, entidadDto: EntidadDto) {
    const entidad =  await this.entidadRepositorio.preload({ id: +id, ...entidadDto, });
    console.log('asdf eniti ', entidad);
    if(!entidad) {
        throw new NotFoundException(`Entidad con id ${id} no encontrado`)
    } 
    return this.entidadRepositorio.save(entidad);
  }

  // delete method
  async remove(id: string) {
      const entidad = await this.entidadRepositorio.findOne(id);
      return this.entidadRepositorio.remove(entidad);
  }  
}
