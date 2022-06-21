import { EntityRepository, Repository } from 'typeorm';
import { Rol } from '../entity/rol.entity';
import { Status } from '../../../common/constants';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {
  async listar() {
    return await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol', 'rol.nombre'])
      .where({ estado: Status.ACTIVE })
      .getMany();
  }

  async buscarPorNombreRol(rol: string) {
    return await this.createQueryBuilder('rol').where({ rol: rol }).getOne();
  }

  async listarRolesPorUsuario(idUsuario: number) {
    return await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol'])
      .where({ estado: Status.ACTIVE, usuarioRol: idUsuario })
      .getMany();
  }
}
