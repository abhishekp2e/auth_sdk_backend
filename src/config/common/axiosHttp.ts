import axios from 'axios';

/**
 * Function to make a dynamic Axios request
 * @param {string} url - The URL for the request
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {object} headers - The headers to include in the request
 * @param {object} data - The data to send with the request (for POST, PUT, etc.)
 * @returns {Promise} - Returns a promise that resolves to the response or rejects with an error
 */
export async function makeRequest(
  url: string,
  method: string,
  headers = {},
  data = {},
) {
  try {
    const config = {
      url: url,
      method: method,
      headers: headers,
      data: data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
}

export async function sendEmail(email: string, otp: string) {
  try {
    const url = `${process.env.EMAIL_URL}/send/email`;
    const data = {
      emailTo: email,
      emailFrom: 'auth@p2eppl.com',
      subject: 'Verify OTP',
      message: `OTP to verify email ${email} is ${otp}`,
      category: 'auth_related',
      emailType: 'transactional',
    };
    const headers = {
      emailauthkey: process.env.EMAIL_API_KEY,
      'Content-Type': 'application/json',
    };

    const status = await makeRequest(url, 'post', headers, data);
    if (status) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

export async function sendPhone(
  countryCode: string,
  phone: string,
  otp: string,
) {
  try {
    const url = `${process.env.SMS_URL}`;
    const data = {
      to: phone,
      countryCode: `+${countryCode}`,
      message: `Hello user,\n\nYour OTP for secure access to KALP Auth is: ${otp}.\n\nPlease enter this code within the next 5 minutes.\n\nThank you,\nKALP Auth`,
      category: 'authenticate',
      smsType: 'transactional',
    };
    const headers = {
      servicename: process.env.SMS_SERVICE_NAME,
      smsauthkey: process.env.SMS_AUTH_KEY,
    };
    const status = await makeRequest(url, 'post', headers, data);
    if (status) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
