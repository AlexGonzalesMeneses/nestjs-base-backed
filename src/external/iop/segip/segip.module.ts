import { Module, HttpModule } from '@nestjs/common';
import { SegipService } from './segip.service';
import { SegipController } from './segip.controller';

@Module({
  imports: [HttpModule],
  providers: [SegipService],
  controllers: [SegipController]
})
export class SegipModule {}
