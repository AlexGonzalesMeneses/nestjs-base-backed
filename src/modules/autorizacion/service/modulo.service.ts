import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuloRepository } from '../repository/modulo.repository';
import { Modulo } from '../entity/modulo.entity';
@Injectable() 
export class ModuloService {
  constructor(
    @InjectRepository(ModuloRepository)
    private moduloRepositorio: ModuloRepository,
  ) {}

  async recuperar(): Promise<Modulo[]> {
    return this.moduloRepositorio.find();
  }
}
