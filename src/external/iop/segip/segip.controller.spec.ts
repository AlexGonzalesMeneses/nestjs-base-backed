import { Test, TestingModule } from '@nestjs/testing';
import { SegipController } from './segip.controller';

describe('SegipController', () => {
  let controller: SegipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SegipController],
    }).compile();

    controller = module.get<SegipController>(SegipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
