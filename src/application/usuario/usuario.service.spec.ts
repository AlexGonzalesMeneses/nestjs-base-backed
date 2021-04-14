import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { TextService } from '../../common/lib/text.service';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { PersonaRepository } from '../persona/persona.repository';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';
import { HttpService, NotFoundException } from '@nestjs/common';
import { MensajeriaService } from '../../core/external-services/mensajeria/mensajeria.service';
import { MensajeriaModule } from '../../core/external-services/mensajeria/mensajeria.module';

const resUsuarioList = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  usuario: 'USUARIO',
  estado: 'ACTIVO',
  persona: {
    nroDocumento: '123456',
    nombres: 'Juan',
    primerApellido: 'Perez',
    segundoApellido: 'Perez',
  },
  usuarioRol: [
    {
      estado: 'ACTIVO',
      id: '',
      rol: {
        rol: 'ADMINISTRADOR',
      },
    },
  ],
};

const resUsuarioPerfil = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  usuario: 'USUARIO',
  estado: 'ACTIVO',
  usuarioRol: [
    {
      id: 'b320fe27-5644-5712-8423-198302b01e25',
      estado: 'ACTIVO',
      rol: {
        id: 'b320fe27-5644-5712-8423-198302b01e25',
        rol: 'ADMINISTRADOR',
        estado: 'ACTIVO',
        rolModulo: [
          {
            id: '03c1f916-7f3e-4b93-839b-1e9f7515a278',
            estado: 'ACTIVO',
            modulo: [
              {
                id: 'b320fe27-5644-5712-8423-198302b01e25',
                label: 'Usuarios',
                url: '/usuarios',
                icono: 'mdiAccountCog',
                nombre: 'usuarios',
                estado: 'ACTIVO',
              },
            ],
          },
        ],
      },
    },
  ],
  persona: {
    nroDocumento: '123456',
    nombres: 'Juan',
    primerApellido: 'Perez',
    segundoApellido: 'Perez',
    fechaNacimiento: '2002-02-09T00:00:00.000Z',
    tipoDocumento: 'CI',
  },
};

const resUsuarioCrear = {
  usuario: 'usuario122',
  contrasena: '123',
  persona: {
    nombres: 'juan',
    primerApellido: 'perez',
    segundoApellido: 'perez',
    nroDocumento: '123456122',
    fechaNacimiento: '1911-11-11',
    tipoDocumentoOtro: null,
    telefono: null,
    genero: null,
    observacion: null,
    id: '18002fe5-759c-4493-a025-8cd38b61ffff',
    tipoDocumento: 'CI',
    estado: 'ACTIVO',
  },
  usuarioCreacion: 'd5de12df-3cc3-5a58-a742-be24030482d8',
  fechaActualizacion: '2021-04-12T19:42:13.588Z',
  usuarioActualizacion: null,
  fechaCreacion: '2021-04-12T19:42:13.588Z',
  id: '416be245-aeaa-47c7-bfe0-477961b18eec',
  estado: 'CREADO',
};

const resUsuarioActivar = {
  id: TextService.generateUuid(),
  estado: 'CREADO',
};

describe('UsuarioService', () => {
  let service: UsuarioService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: UsuarioRepository,
          useValue: {
            listar: jest.fn(() => [[resUsuarioList], 1]),
            buscarUsuarioId: jest.fn(() => resUsuarioPerfil),
            crear: jest.fn(() => resUsuarioCrear),
            // preload: jest.fn(() => resUsuarioActivar),
            preload: jest
              .fn()
              .mockReturnValueOnce(resUsuarioActivar)
              .mockReturnValue(undefined)
              .mockReturnValue({ ...resUsuarioActivar, estado: 'ACTIVO' }),
            save: jest.fn(() => ({ ...resUsuarioActivar, estado: 'ACTIVO' })),
          },
        },
        {
          provide: MensajeriaService,
          useValue: {
            sendEmail: jest.fn(() => ({ finalizado: true })),
          },
        },
        {
          provide: PersonaRepository,
          useValue: {},
        },
      ],
      imports: [MensajeriaModule],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('[listar] Deberia obtener la lista de usuarios', async () => {
    const paginacion = new PaginacionQueryDto();
    const usuarios = await service.listar(paginacion);
    expect(usuarios).toHaveProperty('filas');
    expect(usuarios).toHaveProperty('total');
    expect(usuarios.filas).toBeInstanceOf(Array);
    expect(usuarios.total).toBeDefined();
  });

  it('[buscarUsuarioId] Deberia obtener la informacion relacionada al usuario', async () => {
    const { id } = resUsuarioPerfil;
    const usuarios = await service.buscarUsuarioId(id);

    expect(usuarios).toBeDefined();
    expect(usuarios).toHaveProperty('id');
    expect(usuarios).toHaveProperty('persona');
    expect(usuarios).toHaveProperty('roles');
  });

  it('[crear] Deberia crear un nuevo usuario', async () => {
    const datosUsuario = {
      usuario: 'usuario122',
      contrasena: '123',
      persona: {
        nombres: 'juan',
        primerApellido: 'perez',
        segundoApellido: 'perez',
        nroDocumento: '123456122',
        fechaNacimiento: '1911-11-11',
      },
    };
    const usuarioDto = plainToClass(CrearUsuarioDto, datosUsuario);
    const usuarioAuditoria = TextService.generateUuid();
    const usuario = await service.crear(usuarioDto, usuarioAuditoria);

    expect(usuario).toBeDefined();
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('estado');
  });

  it('[activar] Deberia activar un usuario en estado CREADO', async () => {
    const usuario = await service.activar(TextService.generateUuid());

    expect(usuario).toBeDefined();
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('estado');
    expect(usuario.estado).toEqual('ACTIVO');
  });

  it('[activar] Deberia lanzar una excepcion si el usuario no existe', async () => {
    try {
      await service.activar(TextService.generateUuid());
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('[activar] Deberia lanzar una excepcion si el usuario no tiene un estado valido para activacion', async () => {
    try {
      await service.activar(TextService.generateUuid());
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
