import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from '../repository/rol.repository';
import { Rol } from '../entity/rol.entity';
@Injectable()
export class RolService {
  constructor(
    @InjectRepository(RolRepository)
    private rolRepositorio: RolRepository,
  ) {}

  async recuperar(): Promise<Rol[]> {
    return this.rolRepositorio.find();
  }
}
