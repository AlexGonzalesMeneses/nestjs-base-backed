import { Module, HttpModule } from '@nestjs/common';
import { SegipService } from './segip.service';
import { SegipController } from './segip.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('IOP_SEGIP_URL'),
        headers: {
          authorization: `Bearer ${configService.get('IOP_SEGIP_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [SegipService],
  controllers: [SegipController],
})
export class SegipModule {}
