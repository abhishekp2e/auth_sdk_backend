import { BadRequestException, Injectable } from '@nestjs/common';
import { createWalletDto, flowTypeDto } from './dto/auth.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSdk } from 'src/entity/test.entity';
import { LessThan, Repository } from 'typeorm';
import { encrypt, decrypt } from 'src/config/common/encrypt';
import {
  generateOtp,
  generateRandomString,
  validatePhoneNumber,
} from 'src/config/common/common';
import { sendEmail, sendPhone } from 'src/config/common/axiosHttp';
import { EmailOtp } from 'src/entity/email.otp';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AuthSdk)
    private readonly authRepository: Repository<AuthSdk>,
    @InjectRepository(EmailOtp)
    private readonly emailOtpModule: Repository<EmailOtp>,
  ) {}

  createWallet = async (input: createWalletDto) => {
    try {
      const hashedUserKey = this.hashKey(input.userKey);
      // Check if hashed key does not already exists
      const isKeyExists = await this.checkKeyExists(hashedUserKey);
      if (isKeyExists) {
        return {
          status: {
            success: false,
            message: 'wallet with given identifier already exists',
          },
        };
      } else {
        const encryptedShard2 = this.encrypt(
          input.shard2,
          await this.configService.get('SHARD_ENCRYPTION_KEY'),
        );
        const encryptedShard3 = this.encrypt(input.shard3, input.userKey);
        const newAuthData = this.authRepository.create({
          userKey: hashedUserKey,
          shard2: encryptedShard2,
          shard3: encryptedShard3,
        });
        await this.authRepository.save(newAuthData);
        return { status: { success: true } };
      }
    } catch (error) {
      console.log('🚀 ~ AuthService ~ createWal ~ error:', error);
      return { status: { success: false } };
    }
  };

  checkKeyExists = async (hashedUserkey: string) => {
    try {
      const foundData = await this.authRepository.findOne({
        where: { userKey: hashedUserkey },
      });
      if (foundData) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  checkWalletExists = async (userKey: string, shard1Exists: boolean) => {
    try {
      const hashedUserKey = this.hashKey(userKey);
      const foundData = await this.authRepository.findOne({
        where: { userKey: hashedUserKey },
      });
      if (!foundData) {
        return { status: { success: false } };
      }
      const decryptedShard2 = this.decrypt(
        foundData.shard2,
        await this.configService.get('SHARD_ENCRYPTION_KEY'),
      );
      if (shard1Exists) {
        return { status: { success: true, shard2: decryptedShard2 } };
      } else {
        const decryptedShard3 = this.decrypt(foundData.shard3, userKey);
        return {
          status: {
            success: true,
            shard2: decryptedShard2,
            shard3: decryptedShard3,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  };

  encrypt = (shard3: string, userKey: string) => {
    try {
      const iv = generateRandomString(16); // Initialization Vector
      const encrypted = encrypt(shard3, userKey);
      return encrypted;
    } catch (error) {
      throw error;
    }
  };

  decrypt = (encryptedShard3: string, userKey: string) => {
    try {
      const decrypted = decrypt(encryptedShard3, userKey);
      return decrypted;
    } catch (error) {
      throw error;
    }
  };
  hashKey = (key: string) => {
    try {
      return crypto
        .createHmac('sha256', this.configService.getOrThrow('SECRET_KEY'))
        .update(key)
        .digest('hex');
    } catch (error) {
      throw error;
    }
  };

  sendEmail = async (email: string) => {
    try {
      const hashedEmail = this.hashKey(email);
      const otp = generateOtp(6);
      const newOtpData = this.emailOtpModule.create({
        hashedKey: hashedEmail,
        otp,
      });

      await this.emailOtpModule.save(newOtpData);
      //  send OTP
      await sendEmail(email, otp);
      return { status: { success: true, message: 'EMail OTP is sent' } };
    } catch (error) {
      throw error;
    }
  };

  verifyEmail = async (email: string, otp: string) => {
    try {
      const hashedEmail = this.hashKey(email);
      const foundOTP = await this.emailOtpModule.find({
        where: { hashedKey: hashedEmail, otp },
      });
      if (foundOTP) {
        return { status: { success: true, message: 'Email OTP is verified' } };
      } else {
        return { status: { success: false, message: 'Envalid email OTP' } };
      }
    } catch (error) {
      throw error;
    }
  };

  sendPhone = async (countryCode: string, phone: string) => {
    try {
      const phoneKey = `${countryCode}${phone}`;
      const isValid = validatePhoneNumber(phoneKey);
      if (!isValid) {
        return {
          status: {
            success: false,
            message: 'Please enter a valid phone number',
          },
        };
      }
      const hashedPhone = this.hashKey(phoneKey);
      const otp = generateOtp(6);
      const newOtpData = this.emailOtpModule.create({
        hashedKey: hashedPhone,
        otp,
      });

      await this.emailOtpModule.save(newOtpData);
      //  send OTP
      await sendPhone(countryCode, phone, otp);
      return { status: { success: true, message: 'Phone OTP is sent' } };
    } catch (error) {
      throw error;
    }
  };

  verifyPhone = async (countryCode: string, phone: string, otp: string) => {
    try {
      const phoneKey = `${countryCode}${phone}`;
      const hashedEmail = this.hashKey(phoneKey);
      const foundOTP = await this.emailOtpModule.find({
        where: { hashedKey: hashedEmail, otp },
      });
      if (foundOTP) {
        return { status: { success: true, message: 'Phone OTP is verified' } };
      } else {
        return { status: { success: false, message: 'Envalid email OTP' } };
      }
    } catch (error) {
      throw error;
    }
  };
}
