import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { checkWalletDto, createWalletDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('create')
  async createWallet(@Body() input: createWalletDto) {
    return await this.authService.createWallet(input);
  }

  @Post('check')
  async checkWalletExists(@Body() { userKey, shard1Exists }: checkWalletDto) {
    return await this.authService.checkWalletExists(userKey, shard1Exists);
  }
}
