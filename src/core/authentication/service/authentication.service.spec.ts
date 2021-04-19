import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MensajeriaService } from '../../../core/external-services/mensajeria/mensajeria.service';
import { UsuarioService } from '../../../application/usuario/usuario.service';
import { AuthenticationService } from './authentication.service';
import { RefreshTokensService } from './refreshTokens.service';
import { EntityUnauthorizedException } from '../../../common/exceptions/entity-unauthorized.exception';
import { Configurations } from '../../../common/constants';
import * as dayjs from 'dayjs';

const resSign = 'aaa.bbb.ccc';
const resBuscarUsuario = {
  id: 11111,
  usuario: 'user',
  contrasena:
    'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  estado: 'ACTIVO',
  usuarioRol: [],
  intentos: 0,
};

const refreshToken = { resfresh_token: '1' };

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let usuarioService: UsuarioService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
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
              .mockReturnValueOnce(resBuscarUsuario)
              .mockReturnValueOnce({ ...resBuscarUsuario, estado: 'INACTIVO' })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                intentos: Configurations.WRONG_LOGIN_LIMIT,
              })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                intentos: Configurations.WRONG_LOGIN_LIMIT - 1,
              })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                intentos: Configurations.WRONG_LOGIN_LIMIT,
                fechaBloqueo: dayjs().subtract(2, 'minutes').toDate(),
              }),
            actualizarDatosBloqueo: jest.fn(() => ({})),
            actualizarContadorBloqueos: jest.fn(() => ({})),
          },
        },
        {
          provide: RefreshTokensService,
          useValue: {
            create: jest.fn(() => refreshToken),
            createAccessToken: jest.fn(() => refreshToken),
          },
        },
        {
          provide: MensajeriaService,
          useValue: {
            sendEmail: jest.fn(() => ({ finalizado: true })),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('[autenticar] deberia generar un token de acceso.', async () => {
    const user = {
      usuario: 'user',
      id: '11111',
    };
    const credenciales = await service.autenticarOidc(user);
    // expect(credenciales).toHaveProperty('access_token');
    expect(credenciales?.data?.access_token).toEqual(resSign);
  });

  it('[validarUsuario] deberia validar un usuario exitosamente.', async () => {
    const usuario = await service.validarUsuario('user', '123');

    expect(usuario).toHaveProperty('id');
  });

  it('[validarUsuario] deberia lanzar una excepcion para un usuario con contrasena erronea.', async () => {
    try {
      await service.validarUsuario('user', '1234');
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia lanzar una excepcion para un usuario INACTIVO.', async () => {
    try {
      await service.validarUsuario('user', '123');
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia lanzar una excepcion si excedio el limite de intentos erroneos de inicio de sesion.', async () => {
    try {
      await service.validarUsuario('user', '123');
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia restablecer el limite de intentos si inicio sesion correctamente.', async () => {
    await service.validarUsuario('user', '123');

    expect(usuarioService.actualizarContadorBloqueos).toBeCalled();
  });

  it('[validarUsuario] deberia permitir iniciar sesion si la fecha limite bloqueo ya expiro.', async () => {
    try {
      await service.validarUsuario('user', '1234');
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(usuarioService.actualizarDatosBloqueo).toBeCalled();
      expect(usuarioService.actualizarContadorBloqueos).toBeCalled();
    }
  });
});
