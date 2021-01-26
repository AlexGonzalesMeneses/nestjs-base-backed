import { Test, TestingModule } from '@nestjs/testing';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const resAutenticar = { access_token: 'aaa.bbb.ccc' };
const resValidarUsuario = { id: '111111', usuario: 'usuario' };

describe('AutenticationController', () => {
  let controller: AutenticacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console({format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike(),),}),
            new winston.transports.File({ filename: process.env.ERROR_LOG_FILE_PATH || 'error.log', level: 'error' }),
            new winston.transports.Http({ }),
          ],
        })
      ],
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
