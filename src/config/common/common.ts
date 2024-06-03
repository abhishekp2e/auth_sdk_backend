import { PhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export const generateOtp = (length: number): string => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  console.log({ OTP });
  return OTP;
};

export const validatePhoneNumber = async (
  phoneNumber: string,
): Promise<PhoneNumber | false> => {
  try {
    const phoneData = parsePhoneNumber(`+${phoneNumber}`);
    if (phoneData.isValid()) {
      return phoneData;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
