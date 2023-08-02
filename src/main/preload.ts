// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

const api = {
  getThing: () => ipcRenderer.invoke('get-thing'),
};

contextBridge.exposeInMainWorld('electron', api);

export type API = typeof api;
