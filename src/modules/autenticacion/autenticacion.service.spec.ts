import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario/usuario.service';
import { AutenticacionService } from './autenticacion.service';

const resSign = 'aaa.bbb.ccc';
const resBuscarUsuario = {
  id: 11111,
  usuario: 'user',
  contrasena:
    'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  estado: 'ACTIVO',
};

describe('AutenticacionService', () => {
  let service: AutenticacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticacionService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => resSign),
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            buscarUsuario: jest
              .fn()
              .mockReturnValueOnce(resBuscarUsuario)
              .mockReturnValueOnce({ ...resBuscarUsuario, estado: 'INACTIVO' }),
          },
        },
      ],
    }).compile();

    service = module.get<AutenticacionService>(AutenticacionService);
  });

  it('[autenticar] deberia generar un token de acceso.', async () => {
    const user = {
      usuario: 'user',
      id: '11111',
    };
    const credenciales = await service.autenticar(user);
    expect(credenciales).toHaveProperty('access_token');
  });

  it('[validarUsuario] deberia validar un usuario exitosamente.', async () => {
    const usuario = await service.validarUsuario('user', '123');
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('usuario');
  });

  it('[validarUsuario] deberia lanzar una excepcion para un usuario con contrasena erronea.', async () => {
    try {
      await service.validarUsuario('user', '1234');
    } catch (error) {
      expect(error instanceof HttpException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia lanzar una excepcion para un usuario INACTIVO.', async () => {
    try {
      await service.validarUsuario('user', '123');
    } catch (error) {
      expect(error instanceof HttpException);
      expect(error.status).toEqual(401);
    }
  });
});
