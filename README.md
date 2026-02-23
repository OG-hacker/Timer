# Something to Focus (Build v5.9.0)

## What changed in this build

- Simplified PiP entry points to reduce clutter (primary PiP action in the main header).
- PiP window is now **resizable** in desktop mode, so you can drag edges/corners to any comfortable size.
- Cleaned Focus overlay controls during PiP (hide duplicate fullscreen exit control).
- Improved updater asset selection to support real Windows build artifacts beyond only portable exe names:
  - prefers `.exe`, then `.msi`, then `.msix/.appx`, then `.zip/.7z`
  - if no Windows asset is found, it opens the latest Releases page automatically

## How to enable PiP mode

1. Open the desktop app (Electron build).
2. Go to the app screen (`Start Focusing`).
3. Click **PiP Focus** in the header.
4. Resize the PiP window by dragging its edges/corners.
5. To exit PiP, click **Exit PiP** in Focus View.

> Note: PiP corner + always-on-top behavior works in the desktop app, not a normal browser tab.

## In-app updater requirements

Your GitHub Release should include at least one Windows build asset (`.exe`, `.msi`, `.msix/.appx`, or zipped Windows build).

If no Windows build asset is found, the app will open the latest Releases page for manual download.

## Stale build troubleshooting

1. Confirm badge shows **Build v5.9.0**.
2. In Settings > Updates, click **Reset Local Data** if needed.
3. Close old app instances.
4. Run newest exe from `dist/` or Downloads.

## Version sync safety

- `package.json` is now the source of truth for the build version.
- Run `npm run sync:version` to sync `app.js` + `README.md` to the package version.
- `npm run pack:win` runs this sync automatically before building.
