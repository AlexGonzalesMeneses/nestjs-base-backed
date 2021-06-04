import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { AuthZManagementService } from 'nest-authz';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { TextService } from '../../common/lib/text.service';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { ParametroController } from './parametro.controller';
import { ParametroService } from './parametro.service';

const resParametro = {
  id: TextService.generateUuid(),
  codigo: 'TD-CI',
  nombre: 'Cedula de identidad',
  grupo: 'TD',
};

const resListar = [1, resParametro];

describe('ParametroController', () => {
  let controller: ParametroController;
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ParametroController],
      providers: [
        {
          provide: ParametroService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resParametro]),
            crear: jest.fn(() => resParametro),
          },
        },
        {
          provide: AuthZManagementService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(CasbinGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<ParametroController>(ParametroController);
  });

  it('[listar] Deberia listar parametros', async () => {
    const pagination = new PaginacionQueryDto();
    const result = await controller.listar(pagination);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result).toHaveProperty('mensaje');
    expect(result).toHaveProperty('datos');
    expect(result.datos).toHaveProperty('total');
    expect(result.datos).toHaveProperty('filas');
  });

  it('[listarPorGrupo] Deberia listar parametros por grupo', async () => {
    const mockRequest = {
      grupo: 'TD',
    };
    const result = await controller.listarPorGrupo(mockRequest);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result).toHaveProperty('mensaje');
    expect(result).toHaveProperty('datos');
    expect(result.datos).toBeInstanceOf(Array);
  });

  it('[crear] Deberia crear un nuevo parametro', async () => {
    const parametro = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      grupo: 'TD',
      descripcion: 'Pasaporte',
    };
    const parametroDto = plainToClass(CrearParametroDto, parametro);
    const result = await controller.crear(parametroDto);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result).toHaveProperty('mensaje');
    expect(result).toHaveProperty('datos');
    expect(result.datos).toHaveProperty('id');
  });
});
