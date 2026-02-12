# Something to Focus

An aesthetic, offline-first Pomodoro app with:

- Unlimited color-coded projects
- Custom focus/short/long/cycle settings
- Auto-start focus/break automation
- Per-project to-do lists
- Weekly local-only statistics
- Home screen + multiple visual themes
- Electron desktop wrapper (Windows `.exe` packaging support)

## Run in browser

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Run as desktop app

```bash
npm install
npm start
```

## Build Windows `.exe`

```bash
npm install
npm run pack:win
```

Artifacts are generated in `dist/`.

> Note: Building a Windows installer from Linux may require Wine/extra system tooling. Running the same command on Windows is recommended for the smoothest build.

All user data remains local on-device (`localStorage`).
