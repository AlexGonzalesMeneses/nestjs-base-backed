import { Module, HttpModule } from '@nestjs/common';
import { SinService } from './sin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('IOP_SIN_URL'),
        headers: {
          authorization: `Bearer ${configService.get('IOP_SIN_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [SinService],
})
export class SinModule {}
