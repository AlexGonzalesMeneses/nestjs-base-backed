import { UsuarioRol } from '../entity/usuario-rol.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { Rol } from '../entity/rol.entity';
import { Status } from '../../../common/constants';

@EntityRepository(UsuarioRol)
export class UsuarioRolRepository extends Repository<UsuarioRol> {
  obtenerRolesPorUsuario(idUsuario: string) {
    return this.createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('usuarioRol.id_usuario = :idUsuario', { idUsuario })
      .getMany();
  }

  activar(idUsuario, roles, usuarioActualizacion) {
    return this.createQueryBuilder()
      .update(UsuarioRol)
      .set({ estado: Status.ACTIVE, usuarioActualizacion })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute();
  }

  inactivar(idUsuario, roles, usuarioActualizacion) {
    return this.createQueryBuilder()
      .update(UsuarioRol)
      .set({ estado: Status.INACTIVE, usuarioActualizacion })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute();
  }

  crear(idUsuario, roles, usuarioAuditoria) {
    const usuarioRoles: UsuarioRol[] = roles.map((idRol) => {
      const usuario = new Usuario();
      usuario.id = idUsuario;

      const rol = new Rol();
      rol.id = idRol;

      const usuarioRol = new UsuarioRol();
      usuarioRol.usuario = usuario;
      usuarioRol.rol = rol;
      usuarioRol.usuarioCreacion = usuarioAuditoria;

      return usuarioRol;
    });

    return this.save(usuarioRoles);
  }
}
