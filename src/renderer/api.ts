import { MagicGenerateApiResponse, MagicVerifyApiResponse } from './types';
import { baseHTTP } from '../utils';

export const generateMagicToken = async (clientToken: string): Promise<MagicGenerateApiResponse> => (
  fetch(`${baseHTTP}/magic_generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
);

export const magicVerify = async (clientToken: string, verificationCode: string): Promise<MagicVerifyApiResponse> => (
  fetch(`${baseHTTP}/magic_verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ verification_code: verificationCode })
  })
    .then((response) => response.json())
);
