import { MagicGenerateApiResponse, MagicVerifyApiResponse } from './types';

const HOST = 'http://localhost:4000';

export const generateMagicToken = async (clientToken: string): Promise<MagicGenerateApiResponse> => (
  fetch(`${HOST}/magic_generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
);

export const magicVerify = async (clientToken: string, verificationCode: string): Promise<MagicVerifyApiResponse> => (
  fetch(`${HOST}/magic_verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ verification_code: verificationCode })
  })
    .then((response) => response.json())
);
