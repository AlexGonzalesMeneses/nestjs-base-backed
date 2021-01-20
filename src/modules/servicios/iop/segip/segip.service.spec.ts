import { Test, TestingModule } from '@nestjs/testing';
import { SegipService } from './segip.service';

describe('SegipService', () => {
  let service: SegipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SegipService],
    }).compile();

    service = module.get<SegipService>(SegipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
