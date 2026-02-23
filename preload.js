const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  setPipMode: (enabled) => ipcRenderer.invoke('set-pip-mode', Boolean(enabled)),
  downloadAndOpenAsset: (payload) => ipcRenderer.invoke('download-and-open-asset', payload),
  isElectron: true,
});
