import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
@Module({
  imports: [],
  controllers: [AuthorizationController],
})
export class AuthorizationModule {}
