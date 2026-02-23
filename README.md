# Something to Focus (Build v6.0.0)

## What changed in this build

- Updater now fetches the **latest source code** from your repo default branch instead of only checking Releases.
- PiP Focus was decluttered for tiny window sizes (fewer controls and less label noise).
- PiP minimum size was lowered and controls were tightened so small PiP is more usable.
- Theme system expanded heavily with many new presets.
- Added a **Custom Theme Builder** with color pickers for background, panel, border, text, muted text, and accent.
- Fixed theme consistency issues including monochrome primary button contrast.

## Themes included

Midnight Neon, Sunrise, Forest, Monochrome, Ocean Depth, Lavender Mist, Solar Dusk, Aurora, Rose Gold, Ember Night, Ice Blue, Coffee House, Mint Glow, Sakura, Violet Storm, Slate Minimal, and Custom.

## Updating from inside the app

1. Open **Settings → Updates**.
2. Enter GitHub owner and repo.
3. Click **Download Latest Source Code**.

Desktop app mode downloads a zip to `Downloads` and opens it.

## How to enable PiP mode

1. Open the desktop app (Electron build).
2. Go to the app screen (`Start Focusing`).
3. Click **PiP Focus** in the header.
4. Resize PiP by dragging window edges/corners.
5. To exit PiP, click **Exit PiP**.

## Stale build troubleshooting

1. Confirm badge shows **Build v6.0.0**.
2. In Settings > Updates, click **Reset Local Data** if needed.
3. Close old app instances.
4. Run newest exe from `dist/`.

## Version sync safety

- `package.json` is the source of truth for version.
- Run `npm run sync:version` to sync `app.js` + `README.md`.
- `npm run pack:win` runs this sync automatically.
