import { BadRequestException, Injectable } from '@nestjs/common';
import { createWalletDto } from './dto/auth.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSdk } from 'src/entity/test.entity';
import { Repository } from 'typeorm';
import { encrypt, decrypt } from 'src/config/common/encrypt';
import { generateRandomString } from 'src/config/common/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AuthSdk)
    private readonly authRepository: Repository<AuthSdk>,
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

  checkWalletExists = async (userKey, shard1Exists) => {
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
}
