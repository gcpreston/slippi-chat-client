// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { SlippiEvent } from '../slippi/types';
import { PhoenixChannelJoinedEvent, PhoenixChannelJoinErrorEvent, PhoenixChannelLeaveEvent } from '../backend/types';

const api = {
  getClientToken: () => ipcRenderer.invoke('get-client-token'),
  setClientToken: (newToken: string | null) => ipcRenderer.send('set-client-token', newToken),

  connectToPhoenix: () => ipcRenderer.send('phoenix-connect'),
  disconnectFromPhoenix: () => ipcRenderer.send('phoenix-disconnect'),
  backendClearBindings: () => ipcRenderer.send('backend-clear-bindings'),
  onPhoenixConnected: (callback: (electronEvent: any, phxEvent: PhoenixChannelJoinedEvent) => void) => ipcRenderer.on('phoenix-connected', callback),
  onPhoenixConnectError: (callback: (electronEvent: any, phxEvent: PhoenixChannelJoinErrorEvent) => void) => ipcRenderer.on('phoenix-connect-error', callback),
  onPhoenixDisconnected: (callback: (electronEvent: any, phxEvent: PhoenixChannelLeaveEvent) => void) => ipcRenderer.on('phoenix-disconnected', callback),

  connectToSlippi: () => ipcRenderer.send('slippi-connect'),
  onSlippiStatusChanged: (callback: (electronEvent: any, slpEvent: SlippiEvent) => void) => ipcRenderer.on('slippi-connection-status-changed', callback),
};

contextBridge.exposeInMainWorld('electron', api);

export type API = typeof api;
