#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const appPath = path.join(root, 'app.js');
const readmePath = path.join(root, 'README.md');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

function replaceOrThrow(content, regex, replacement, fileLabel) {
  if (!regex.test(content)) {
    throw new Error(`Could not find expected pattern in ${fileLabel}`);
  }
  return content.replace(regex, replacement);
}

function syncFiles() {
  let app = fs.readFileSync(appPath, 'utf8');
  app = replaceOrThrow(app, /^const APP_VERSION = ".*";$/m, `const APP_VERSION = "${version}";`, 'app.js');

  let readme = fs.readFileSync(readmePath, 'utf8');
  readme = replaceOrThrow(readme, /^# Something to Focus \(Build v.*\)$/m, `# Something to Focus (Build v${version})`, 'README.md');
  readme = readme.replace(/\*\*Build v[\d.]+\*\*/g, `**Build v${version}**`);

  fs.writeFileSync(appPath, app);
  fs.writeFileSync(readmePath, readme);
}

function checkFiles() {
  const app = fs.readFileSync(appPath, 'utf8');
  const readme = fs.readFileSync(readmePath, 'utf8');

  const appOk = app.includes(`const APP_VERSION = "${version}";`);
  const readmeHeaderOk = readme.includes(`# Something to Focus (Build v${version})`);
  const buildMentions = [...readme.matchAll(/\*\*Build v([\d.]+)\*\*/g)].map((m) => m[1]);
  const readmeMentionsOk = buildMentions.every((v) => v === version);

  if (appOk && readmeHeaderOk && readmeMentionsOk) {
    console.log(`Version references are in sync at ${version}.`);
    return;
  }

  console.error(`Version references are NOT in sync with package.json version ${version}.`);
  process.exit(1);
}

if (process.argv.includes('--check')) {
  checkFiles();
} else {
  syncFiles();
  console.log(`Synced app.js and README.md to version ${version}.`);
}
