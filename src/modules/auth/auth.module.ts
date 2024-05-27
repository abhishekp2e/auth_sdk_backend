import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSdk } from 'src/entity/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthSdk])],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
