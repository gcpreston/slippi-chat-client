// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

const api = {
  getClientToken: () => ipcRenderer.invoke('get-client-token'),
  setClientToken: (newToken: string | null) => ipcRenderer.send('set-client-token', newToken),

  connectToPhoenix: () => ipcRenderer.send('phoenix-connect'),
  backendClearBindings: () => ipcRenderer.send('backend-clear-bindings'),
  onPhoenixConnected: (callback) => ipcRenderer.on('phoenix-connected', callback),
  onPhoenixConnectError: (callback) => ipcRenderer.on('phoenix-connect-error', callback),

  connectToSlippi: () => ipcRenderer.send('slippi-connect'),
  onSlippiStatusChanged: (callback) => ipcRenderer.on('slippi-connection-status-changed', callback),
};

contextBridge.exposeInMainWorld('electron', api);

export type API = typeof api;
