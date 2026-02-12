const APP_VERSION = "5.2.0";
const STORAGE_KEY = "something-to-focus-v7";
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const THEMES = [
  { id: "default", label: "Midnight Neon" },
  { id: "sunrise", label: "Sunrise" },
  { id: "forest", label: "Forest" },
  { id: "mono", label: "Monochrome" },
  { id: "ocean", label: "Ocean Depth" },
  { id: "lavender", label: "Lavender Mist" },
  { id: "solar", label: "Solar Dusk" },
  { id: "aurora", label: "Aurora" },
  { id: "rose", label: "Rose Gold" },
];

const defaultProject = {
  id: crypto.randomUUID(),
  name: "Deep Work",
  color: "#7C5CFF",
  settings: { focusMin: 25, shortMin: 5, longMin: 15, cycles: 4, autoStartBreaks: false, autoStartFocus: false },
  todos: [],
  sessions: [],
};

const state = loadState();
let timerInterval = null;
let timerStart = Date.now();

const ui = {
  homeScreen: document.getElementById("home-screen"),
  appScreen: document.getElementById("app-screen"),
  enterAppBtn: document.getElementById("enter-app-btn"),
  themeSelect: document.getElementById("theme-select"),
  goHomeBtn: document.getElementById("go-home-btn"),
  zenBtn: document.getElementById("zen-btn"),
  exitZenBtn: document.getElementById("exit-zen-btn"),
  projectList: document.getElementById("project-list"),
  activeProjectName: document.getElementById("active-project-name"),
  timeDisplay: document.getElementById("time-display"),
  sessionLabel: document.getElementById("session-label"),
  cycleDisplay: document.getElementById("cycle-display"),
  zenTimeDisplay: document.getElementById("zen-time-display"),
  zenSessionLabel: document.getElementById("zen-session-label"),
  zenCycleDisplay: document.getElementById("zen-cycle-display"),
  startBtn: document.getElementById("start-btn"),
  pauseBtn: document.getElementById("pause-btn"),
  resetBtn: document.getElementById("reset-btn"),
  skipBtn: document.getElementById("skip-btn"),
  zenStartBtn: document.getElementById("zen-start-btn"),
  zenPauseBtn: document.getElementById("zen-pause-btn"),
  zenResetBtn: document.getElementById("zen-reset-btn"),
  zenSkipBtn: document.getElementById("zen-skip-btn"),
  focusMin: document.getElementById("focus-min"),
  shortMin: document.getElementById("short-min"),
  longMin: document.getElementById("long-min"),
  cycles: document.getElementById("cycles"),
  autoStartBreaks: document.getElementById("auto-start-breaks"),
  autoStartFocus: document.getElementById("auto-start-focus"),
  saveSettingsBtn: document.getElementById("save-settings-btn"),
  todoList: document.getElementById("todo-list"),
  todoForm: document.getElementById("todo-form"),
  todoInput: document.getElementById("todo-input"),
  statsCanvas: document.getElementById("stats-canvas"),
  weeklyTotal: document.getElementById("weekly-total"),
  timerModes: document.getElementById("timer-modes"),
  ringProgress: document.getElementById("ring-progress"),
  zenRingProgress: document.getElementById("zen-ring-progress"),
  newProjectBtn: document.getElementById("new-project-btn"),
  projectDialog: document.getElementById("project-dialog"),
  projectForm: document.getElementById("project-form"),
  projectNameInput: document.getElementById("project-name-input"),
  projectColorInput: document.getElementById("project-color-input"),
  dailyGoalInput: document.getElementById("daily-goal-min"),
  saveGoalBtn: document.getElementById("save-goal-btn"),
  todayProgressText: document.getElementById("today-progress-text"),
  todayProgressBar: document.getElementById("today-progress-bar"),
  repoOwnerInput: document.getElementById("repo-owner"),
  repoNameInput: document.getElementById("repo-name"),
  saveRepoBtn: document.getElementById("save-repo-btn"),
  downloadLatestBtn: document.getElementById("download-latest-btn"),
  updateStatus: document.getElementById("update-status"),
  buildBadgeHome: document.getElementById("build-badge-home"),
  buildBadgeApp: document.getElementById("build-badge-app"),
  buildVersionLine: document.getElementById("build-version-line"),
  resetLocalDataBtn: document.getElementById("reset-local-data-btn"),
};

