import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParametroRepositorio } from './parametro.repositorio';
import { Parametro } from './parametro.entity';
import { ParametroDto } from './dto/parametro.dto';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroRepositorio)
    private parametroRepositorio: ParametroRepositorio,
  ) {}

  async guardar(parametroDto: ParametroDto): Promise<Parametro> {
    const { codigo, nombre, grupo, descripcion } = parametroDto;
    const parametro = new Parametro();
    parametro.codigo = codigo;
    parametro.nombre = nombre;
    parametro.grupo = grupo;
    parametro.descripcion = descripcion;
    const parametroCreado = await this.parametroRepositorio.save(parametro);
    return parametroCreado;
  }

  async recuperar(): Promise<Parametro[]> {
    return this.parametroRepositorio.find();
  }
}
