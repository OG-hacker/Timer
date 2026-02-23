const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  setPipMode: (enabled) => ipcRenderer.invoke('set-pip-mode', Boolean(enabled)),
  isElectron: true,
});
