import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClienteController } from './controller'
import { ClienteService } from './service'
import { ClienteRepository } from './repository'
import { Cliente } from './entity'

@Module({
  controllers: [ClienteController],
  providers: [ClienteService, ClienteRepository],
  imports: [TypeOrmModule.forFeature([Cliente])],
})
export class FacturaModule {}
