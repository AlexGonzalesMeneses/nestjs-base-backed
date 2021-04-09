import { Test, TestingModule } from '@nestjs/testing';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { PersonaRepository } from '../persona/persona.repository';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';

const resUsuario = {
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

describe('UsuarioService', () => {
  let service: UsuarioService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: UsuarioRepository,
          useValue: {
            listar: jest.fn(() => [[resUsuario], 1]),
            buscarUsuarioId: jest.fn(() => resUsuarioPerfil),
          },
        },
        {
          provide: PersonaRepository,
          useValue: {},
        },
      ],
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
});
