import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from '../../../core/authorization/repository/rol.repository';
import { Rol } from '../../../core/authorization/entity/rol.entity';
@Injectable()
export class RolService {
  constructor(
    @InjectRepository(RolRepository)
    private rolRepositorio: RolRepository,
  ) {}

  async listar(): Promise<Rol[]> {
    const result = await this.rolRepositorio.listar();
    return result;
  }
}