const modeMeta = { focus: { label: "Focus" }, short: { label: "Short Break" }, long: { label: "Long Break" } };

init();

function init() {
  populateThemes();
  buildModes();
  bindEvents();
  syncSettingsInputs();
  ensureRingMetrics();
  setTheme(state.theme);
  ui.buildBadgeHome.textContent = `Build v${APP_VERSION}`;
  ui.buildBadgeApp.textContent = `Build v${APP_VERSION}`;
  ui.buildVersionLine.textContent = `Build: v${APP_VERSION}`;
  setScreen("home");
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed.projects?.length) return createInitialState();
    const activeProjectId = parsed.projects.some((p) => p.id === parsed.activeProjectId)
      ? parsed.activeProjectId
      : parsed.projects[0].id;
    return {
      projects: parsed.projects,
      activeProjectId,
      timer: parsed.timer || createTimerState(parsed.projects[0]),
      theme: parsed.theme || "default",
      dailyGoalMin: Number(parsed.dailyGoalMin) > 0 ? parsed.dailyGoalMin : 180,
      updateRepo: parsed.updateRepo || { owner: "", name: "" },
      zenMode: false,
      screen: "home",
    };
  } catch {
    return createInitialState();
  }
}

function createInitialState() {
  return {
    projects: [structuredClone(defaultProject)],
    activeProjectId: defaultProject.id,
    timer: createTimerState(defaultProject),
    theme: "default",
    dailyGoalMin: 180,
    updateRepo: { owner: "", name: "" },
    zenMode: false,
    screen: "home",
  };
}

function createTimerState(project) {
  return {
    mode: "focus",
    currentCycle: 1,
    totalCycles: project.settings.cycles,
    durationMs: project.settings.focusMin * 60_000,
    remainingMs: project.settings.focusMin * 60_000,
    running: false,
  };
}

function bindEvents() {
  ui.enterAppBtn.addEventListener("click", () => setScreen("app"));
  ui.goHomeBtn.addEventListener("click", () => setScreen("home"));
  ui.themeSelect.addEventListener("change", () => setTheme(ui.themeSelect.value));
  ui.zenBtn.addEventListener("click", toggleZenMode);
  ui.exitZenBtn.addEventListener("click", () => setZenMode(false));
  ui.startBtn.addEventListener("click", startTimer);
  ui.pauseBtn.addEventListener("click", pauseTimer);
  ui.resetBtn.addEventListener("click", resetTimer);
  ui.skipBtn.addEventListener("click", () => transitionMode(true));
  ui.zenStartBtn.addEventListener("click", startTimer);
  ui.zenPauseBtn.addEventListener("click", pauseTimer);
  ui.zenResetBtn.addEventListener("click", resetTimer);
  ui.zenSkipBtn.addEventListener("click", () => transitionMode(true));
  ui.saveSettingsBtn.addEventListener("click", applySettings);
  ui.saveGoalBtn.addEventListener("click", applyGoal);
  ui.saveRepoBtn.addEventListener("click", saveRepoConfig);
  ui.downloadLatestBtn.addEventListener("click", downloadLatestExe);
  ui.resetLocalDataBtn.addEventListener("click", resetLocalData);

  document.addEventListener("keydown", handleShortcuts);
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) setZenMode(false, false);
  });

  ui.todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = ui.todoInput.value.trim();
    if (!text) return;
    getProject().todos.push({ id: crypto.randomUUID(), text, done: false });
    ui.todoInput.value = "";
    saveState();
    renderTodos();
  });

  ui.newProjectBtn.addEventListener("click", () => ui.projectDialog.showModal());

  ui.projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.submitter?.value !== "confirm") {
      ui.projectDialog.close();
      return;
    }
    const name = ui.projectNameInput.value.trim();
    if (!name) return;

    const project = {
      id: crypto.randomUUID(),
      name,
      color: ui.projectColorInput.value,
      settings: structuredClone(defaultProject.settings),
      todos: [],
      sessions: [],
    };

    state.projects.push(project);
    state.activeProjectId = project.id;
    state.timer = createTimerState(project);
    ui.projectForm.reset();
    ui.projectColorInput.value = "#7C5CFF";
    ui.projectDialog.close();
    syncSettingsInputs();
    saveState();
    renderAll();
  });
}

