# Something to Focus (Build v5.7.0)

## What changed in this build

- Fixed in-app updater so it targets runnable Windows **.exe** assets only.
- Updater now **downloads the latest exe to your Downloads folder and opens it directly** (desktop app mode).
- Improved error text to explain when a release does not contain a runnable exe.
- Kept PiP Focus mode, full-screen focus mode, utilities, themes, and settings tabs.

## In-app updater requirements

Your GitHub Release must include at least one Windows `.exe` asset (portable exe recommended).

If no exe is present, the app now clearly says:
- `No runnable Windows .exe found in latest release...`

## Stale build troubleshooting

1. Confirm badge shows **Build v5.7.0**.
2. In Settings > Updates, use **Reset Local Data** if needed.
3. Close old app instances.
4. Run newest exe from `dist/` or Downloads.
