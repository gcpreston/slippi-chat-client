// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

const api = {
  getClientToken: () => ipcRenderer.invoke('get-client-token'),
  setClientToken: (newToken: string | null) => ipcRenderer.send('set-client-token', newToken)
};

contextBridge.exposeInMainWorld('electron', api);

export type API = typeof api;
