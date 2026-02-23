# Something to Focus (Build v5.8.0)

## What changed in this build

- Made PiP Focus controls much easier to find:
  - **Header:** `PiP Focus` button next to `Focus View`.
  - **Main controls row:** another `PiP Focus` button under the timer.
  - **Settings > Appearance:** `Open PiP Focus` button.
- Added stronger PiP button styling so it stands out visually.
- Kept updater behavior that downloads and opens the latest runnable Windows `.exe` when available.

## How to enable PiP mode

1. Open the desktop app (Electron exe build).
2. Go to the app screen (`Start Focusing`).
3. Click any **PiP Focus** button.
4. To exit PiP, click **Exit PiP** in Focus View.

> Note: PiP window behavior (corner + always-on-top) only works in the desktop `.exe`, not in a normal web browser tab.

## In-app updater requirements

Your GitHub Release must include at least one Windows `.exe` asset (portable exe recommended).

If no exe is present, the app will say:
- `No runnable Windows .exe found in latest release...`

## Stale build troubleshooting

1. Confirm badge shows **Build v5.8.0**.
2. In Settings > Updates, click **Reset Local Data** if needed.
3. Close old app instances.
4. Run newest exe from `dist/` or Downloads.
