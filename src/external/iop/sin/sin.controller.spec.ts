import { Test, TestingModule } from '@nestjs/testing';
import { SinController } from './sin.controller';

describe('SinController', () => {
  let controller: SinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinController],
    }).compile();

    controller = module.get<SinController>(SinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
