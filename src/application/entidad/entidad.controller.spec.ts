import { Test, TestingModule } from '@nestjs/testing';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { TextService } from '../../common/lib/text.service';
import { EntidadController } from './entidad.controller';
import { EntidadService } from './entidad.service';

const resParametro = {
  id: TextService.generateUuid(),
  codigo: 'TD-CI',
  nombre: 'Cedula de identidad',
  grupo: 'TD',
};

const resListar = {
  total: 1,
  filas: [resParametro],
};
describe('EntidadController', () => {
  let controller: EntidadController;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [EntidadController],
      providers: [
        {
          provide: EntidadService,
          useValue: {
            listar: jest.fn(() => resListar),
          },
        },
      ],
    }).compile();

    controller = module.get<EntidadController>(EntidadController);
  });

  it('[listar] Deberia listar entidades', async () => {
    const pagination = new PaginacionQueryDto();
    const result = await controller.listar(pagination);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result).toHaveProperty('mensaje');
    expect(result).toHaveProperty('datos');
    expect(result.datos).toHaveProperty('total');
    expect(result.datos).toHaveProperty('filas');
  });
});
