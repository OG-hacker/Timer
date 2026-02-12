# Something to Focus (Build v5.2.0)

## Included Features in this build

- 9 selectable themes (including Aurora + Rose Gold)
- Fullscreen Focus View (timer-only circle overlay)
- In-app EXE downloader from GitHub Releases
- Daily goal tracker
- Weekly statistics chart
- Keyboard shortcuts (`Space`, `R`, `S`, `F`)
- Build/version badge visible in app UI
- New **Reset Local Data** button for stale-state troubleshooting

## Windows EXE build (fresh every run)

Use `Build-EXE-and-Run.bat` (recommended). It now:
1. Cleans old `dist/`
2. Installs dependencies
3. Builds a fresh portable `.exe`
4. Launches the newest `.exe` from `dist/`

Build-only option:

```bat
scripts\build-windows.bat
```

## If you still see stale version

1. In app, confirm badge says **Build v5.2.0**.
2. Use **Reset Local Data** in the app.
3. Close all old instances and launch only the newest file in `dist/`.
4. If needed, delete older downloaded folders/zip extracts to avoid opening the wrong exe.

## In-app update download

In **In-App Updates** card:
1. Set GitHub owner + repo
2. Click **Download Latest .exe**
3. App opens latest release exe download URL
