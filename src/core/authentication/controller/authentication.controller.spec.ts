import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from '../service/authentication.service';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

const resAutenticar = { access_token: 'aaa.bbb.ccc' };
const resValidarUsuario = { id: '111111', usuario: 'usuario' };

const mockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body,
});

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
            new winston.transports.File({
              filename: process.env.ERROR_LOG_FILE_PATH || 'error.log',
              level: 'error',
            }),
            new winston.transports.Http({}),
          ],
        }),
      ],
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            autenticar: jest.fn(() => resAutenticar),
            validarUsuario: jest.fn(() => resValidarUsuario),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('[login] deberia realizar una autenticacion exitosa.', async () => {
    const req = mockRequest({}, { user: 'boss' });
    const res = mockResponse();
    const response = await controller.login(req, res);
    expect(response).toHaveProperty('access_token');
  });
});
