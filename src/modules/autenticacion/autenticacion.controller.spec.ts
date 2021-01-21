import { Test, TestingModule } from '@nestjs/testing';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';

const resAutenticar = { access_token: 'aaa.bbb.ccc' };
const resValidarUsuario = { id: '111111', usuario: 'usuario' };

describe('AutenticationController', () => {
  let controller: AutenticacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutenticacionController],
      providers: [
        {
          provide: AutenticacionService,
          useValue: {
            autenticar: jest.fn(() => resAutenticar),
            validarUsuario: jest.fn(() => resValidarUsuario),
          },
        },
      ],
    }).compile();

    controller = module.get<AutenticacionController>(AutenticacionController);
  });

  it('[login] deberia realizar una autenticacion exitosa.', async () => {
    const response = await controller.login(resValidarUsuario);
    expect(response).toHaveProperty('access_token');
  });
});
