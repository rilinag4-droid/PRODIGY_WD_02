// ── Generate twinkling stars ──────────────────────────────────────────
const starsEl = document.getElementById('stars');
for (let i = 0; i < 18; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    animation-delay: ${Math.random() * 4}s;
    width: ${4 + Math.random() * 6}px;
    height: ${4 + Math.random() * 6}px;
  `;
  starsEl.appendChild(s);
}

// ── State ─────────────────────────────────────────────────────────────
let startTime = 0;
let elapsed   = 0;
let interval  = null;
let running   = false;
let laps      = [];

// ── Helpers ───────────────────────────────────────────────────────────
function pad(n, len = 2) {
  return String(Math.floor(n)).padStart(len, '0');
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const cs  = Math.floor((ms % 1000) / 10);
  return `${pad(min)}:${pad(sec)}<span class="ms">.${pad(cs)}</span>`;
}

function updateDisplay() {
  const now = running ? Date.now() - startTime + elapsed : elapsed;
  document.getElementById('timeDisplay').innerHTML = formatTime(now);
}

// ── Start / Pause ─────────────────────────────────────────────────────
function toggleStart() {
  const startBtn  = document.getElementById('startBtn');
  const lapBtn    = document.getElementById('lapBtn');
  const badge     = document.getElementById('statusBadge');

  if (!running) {
    // Start / Resume
    startTime = Date.now();
    interval  = setInterval(updateDisplay, 30);
    running   = true;

    startBtn.textContent       = '⏸ Pause';
    startBtn.style.background  = 'linear-gradient(135deg,#a78bfa,#6366f1)';
    lapBtn.disabled            = false;
    badge.textContent          = 'Running';
    badge.className            = 'status-badge running';
  } else {
    // Pause
    elapsed += Date.now() - startTime;
    clearInterval(interval);
    running = false;

    startBtn.textContent       = '▶ Resume';
    startBtn.style.background  = 'linear-gradient(135deg,#f472b6,#a855f7)';
    lapBtn.disabled            = true;
    badge.textContent          = 'Paused';
    badge.className            = 'status-badge';
  }
}

// ── Reset ─────────────────────────────────────────────────────────────
function resetTimer() {
  clearInterval(interval);
  elapsed = 0;
  running = false;
  laps    = [];

  document.getElementById('timeDisplay').innerHTML   = '00:00<span class="ms">.00</span>';
  document.getElementById('startBtn').textContent    = '▶ Start';
  document.getElementById('startBtn').style.background = 'linear-gradient(135deg,#f472b6,#a855f7)';
  document.getElementById('lapBtn').disabled         = true;
  document.getElementById('statusBadge').textContent = 'Ready';
  document.getElementById('statusBadge').className   = 'status-badge';
  document.getElementById('lapsList').innerHTML      = '';
  document.getElementById('emptyLaps').style.display = '';
}

// ── Record Lap ────────────────────────────────────────────────────────
function recordLap() {
  const now = Date.now() - startTime + elapsed;
  laps.push(now);

  document.getElementById('emptyLaps').style.display = 'none';

  const list = document.getElementById('lapsList');
  const item = document.createElement('div');
  item.className = 'lap-item';

  // Show split time (time since last lap)
  const split    = laps.length > 1 ? now - laps[laps.length - 2] : now;
  const totalSec = Math.floor(split / 1000);
  const min      = Math.floor(totalSec / 60);
  const sec      = totalSec % 60;
  const cs       = Math.floor((split % 1000) / 10);

  item.innerHTML = `
    <span class="lap-num">Lap ${laps.length}</span>
    <span class="lap-time">${pad(min)}:${pad(sec)}.${pad(cs)}</span>
  `;

  list.insertBefore(item, list.firstChild);
}