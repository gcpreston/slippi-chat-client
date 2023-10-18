export type MagicGenerateApiResponse = {
  data: {
    magic_token: string;
  }
};

export type MagicVerifyApiResponse = string;

export enum BackendConnectionStatus {
  Connecting = 'CONNECTING',
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
  Error = 'ERROR'
}
