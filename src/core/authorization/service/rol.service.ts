import { LoggerService } from '../../logger/logger.service'
import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { RolRepository } from '../repository/rol.repository'
import { Rol } from '../entity/rol.entity'

@Injectable()
export class RolService extends BaseService {
  constructor(
    protected logger: LoggerService,
    @Inject(RolRepository)
    private rolRepositorio: RolRepository
  ) {
    super(logger, RolService.name)
  }

  async listar(): Promise<Rol[]> {
    return await this.rolRepositorio.listar()
  }
}
