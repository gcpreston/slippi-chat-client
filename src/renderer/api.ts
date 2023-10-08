import { MagicGenerateApiResponse } from './types';

export const generateMagicToken = async (clientToken: string): Promise<MagicGenerateApiResponse> => (
  fetch('http://localhost:4000/magic_generate', {
    method: 'POST',
    headers: {
      // 'Access-Control-Allow-Origin': 'http://localhost:4000',
      'Authorization': `Bearer ${clientToken}`,
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
);