function handleShortcuts(event) {
  if (state.screen !== "app") return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

  if (event.code === "Space") {
    event.preventDefault();
    if (state.timer.running) pauseTimer();
    else startTimer();
  }
  if (event.key.toLowerCase() === "r") resetTimer();
  if (event.key.toLowerCase() === "s") transitionMode(true);
  if (event.key.toLowerCase() === "f") toggleZenMode();
}

function setScreen(screen) {
  state.screen = screen;
  ui.homeScreen.classList.toggle("active", screen === "home");
  ui.appScreen.classList.toggle("active", screen === "app");
  saveState();
}

function populateThemes() {
  ui.themeSelect.innerHTML = "";
  THEMES.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme.id;
    option.textContent = theme.label;
    ui.themeSelect.appendChild(option);
  });
}

function setTheme(themeId) {
  state.theme = THEMES.some((t) => t.id === themeId) ? themeId : "default";
  document.documentElement.dataset.theme = state.theme === "default" ? "" : state.theme;
  ui.themeSelect.value = state.theme;
  saveState();
}

function buildModes() {
  ui.timerModes.innerHTML = "";
  Object.entries(modeMeta).forEach(([mode, meta]) => {
    const btn = document.createElement("button");
    btn.className = "mode-btn";
    btn.textContent = meta.label;
    btn.dataset.mode = mode;
    btn.addEventListener("click", () => {
      pauseTimer();
      setMode(mode);
    });
    ui.timerModes.appendChild(btn);
  });
}

function getProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0];
}

function applySettings() {
  const p = getProject();
  p.settings.focusMin = clampInt(ui.focusMin.value, 1, 180, 25);
  p.settings.shortMin = clampInt(ui.shortMin.value, 1, 60, 5);
  p.settings.longMin = clampInt(ui.longMin.value, 1, 90, 15);
  p.settings.cycles = clampInt(ui.cycles.value, 1, 12, 4);
  p.settings.autoStartBreaks = ui.autoStartBreaks.checked;
  p.settings.autoStartFocus = ui.autoStartFocus.checked;
  state.timer.currentCycle = Math.min(state.timer.currentCycle, p.settings.cycles);
  setMode(state.timer.mode);
  saveState();
  renderAll();
}

function applyGoal() {
  state.dailyGoalMin = clampInt(ui.dailyGoalInput.value, 30, 1440, 180);
  saveState();
  renderGoal();
}

function syncSettingsInputs() {
  const s = getProject().settings;
  ui.focusMin.value = s.focusMin;
  ui.shortMin.value = s.shortMin;
  ui.longMin.value = s.longMin;
  ui.cycles.value = s.cycles;
  ui.autoStartBreaks.checked = s.autoStartBreaks;
  ui.autoStartFocus.checked = s.autoStartFocus;
  ui.dailyGoalInput.value = state.dailyGoalMin;
  ui.repoOwnerInput.value = state.updateRepo.owner;
  ui.repoNameInput.value = state.updateRepo.name;
}

function saveRepoConfig() {
  state.updateRepo.owner = ui.repoOwnerInput.value.trim();
  state.updateRepo.name = ui.repoNameInput.value.trim();
  saveState();
  ui.updateStatus.textContent = `Repo saved for build v${APP_VERSION}. Click Download Latest .exe when ready.`;
}

