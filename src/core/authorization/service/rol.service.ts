import { Inject, Injectable } from '@nestjs/common';
import { RolRepository } from '../repository/rol.repository';
import { Rol } from '../entity/rol.entity';

@Injectable()
export class RolService {
  constructor(
    @Inject(RolRepository)
    private rolRepositorio: RolRepository,
  ) {}

  async listar(): Promise<Rol[]> {
    return await this.rolRepositorio.listar();
  }
}
