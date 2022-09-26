// import { DataSource } from 'typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { LoggerService } from '../../core/logger/logger.service'

export class BaseRepository {
  protected logger = LoggerService.getInstance(BaseRepository.name)

  constructor(context: string, protected datasource: DataSource) {
    this.logger.setContext(context)
  }

  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.datasource.manager.transaction<T>(op)
  }
}
