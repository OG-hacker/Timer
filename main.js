const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let normalBounds = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 920,
    minWidth: 700,
    minHeight: 520,
    backgroundColor: '#0b1020',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('set-pip-mode', (_event, enabled) => {
  if (!mainWindow || mainWindow.isDestroyed()) return false;

  if (enabled) {
    if (!normalBounds) normalBounds = mainWindow.getBounds();

    const area = screen.getPrimaryDisplay().workArea;
    const width = 420;
    const height = 520;
    const x = area.x + area.width - width - 24;
    const y = area.y + area.height - height - 24;

    if (mainWindow.isFullScreen()) mainWindow.setFullScreen(false);
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setBounds({ x, y, width, height });
    mainWindow.setResizable(false);
    return true;
  }

  mainWindow.setAlwaysOnTop(false);
  mainWindow.setResizable(true);
  if (normalBounds) mainWindow.setBounds(normalBounds);
  normalBounds = null;
  return true;
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
