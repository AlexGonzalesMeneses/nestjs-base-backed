import { Module } from '@nestjs/common';
import { ParametroController } from './parametro.controller';
import { ParametroService } from './parametro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParametroRepositorio } from './parametro.repositorio';

@Module({
  controllers: [ParametroController],
  providers: [ParametroService],
  imports: [TypeOrmModule.forFeature([ParametroRepositorio])],
})
export class ParametroModule {}
