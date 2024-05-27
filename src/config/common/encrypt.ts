import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';
import { BadRequestException } from '@nestjs/common';

// export const encryptApiKey = (
//   apiKey: string,
//   iv: string,
//   secretKey: string,
// ) => {
//   try {
//     const algorithm = 'aes-256-cbc';
//     const cipher = createCipheriv(algorithm, secretKey, iv);
//     let encrypted = cipher.update(apiKey, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     encrypted = JSON.stringify({
//       encryptedData: encrypted,
//       iv: iv,
//     });
//     return encrypted;
//   } catch (error) {
//     throw error;
//   }
// };

// const isJsonString = (str: string) => {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// };

// export const decryptApiKey = (apiKeyEncrypted: string, secretKey: string) => {
//   try {
//     const algorithm = 'aes-256-cbc';

//     if (isJsonString(apiKeyEncrypted)) {
//       const { encryptedData, iv } = JSON.parse(apiKeyEncrypted);
//       const decipher = createDecipheriv(algorithm, secretKey, iv);
//       let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//       decrypted += decipher.final('utf8');
//       return `${decrypted}.${iv}`;
//     } else {
//       throw new BadRequestException('Invalid key error', {
//         cause: new Error(),
//         description: 'Invalid keyprovided',
//       });
//     }
//   } catch (error) {
//     throw error;
//   }
// };
// ####################################################################################################################################

export const encrypt = (text: string, userKey: string): string => {
  const iv = randomBytes(16);
  const key = scryptSync(userKey, 'salt', 32);
  const cipher = createCipheriv('aes-256-ctr', key, iv);
  const encryptedText = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
};

export const decrypt = (encryptedText: string, userKey: string): string => {
  const [iv, content] = encryptedText
    .split(':')
    .map((part) => Buffer.from(part, 'hex'));
  const key = scryptSync(userKey, 'salt', 32);
  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(content),
    decipher.final(),
  ]);
  return decryptedText.toString('utf8');
};
