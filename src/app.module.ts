import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './config/database/postgres.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), PostgresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
