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

This now always:
1. deletes old `dist/` artifacts,
2. installs dependencies,
3. builds a **fresh portable exe**,
4. launches the newest exe from `dist/`.

### Build only

```bat
scripts\build-windows.bat
```

## If updates still don't appear

1. Confirm the app shows **Build v5.1.0** in the UI badges.
2. Make sure you launched the exe from the **new `dist/` folder** built in this run.
3. If you previously installed an older build, close it and run only the new portable exe in `dist/`.
4. Delete old `dist/` before building (the scripts now do this automatically).

## Download updates from inside the app

In the app, open **In-App Updates**:
1. Set your GitHub **owner** and **repo**.
2. Click **Download Latest .exe**.
3. The app fetches latest GitHub Release and opens the `.exe` asset download link.

## Already-built downloadable EXE (GitHub Actions)

A CI workflow is included at `.github/workflows/build-windows-exe.yml`.

1. Push this repo to GitHub.
2. Open **Actions → Build Windows EXE**.
3. Run the workflow.
4. Download `something-to-focus-windows-exe` artifact.

All user data remains local on-device (`localStorage`).
