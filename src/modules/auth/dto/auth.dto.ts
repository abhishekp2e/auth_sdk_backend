import { IsBoolean, IsString } from 'class-validator';

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
}
