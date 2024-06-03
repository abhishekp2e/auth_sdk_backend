import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  checkWalletDto,
  createWalletDto,
  sendEmailDto,
  sendPhoneDto,
  verifyEmailDto,
  verifyPhoneDto,
} from './dto/auth.dto';

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

  @Post('email/send')
  async sendEmail(@Body() { email }: sendEmailDto) {
    return await this.authService.sendEmail(email);
  }

  @Post('email/verify')
  async veifyEmail(@Body() { email, otp }: verifyEmailDto) {
    return await this.authService.verifyEmail(email, otp);
  }

  @Post('phone/send')
  async sendPhone(@Body() { countryCode, phone }: sendPhoneDto) {
    return await this.authService.sendPhone(countryCode, phone);
  }

  @Post('phone/verify')
  async verifyPhone(@Body() { countryCode, phone, otp }: verifyPhoneDto) {
    return await this.authService.verifyPhone(countryCode, phone, otp);
  }
}
