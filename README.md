# Something to Focus

An aesthetic, offline-first Pomodoro app with:

- Unlimited color-coded projects
- Custom focus/short/long/cycle settings
- Auto-start focus/break automation
- Per-project to-do lists
- Weekly local-only statistics
- Home screen + multiple visual themes
- Electron desktop wrapper with Windows `.exe` packaging

## Run in browser

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Run as desktop app (dev)

```bash
npm install
npm start
```

## Build Windows `.exe` locally on Windows

```bat
scripts\build-windows.bat
```

Or manually:

```bash
npm install
npm run pack:win
```

Artifacts are generated in `dist/`.

## Downloadable EXE via GitHub Actions

A CI workflow is included at `.github/workflows/build-windows-exe.yml`.

1. Push this repo to GitHub.
2. Open **Actions → Build Windows EXE**.
3. Run the workflow.
4. Download `something-to-focus-windows-exe` artifact (contains `.exe` output from `dist/`).

> This environment blocks package registries (HTTP 403), so dependency install and `.exe` build cannot be executed here, but the project now contains complete Windows build automation.

All user data remains local on-device (`localStorage`).