async function downloadLatestExe() {
  const owner = ui.repoOwnerInput.value.trim();
  const name = ui.repoNameInput.value.trim();
  if (!owner || !name) {
    ui.updateStatus.textContent = "Please set both GitHub owner and repo name first.";
    return;
  }

  state.updateRepo = { owner, name };
  saveState();
  ui.updateStatus.textContent = "Checking latest release...";

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/releases/latest`);
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const release = await response.json();
    const exeAsset = (release.assets || []).find((asset) => /\.exe$/i.test(asset.name));
    if (!exeAsset?.browser_download_url) {
      ui.updateStatus.textContent = "No .exe asset found in latest release. Upload a Windows exe asset to Releases first.";
      return;
    }
    ui.updateStatus.textContent = `Opening download for build asset: ${exeAsset.name}`;
    window.open(exeAsset.browser_download_url, "_blank");
  } catch (error) {
    ui.updateStatus.textContent = `Update download failed: ${error.message}`;
  }
}

function resetLocalData() {
  const ok = confirm("This clears local projects/tasks/settings for this app build. Continue?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function setMode(mode) {
  const s = getProject().settings;
  state.timer.mode = mode;
  state.timer.durationMs = (mode === "focus" ? s.focusMin : mode === "short" ? s.shortMin : s.longMin) * 60_000;
  state.timer.remainingMs = state.timer.durationMs;
  saveState();
  renderTimer();
}

function startTimer() {
  if (state.timer.running) return;
  state.timer.running = true;
  timerStart = Date.now();
  timerInterval = setInterval(tick, 250);
  renderTimer();
}

function pauseTimer() {
  if (!state.timer.running) return;
  clearInterval(timerInterval);
  timerInterval = null;
  state.timer.running = false;
  saveState();
  renderTimer();
}

function resetTimer() {
  pauseTimer();
  setMode(state.timer.mode);
}

function tick() {
  const now = Date.now();
  const elapsed = now - timerStart;
  timerStart = now;
  state.timer.remainingMs = Math.max(0, state.timer.remainingMs - elapsed);
  if (state.timer.remainingMs <= 0) return transitionMode(false);
  renderTimer();
}

function transitionMode(manualSkip) {
  pauseTimer();
  const project = getProject();
  if (state.timer.mode === "focus" && !manualSkip) {
    project.sessions.push({ date: new Date().toISOString(), minutes: Math.round(state.timer.durationMs / 60_000), mode: "focus" });
    notify("Focus complete", `Great work on ${project.name}. Time for a break.`);
  }

  if (state.timer.mode === "focus") {
    if (state.timer.currentCycle % project.settings.cycles === 0) setMode("long");
    else setMode("short");
  } else {
    if (state.timer.mode === "long") state.timer.currentCycle = 1;
    else state.timer.currentCycle = Math.min(project.settings.cycles, state.timer.currentCycle + 1);
    setMode("focus");
  }

  renderAll();
  const auto =
    (state.timer.mode === "focus" && project.settings.autoStartFocus) ||
    (state.timer.mode !== "focus" && project.settings.autoStartBreaks);
  if (auto) startTimer();
}

function notify(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function setZenMode(enabled, syncFullscreen = true) {
  state.zenMode = enabled;
  document.body.classList.toggle("zen-mode", enabled);
  ui.zenBtn.textContent = enabled ? "Exit Focus View" : "Focus View";

  if (syncFullscreen) {
    if (enabled && !document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
    if (!enabled && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }
}

function toggleZenMode() {
  setZenMode(!state.zenMode);
}

function renderAll() {
  renderProjects();
  renderTimer();
  renderTodos();
  renderStats();
  renderGoal();
}

function renderProjects() {
  ui.projectList.innerHTML = "";
  state.projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = `project-item ${project.id === state.activeProjectId ? "active" : ""}`;

    const pick = document.createElement("button");
    pick.style.display = "flex";
    pick.style.alignItems = "center";
    pick.style.gap = ".5rem";
    pick.style.flex = "1";

    const swatch = document.createElement("span");
    swatch.className = "project-tag";
    swatch.style.background = project.color;
    const name = document.createElement("span");
    name.textContent = project.name;
    pick.append(swatch, name);

    pick.addEventListener("click", () => {
      pauseTimer();
      state.activeProjectId = project.id;
      state.timer = createTimerState(project);
      syncSettingsInputs();
      saveState();
      renderAll();
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.disabled = state.projects.length === 1;
    del.addEventListener("click", () => {
      if (state.projects.length === 1) return;
      state.projects = state.projects.filter((p) => p.id !== project.id);
      if (state.activeProjectId === project.id) {
        state.activeProjectId = state.projects[0].id;
        state.timer = createTimerState(state.projects[0]);
        syncSettingsInputs();
      }
      saveState();
      renderAll();
    });

    li.append(pick, del);
    ui.projectList.appendChild(li);
  });
}

function renderTimer() {
  const p = getProject();
  const time = formatTime(state.timer.remainingMs);
  const cycle = `Cycle ${state.timer.currentCycle} / ${p.settings.cycles}`;
  const label = modeMeta[state.timer.mode].label;

  ui.activeProjectName.textContent = p.name;
  ui.sessionLabel.textContent = label;
  ui.timeDisplay.textContent = time;
  ui.cycleDisplay.textContent = cycle;
  ui.zenSessionLabel.textContent = label;
  ui.zenTimeDisplay.textContent = time;
  ui.zenCycleDisplay.textContent = cycle;

  ui.startBtn.disabled = state.timer.running;
  ui.pauseBtn.disabled = !state.timer.running;
  ui.zenStartBtn.disabled = state.timer.running;
  ui.zenPauseBtn.disabled = !state.timer.running;

  ui.timerModes.querySelectorAll(".mode-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === state.timer.mode));

  const r = Number(ui.ringProgress.getAttribute("r"));
  const c = 2 * Math.PI * r;
  const progress = 1 - state.timer.remainingMs / state.timer.durationMs;
  const offset = `${c * (1 - progress)}`;

  ui.ringProgress.style.stroke = p.color;
  ui.ringProgress.style.strokeDasharray = `${c}`;
  ui.ringProgress.style.strokeDashoffset = offset;
  ui.zenRingProgress.style.stroke = p.color;
  ui.zenRingProgress.style.strokeDasharray = `${c}`;
  ui.zenRingProgress.style.strokeDashoffset = offset;
}

function renderTodos() {
  const p = getProject();
  ui.todoList.innerHTML = "";
  p.todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = ".6rem";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveState();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = `todo-text ${todo.done ? "done" : ""}`;
    text.textContent = todo.text;

    const remove = document.createElement("button");
    remove.textContent = "✕";
    remove.addEventListener("click", () => {
      p.todos = p.todos.filter((t) => t.id !== todo.id);
      saveState();
      renderTodos();
    });

    left.append(checkbox, text);
    li.append(left, remove);
    ui.todoList.appendChild(li);
  });
}

function renderGoal() {
  const focusedToday = getTodayFocusMinutes();
  const pct = Math.min(100, Math.round((focusedToday / state.dailyGoalMin) * 100));
  ui.todayProgressText.textContent = `${focusedToday} / ${state.dailyGoalMin} minutes today (${pct}%)`;
  ui.todayProgressBar.value = pct;
}

function getTodayFocusMinutes() {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  let total = 0;
  state.projects.forEach((project) => {
    project.sessions.forEach((session) => {
      const t = new Date(session.date).getTime();
      if (!Number.isNaN(t) && t >= dayStart) total += session.minutes;
    });
  });
  return total;
}

function renderStats() {
  const ctx = ui.statsCanvas.getContext("2d");
  const w = ui.statsCanvas.width;
  const h = ui.statsCanvas.height;
  ctx.clearRect(0, 0, w, h);

  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const data = new Map();
  state.projects.forEach((project) => {
    const totals = Array(7).fill(0);
    project.sessions.forEach((s) => {
      const d = new Date(s.date);
      if (Number.isNaN(d.getTime()) || d < start) return;
      const i = Math.floor((d - start) / 86_400_000);
      if (i >= 0 && i < 7) totals[i] += s.minutes;
    });
    data.set(project.id, totals);
  });

  const groupW = w / 7;
  const barW = Math.max(6, (groupW - 14) / Math.max(1, state.projects.length));
  const max = Math.max(1, ...[...data.values()].flatMap((a) => a));
  let total = 0;

  DAY_LABELS.forEach((day, dayIdx) => {
    const xBase = dayIdx * groupW;
    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.font = "12px Inter";
    ctx.fillText(day, xBase + 8, h - 10);

    state.projects.forEach((project, idx) => {
      const value = data.get(project.id)[dayIdx];
      total += value;
      const bh = (value / max) * (h - 46);
      const x = xBase + 8 + idx * barW;
      const y = h - 30 - bh;
      ctx.fillStyle = project.color;
      ctx.fillRect(x, y, barW - 2, bh);
    });
  });

  ui.weeklyTotal.textContent = `${total}m this week`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  return `${String(Math.floor(totalSec / 60)).padStart(2, "0")}:${String(totalSec % 60).padStart(2, "0")}`;
}

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function ensureRingMetrics() {
  [ui.ringProgress, ui.zenRingProgress].forEach((ring) => {
    const r = Number(ring.getAttribute("r"));
    const c = 2 * Math.PI * r;
    ring.style.strokeDasharray = `${c}`;
    ring.style.strokeDashoffset = `${c}`;
  });
}
