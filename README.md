# Something to Focus

An aesthetic, offline-first Pomodoro app with:

- Unlimited color-coded projects
- Custom focus/short/long/cycle settings
- Auto-start focus/break automation
- Per-project to-do lists
- Weekly local-only statistics
- Daily goal tracker with progress bar
- 9 visual themes
- Fullscreen Focus View (timer-only circle mode)
- Keyboard shortcuts (`Space`, `R`, `S`, `F`)
- In-app updater helper (downloads latest `.exe` from your GitHub Releases)
- Electron desktop wrapper with Windows `.exe` packaging

## Run as a real Windows executable (offline)

### One-click build + run
On Windows, double-click:

- `Build-EXE-and-Run.bat`

This will:
1. install dependencies,
2. build the Windows executable,
3. launch the built `.exe` from `dist/`.

### Build only

```bat
scripts\build-windows.bat
```

Artifacts are generated in `dist/`.

## Download updates from inside the app

In the app, open **In-App Updates**:
1. Set your GitHub **owner** and **repo**.
2. Click **Download Latest .exe**.
3. The app fetches your latest GitHub Release and opens the `.exe` asset download link.

This avoids manually browsing GitHub every time.

## Already-built downloadable EXE (GitHub Actions)

A CI workflow is included at `.github/workflows/build-windows-exe.yml`.

1. Push this repo to GitHub.
2. Open **Actions → Build Windows EXE**.
3. Run the workflow.
4. Download `something-to-focus-windows-exe` artifact (contains `.exe` from `dist/`).

## Optional: run in browser

If you want browser mode, you can still double-click `index.html` or serve locally:

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

All user data remains local on-device (`localStorage`).
