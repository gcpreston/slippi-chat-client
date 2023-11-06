export type MagicGenerateApiResponse = {
  data: {
    magic_token: string;
  }
};

export type MagicVerifyApiResponse = string;

export enum BackendConnectionStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}
