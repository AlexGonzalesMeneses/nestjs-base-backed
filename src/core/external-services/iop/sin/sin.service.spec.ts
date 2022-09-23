import { LoggerModule } from '../../../logger/logger.module'
import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { SinService } from './sin.service'

describe('SinService', () => {
  let service: SinService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        SinService,
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<SinService>(SinService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
