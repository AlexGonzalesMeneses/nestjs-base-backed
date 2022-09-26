import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { RolRepository } from '../repository/rol.repository'
import { Rol } from '../entity/rol.entity'

@Injectable()
export class RolService extends BaseService {
  constructor(
    @Inject(RolRepository)
    private rolRepositorio: RolRepository
  ) {
    super(RolService.name)
  }

  async listar(): Promise<Rol[]> {
    return await this.rolRepositorio.listar()
  }
}
