const { app, BrowserWindow, ipcMain, screen, shell } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');
const os = require('os');

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
    mainWindow.setResizable(true);
    mainWindow.setMinimumSize(260, 260);
    return true;
  }

  mainWindow.setAlwaysOnTop(false);
  mainWindow.setResizable(true);
  if (normalBounds) mainWindow.setBounds(normalBounds);
  normalBounds = null;
  return true;
});

ipcMain.handle('download-and-open-asset', async (_event, { url, fileName }) => {
  if (!url || !fileName) return { ok: false, error: 'Missing asset info' };

  const downloadsDir = path.join(os.homedir(), 'Downloads');
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = path.join(downloadsDir, safeName);

  await new Promise((resolve, reject) => {
    const request = https.get(url, { headers: { 'User-Agent': 'Something-to-Focus-Updater' } }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, { headers: { 'User-Agent': 'Something-to-Focus-Updater' } }, (redirected) => {
          const output = fs.createWriteStream(filePath);
          redirected.pipe(output);
          output.on('finish', () => output.close(resolve));
          output.on('error', reject);
        }).on('error', reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }

      const output = fs.createWriteStream(filePath);
      response.pipe(output);
      output.on('finish', () => output.close(resolve));
      output.on('error', reject);
    });

    request.on('error', reject);
  });

  const openError = await shell.openPath(filePath);
  if (openError) return { ok: false, error: openError };
  return { ok: true, filePath };
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
