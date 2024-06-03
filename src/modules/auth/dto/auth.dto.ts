import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export enum flowTypeDto {
  OAUTH = 'oAuth',
  EMAIL = 'email',
  PHONE = 'phone',
}
export class createWalletDto {
  @IsString()
  userKey: string;

  @IsString()
  shard2: string;

  @IsString()
  shard3: string;
}

export class checkWalletDto {
  @IsString()
  userKey: string;

  @IsBoolean()
  shard1Exists: boolean;

  @IsEnum(flowTypeDto, { message: 'Please enter value from enum' })
  type: flowTypeDto;
}

export class sendEmailDto {
  @IsEmail()
  email: string;
}

export class verifyEmailDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  otp: string;
}

export class sendPhoneDto {
  @IsNumberString()
  countryCode: string;

  @IsNumberString()
  phone: string;
}

export class verifyPhoneDto {
  @IsNumberString()
  countryCode: string;

  @IsNumberString()
  phone: string;

  @IsNumberString()
  @Length(6, 6)
  otp: string;
}
