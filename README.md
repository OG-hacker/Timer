# Something to Focus (Build v5.3.0)

## What changed in this build

- Added a clean **Settings Menu** with categorized tabs:
  - Appearance
  - Timer
  - Goals
  - Updates
- Reduced dashboard clutter by moving advanced controls into Settings.
- Fixed update fields not being typeable (repo owner/repo name inputs in Settings > Updates).
- Fixed fullscreen Focus View scrollbar issue (no right-side scroll indicator in Focus View).
- Kept all requested features:
  - 9 themes
  - Fullscreen Focus View
  - In-app EXE downloader
  - Daily goal + weekly stats

## Windows EXE build (fresh every run)

Use `Build-EXE-and-Run.bat`:
1. Cleans old `dist/`
2. Installs dependencies
3. Builds fresh portable `.exe`
4. Launches newest exe from `dist/`

## If you still see stale version

1. Verify the app badge says **Build v5.3.0**.
2. Open **Settings > Updates** and click **Reset Local Data**.
3. Close all old app instances.
4. Launch only the newest exe in `dist/`.
