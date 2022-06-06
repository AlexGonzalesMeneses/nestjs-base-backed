import { EntityRepository, Repository } from 'typeorm';
import { Persona } from '../entity/persona.entity';
import { PersonaDto } from '../dto/persona.dto';
import { Status } from '../../../common/constants';

@EntityRepository(Persona)
export class PersonaRepository extends Repository<Persona> {
  buscarPersonaPorCI(persona: PersonaDto) {
    return this.createQueryBuilder('persona')
      .where('persona.nro_documento = :ci', { ci: persona.nroDocumento })
      .getOne();
  }

  buscarPersonaPorDocumento(tipoDocumento: string, numeroDocumento: string) {
    return this.createQueryBuilder('p')
      .where('p.nro_documento = :numeroDocumento', { numeroDocumento })
      .andWhere('p.tipo_documento = :tipoDocumento', { tipoDocumento })
      .andWhere('p.estado = :estado', { estado: Status.ACTIVE })
      .getOne();
  }
}
