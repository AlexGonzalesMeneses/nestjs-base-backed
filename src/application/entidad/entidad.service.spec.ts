import { Test, TestingModule } from '@nestjs/testing';
import { Status } from '../../common/constants';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { EntidadRepository } from './entidad.repository';
import { EntidadService } from './entidad.service';

const resEntidad = {
  razonSocial: 'Ministerio Fake',
  descripcion: 'Ministerio Fake',
  nit: '121212',
  estado: Status.ACTIVE,
};

describe('EntidadService', () => {
  let service: EntidadService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntidadService,
        {
          provide: EntidadRepository,
          useValue: {
            listar: jest.fn(() => [[resEntidad], 1]),
          },
        },
      ],
    }).compile();

    service = module.get<EntidadService>(EntidadService);
  });

  it('[listar] Deberia obtener la lista de entidades', async () => {
    const paginacion = new PaginacionQueryDto();
    const entidades = await service.listar(paginacion);

    expect(entidades).toBeDefined();
    expect(entidades).toHaveProperty('filas');
    expect(entidades).toHaveProperty('total');
    expect(entidades.filas).toBeInstanceOf(Array);
    expect(entidades.total).toBeDefined();
  });
});
