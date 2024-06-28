import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ClienteRepository } from '../repository'
import {
  ActualizarClienteDto,
  CrearClienteDto,
  RespuestaCrearClienteDto,
} from '../dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Messages } from '@/common/constants/response-messages'
import { Cliente } from '../entity'

@Injectable()
export class ClienteService extends BaseService {
  constructor(
    @Inject(ClienteRepository)
    private clienteRepositorio: ClienteRepository
  ) {
    super()
  }

  async crear(
    clienteDto: CrearClienteDto,
    usuarioAuditoria: string
  ): Promise<Cliente> {
    const clienteRepetido = await this.clienteRepositorio.buscarCodigo(
      clienteDto.codigo
    )

    if (clienteRepetido) {
      throw new ConflictException(Messages.REPEATED_CLIENT)
    }

    return await this.clienteRepositorio.crear(clienteDto, usuarioAuditoria)
  }

  async listar(
    paginacionQueryDto: PaginacionQueryDto
  ): Promise<[Cliente[], number]> {
    return await this.clienteRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    clienteDto: ActualizarClienteDto,
    usuarioAuditoria: string
  ): Promise<RespuestaCrearClienteDto> {
    const cliente = await this.clienteRepositorio.buscarPorId(id)

    if (!cliente) {
      throw new NotFoundException(Messages.NOT_FOUND_CLIENT)
    }

    await this.clienteRepositorio.actualizar(id, clienteDto, usuarioAuditoria)

    return { id }
  }
}
