import { Test, TestingModule } from '@nestjs/testing';
import { SinController } from './sin.controller';
import { SinService } from './sin.service';

describe('SinController', () => {
  let controller: SinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinController],
      providers: [
        {
          provide: SinService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SinController>(SinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
