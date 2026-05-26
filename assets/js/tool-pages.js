const host = document.getElementById("toolPageHost");
const page = document.body ? document.body.dataset.toolPage : "";

let activeTimer = null;
let timerRemainingSeconds = 0;
let timerInitialSeconds = 0;
let timerIsRunning = false;
let lastCopyText = "";

function writeHost(html) {
  if (host) {
    host.innerHTML = html;
  }
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value : "";
}

function setResult(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value + "T12:00:00");
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function copyText(text, resultId) {
  if (!text) {
    setResult(resultId, "Nothing to copy yet.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setResult(resultId, "Copied.");
  }
  catch {
    setResult(resultId, "Copy unavailable. Select and copy the result manually.");
  }
}

function stopTimer() {
  if (activeTimer) {
    window.clearInterval(activeTimer);
    activeTimer = null;
  }

  timerIsRunning = false;
}

function renderEventBlock() {
  writeHost(`
    <div class="calculator-grid">
      <form class="tool-form" id="eventBlockForm">
        <label>
          Event date
          <input type="date" id="eventDate" required>
        </label>

        <label>
          Block length
          <select id="blockLength">
            <option value="4">4 weeks</option>
            <option value="6" selected>6 weeks</option>
            <option value="8">8 weeks</option>
            <option value="10">10 weeks</option>
            <option value="12">12 weeks</option>
          </select>
        </label>

        <label>
          Taper length
          <select id="taperLength">
            <option value="0">None</option>
            <option value="1" selected>1 week</option>
            <option value="2">2 weeks</option>
          </select>
        </label>

        <button class="button button-primary" type="submit">Calculate <span>+</span></button>
      </form>

      <div class="tool-result-card">
        <p class="kicker" id="eventBlockState">AWAITING INPUT</p>
        <h3 id="eventBlockTitle">Choose an event date to generate block dates.</h3>
        <div class="result-grid">
          <div><span>Block start</span><strong id="blockStart">-</strong></div>
          <div><span>Taper start</span><strong id="taperStart">-</strong></div>
          <div><span>Event date</span><strong id="eventDateOut">-</strong></div>
        </div>
        <button class="button button-secondary copy-button" id="copyEventBlockButton" type="button">Copy Result</button>
      </div>
    </div>
  `);

  const form = document.getElementById("eventBlockForm");
  const copyButton = document.getElementById("copyEventBlockButton");
  let resultText = "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventDate = parseDate(getValue("eventDate"));
    const blockWeeks = Number(getValue("blockLength"));
    const taperWeeks = Number(getValue("taperLength"));

    if (!eventDate || Number.isNaN(blockWeeks) || Number.isNaN(taperWeeks)) {
      setResult("eventBlockState", "INPUT REQUIRED");
      setResult("eventBlockTitle", "Enter an event date before calculating.");
      return;
    }

    const blockStart = addDays(eventDate, -(blockWeeks * 7));
    const taperStart = taperWeeks === 0 ? null : addDays(eventDate, -(taperWeeks * 7));

    const values = {
      blockStart: formatDate(blockStart),
      taperStart: taperStart ? formatDate(taperStart) : "No taper",
      eventDate: formatDate(eventDate)
    };

    setResult("eventBlockState", "CALCULATED");
    setResult("eventBlockTitle", String(blockWeeks) + "-week block generated for the selected event date.");
    setResult("blockStart", values.blockStart);
    setResult("taperStart", values.taperStart);
    setResult("eventDateOut", values.eventDate);

    resultText = [
      "Kolosseum Tools - Event Block Calculator",
      "Block start: " + values.blockStart,
      "Taper start: " + values.taperStart,
      "Event date: " + values.eventDate
    ].join("\n");
  });

  copyButton.addEventListener("click", function () {
    copyText(resultText, "eventBlockState");
  });
}

function renderIronClock() {
  writeHost(`
    <div class="calculator-grid">
      <form class="tool-form" id="ironClockForm">
        <label>
          Work minutes
          <input type="number" id="workMinutes" min="1" max="180" value="20" required>
        </label>

        <label>
          Rest minutes
          <input type="number" id="restMinutes" min="0" max="60" value="5" required>
        </label>

        <label>
          Rounds
          <input type="number" id="timerRounds" min="1" max="20" value="1" required>
        </label>

        <button class="button button-primary" type="submit">Build Timer <span>+</span></button>
      </form>

      <div class="tool-result-card">
        <p class="kicker" id="timerState">READY</p>
        <h3 id="timerTitle">Build a timer, then start the clock.</h3>
        <div class="timer-face" id="timerDisplay">00:00</div>
        <div class="tool-actions">
          <button class="button button-primary" id="startTimerButton" type="button">Start</button>
          <button class="button button-secondary" id="pauseTimerButton" type="button">Pause</button>
          <button class="button button-secondary" id="resetTimerButton" type="button">Reset</button>
        </div>
      </div>
    </div>
  `);

  const form = document.getElementById("ironClockForm");
  const startButton = document.getElementById("startTimerButton");
  const pauseButton = document.getElementById("pauseTimerButton");
  const resetButton = document.getElementById("resetTimerButton");

  function renderTime() {
    const minutes = Math.floor(timerRemainingSeconds / 60);
    const seconds = timerRemainingSeconds % 60;
    setResult("timerDisplay", String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0"));
  }

  function tick() {
    if (timerRemainingSeconds <= 0) {
      stopTimer();
      setResult("timerState", "COMPLETE");
      setResult("timerTitle", "Timer complete.");
      renderTime();
      return;
    }

    timerRemainingSeconds -= 1;
    renderTime();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    stopTimer();

    const work = Number(getValue("workMinutes"));
    const rest = Number(getValue("restMinutes"));
    const rounds = Number(getValue("timerRounds"));

    if (Number.isNaN(work) || Number.isNaN(rest) || Number.isNaN(rounds) || work < 1 || rounds < 1) {
      setResult("timerState", "INVALID INPUT");
      setResult("timerTitle", "Use valid minutes and rounds.");
      return;
    }

    timerInitialSeconds = ((work + rest) * rounds) * 60;
    timerRemainingSeconds = timerInitialSeconds;

    setResult("timerState", "BUILT");
    setResult("timerTitle", String(rounds) + " round timer built.");
    renderTime();
  });

  startButton.addEventListener("click", function () {
    if (timerRemainingSeconds <= 0) {
      timerRemainingSeconds = timerInitialSeconds || 20 * 60;
      timerInitialSeconds = timerRemainingSeconds;
    }

    if (timerIsRunning) {
      return;
    }

    timerIsRunning = true;
    setResult("timerState", "RUNNING");
    setResult("timerTitle", "Timer running.");
    activeTimer = window.setInterval(tick, 1000);
    renderTime();
  });

  pauseButton.addEventListener("click", function () {
    stopTimer();
    setResult("timerState", "PAUSED");
    setResult("timerTitle", "Timer paused.");
    renderTime();
  });

  resetButton.addEventListener("click", function () {
    stopTimer();
    timerRemainingSeconds = timerInitialSeconds || 0;
    setResult("timerState", "RESET");
    setResult("timerTitle", "Timer reset.");
    renderTime();
  });

  timerInitialSeconds = 20 * 60;
  timerRemainingSeconds = timerInitialSeconds;
  renderTime();
}

function renderGymShare() {
  writeHost(`
    <div class="calculator-grid">
      <form class="tool-form" id="gymShareForm">
        <label>
          Gym name
          <input type="text" id="gymName" maxlength="80" placeholder="Example Strength Club" required>
        </label>

        <label>
          Location
          <input type="text" id="gymLocation" maxlength="120" placeholder="Town or area" required>
        </label>

        <label>
          Public note
          <textarea id="gymNote" maxlength="280" placeholder="Opening times, access notes, or contact route"></textarea>
        </label>

        <button class="button button-primary" type="submit">Generate Share Text <span>+</span></button>
      </form>

      <div class="tool-result-card">
        <p class="kicker" id="gymShareState">AWAITING INPUT</p>
        <h3>Gym Share Output</h3>
        <pre class="output-block" id="gymShareOutput">Enter gym details to generate a public share block.</pre>
        <button class="button button-secondary copy-button" id="copyGymShareButton" type="button">Copy Share Text</button>
      </div>
    </div>
  `);

  const form = document.getElementById("gymShareForm");
  const copyButton = document.getElementById("copyGymShareButton");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = getValue("gymName").trim();
    const location = getValue("gymLocation").trim();
    const note = getValue("gymNote").trim();

    if (!name || !location) {
      setResult("gymShareState", "INPUT REQUIRED");
      return;
    }

    lastCopyText = [
      "Kolosseum Tools - Gym Share",
      "Gym: " + name,
      "Location: " + location,
      "Note: " + (note || "No note supplied.")
    ].join("\n");

    setResult("gymShareState", "GENERATED");
    setResult("gymShareOutput", lastCopyText);
  });

  copyButton.addEventListener("click", function () {
    copyText(lastCopyText, "gymShareState");
  });
}

function readSessionEntries() {
  try {
    return JSON.parse(window.localStorage.getItem("kolosseum.sessionLog.entries") || "[]");
  }
  catch {
    return [];
  }
}

function writeSessionEntries(entries) {
  window.localStorage.setItem("kolosseum.sessionLog.entries", JSON.stringify(entries.slice(0, 8)));
}

function renderSessionEntries() {
  const entries = readSessionEntries();
  const list = document.getElementById("sessionEntries");

  if (!list) {
    return;
  }

  if (entries.length === 0) {
    list.innerHTML = "<p class=\"muted-copy\">No entries yet.</p>";
    return;
  }

  list.innerHTML = entries.map(function (entry) {
    return `
      <article class="mini-entry">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${escapeHtml(entry.date)}</span>
        <p>${escapeHtml(entry.notes)}</p>
      </article>
    `;
  }).join("");
}

function renderSessionLog() {
  writeHost(`
    <div class="calculator-grid">
      <form class="tool-form" id="sessionLogForm">
        <label>
          Session date
          <input type="date" id="sessionDate" required>
        </label>

        <label>
          Session title
          <input type="text" id="sessionTitle" maxlength="90" placeholder="Lower body session" required>
        </label>

        <label>
          Notes
          <textarea id="sessionNotes" maxlength="700" placeholder="Key work, observations, next actions"></textarea>
        </label>

        <button class="button button-primary" type="submit">Save Entry <span>+</span></button>
      </form>

      <div class="tool-result-card">
        <p class="kicker" id="sessionLogState">LOCAL LOG</p>
        <h3>Recent Session Entries</h3>
        <div class="entry-list" id="sessionEntries"></div>
        <div class="tool-actions">
          <button class="button button-secondary" id="copySessionButton" type="button">Copy Latest</button>
          <button class="button button-secondary" id="clearSessionButton" type="button">Clear Entries</button>
        </div>
      </div>
    </div>
  `);

  const today = new Date();
  const sessionDate = document.getElementById("sessionDate");
  if (sessionDate) {
    sessionDate.valueAsDate = today;
  }

  const form = document.getElementById("sessionLogForm");
  const copyButton = document.getElementById("copySessionButton");
  const clearButton = document.getElementById("clearSessionButton");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const date = parseDate(getValue("sessionDate"));
    const title = getValue("sessionTitle").trim();
    const notes = getValue("sessionNotes").trim();

    if (!date || !title) {
      setResult("sessionLogState", "INPUT REQUIRED");
      return;
    }

    const entries = readSessionEntries();
    const entry = {
      date: formatDate(date),
      title: title,
      notes: notes || "No notes supplied."
    };

    entries.unshift(entry);
    writeSessionEntries(entries);
    setResult("sessionLogState", "SAVED");
    form.reset();
    sessionDate.valueAsDate = today;
    renderSessionEntries();
  });

  copyButton.addEventListener("click", function () {
    const entries = readSessionEntries();
    if (entries.length === 0) {
      setResult("sessionLogState", "NO ENTRIES");
      return;
    }

    const entry = entries[0];
    const text = [
      "Kolosseum Tools - Session Log",
      "Date: " + entry.date,
      "Title: " + entry.title,
      "Notes: " + entry.notes
    ].join("\n");

    copyText(text, "sessionLogState");
  });

  clearButton.addEventListener("click", function () {
    writeSessionEntries([]);
    setResult("sessionLogState", "CLEARED");
    renderSessionEntries();
  });

  renderSessionEntries();
}

function renderMeetPlanner() {
  writeHost(`
    <div class="calculator-grid">
      <form class="tool-form" id="meetPlannerForm">
        <label>
          Meet date
          <input type="date" id="meetDate" required>
        </label>

        <label>
          Travel days before
          <input type="number" id="travelDays" min="0" max="14" value="1" required>
        </label>

        <label>
          Final setup days before
          <input type="number" id="setupDays" min="1" max="30" value="7" required>
        </label>

        <button class="button button-primary" type="submit">Plan Meet <span>+</span></button>
      </form>

      <div class="tool-result-card">
        <p class="kicker" id="meetPlannerState">AWAITING INPUT</p>
        <h3>Meet Timeline</h3>
        <div class="result-grid">
          <div><span>Final setup</span><strong id="setupOut">-</strong></div>
          <div><span>Travel day</span><strong id="travelOut">-</strong></div>
          <div><span>Meet day</span><strong id="meetOut">-</strong></div>
        </div>
        <button class="button button-secondary copy-button" id="copyMeetPlannerButton" type="button">Copy Plan</button>
      </div>
    </div>
  `);

  const form = document.getElementById("meetPlannerForm");
  const copyButton = document.getElementById("copyMeetPlannerButton");
  let resultText = "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const meetDate = parseDate(getValue("meetDate"));
    const travelDays = Number(getValue("travelDays"));
    const setupDays = Number(getValue("setupDays"));

    if (!meetDate || Number.isNaN(travelDays) || Number.isNaN(setupDays)) {
      setResult("meetPlannerState", "INPUT REQUIRED");
      return;
    }

    const setupDate = addDays(meetDate, -setupDays);
    const travelDate = addDays(meetDate, -travelDays);

    const values = {
      setup: formatDate(setupDate),
      travel: formatDate(travelDate),
      meet: formatDate(meetDate)
    };

    setResult("meetPlannerState", "PLANNED");
    setResult("setupOut", values.setup);
    setResult("travelOut", values.travel);
    setResult("meetOut", values.meet);

    resultText = [
      "Kolosseum Tools - Meet Planner",
      "Final setup: " + values.setup,
      "Travel day: " + values.travel,
      "Meet day: " + values.meet
    ].join("\n");
  });

  copyButton.addEventListener("click", function () {
    copyText(resultText, "meetPlannerState");
  });
}

function renderLoadSheet() {
  writeHost(`
    <div class="calculator-grid">
      <form class="tool-form" id="loadSheetForm">
        <label>
          Target load kg
          <input type="number" id="targetLoad" min="20" max="500" step="0.5" value="100" required>
        </label>

        <label>
          Bar kg
          <input type="number" id="barWeight" min="5" max="45" step="0.5" value="20" required>
        </label>

        <label>
          Collars total kg
          <input type="number" id="collarWeight" min="0" max="10" step="0.5" value="5" required>
        </label>

        <button class="button button-primary" type="submit">Calculate Load <span>+</span></button>
      </form>

      <div class="tool-result-card">
        <p class="kicker" id="loadSheetState">AWAITING INPUT</p>
        <h3>Plate Loading</h3>
        <pre class="output-block" id="loadSheetOutput">Enter load details to calculate plates per side.</pre>
        <button class="button button-secondary copy-button" id="copyLoadSheetButton" type="button">Copy Load Sheet</button>
      </div>
    </div>
  `);

  const form = document.getElementById("loadSheetForm");
  const copyButton = document.getElementById("copyLoadSheetButton");
  const plates = [25, 20, 15, 10, 5, 2.5, 1.25];

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const target = Number(getValue("targetLoad"));
    const bar = Number(getValue("barWeight"));
    const collars = Number(getValue("collarWeight"));

    if (Number.isNaN(target) || Number.isNaN(bar) || Number.isNaN(collars) || target <= bar + collars) {
      setResult("loadSheetState", "INVALID INPUT");
      return;
    }

    let perSide = (target - bar - collars) / 2;
    const loading = [];

    for (const plate of plates) {
      const count = Math.floor((perSide + 0.001) / plate);
      if (count > 0) {
        loading.push(count + " x " + plate + "kg");
        perSide -= count * plate;
      }
    }

    const remainder = Math.round(perSide * 100) / 100;

    lastCopyText = [
      "Kolosseum Tools - Load Sheet",
      "Target: " + target + "kg",
      "Bar: " + bar + "kg",
      "Collars total: " + collars + "kg",
      "Each side: " + loading.join(", "),
      "Unloaded remainder per side: " + remainder + "kg"
    ].join("\n");

    setResult("loadSheetState", remainder === 0 ? "CALCULATED" : "NEAREST LOAD");
    setResult("loadSheetOutput", lastCopyText);
  });

  copyButton.addEventListener("click", function () {
    copyText(lastCopyText, "loadSheetState");
  });
}

const renderers = {
  "event-block-calculator": renderEventBlock,
  "ironclock": renderIronClock,
  "gym-share": renderGymShare,
  "session-log": renderSessionLog,
  "meet-planner": renderMeetPlanner,
  "load-sheet": renderLoadSheet
};

if (renderers[page]) {
  renderers[page]();
}
else if (host) {
  host.innerHTML = "<p class=\"muted-copy\">Tool page not found.</p>";
}

/* === GYM SHARE PRINT QR START === */

(function () {
  function isGymSharePage() {
    return document.body.classList.contains("gym-share-page") ||
      window.location.pathname.indexOf("/tools/gym-share/") !== -1;
  }

  function readValue(selectors) {
    for (var i = 0; i < selectors.length; i += 1) {
      var el = document.querySelector(selectors[i]);

      if (el && typeof el.value === "string" && el.value.trim()) {
        return el.value.trim();
      }
    }

    return "";
  }

  function readOutput() {
    var selectors = [
      "#gymShareOutput",
      "#gymShareResult",
      "#shareOutput",
      "#resultOutput",
      "[data-gym-share-output]",
      "[data-share-output]",
      ".gym-share-output",
      ".share-output",
      ".tool-output",
      ".result-output",
      ".output-panel pre",
      ".tool-result-card pre",
      "pre"
    ];

    for (var i = 0; i < selectors.length; i += 1) {
      var el = document.querySelector(selectors[i]);

      if (el && el.textContent && el.textContent.trim()) {
        var text = el.textContent.trim();

        if (
          text !== "Enter gym details to generate a public share block." &&
          text !== "Enter gym details before printing QR."
        ) {
          return text;
        }
      }
    }

    return "";
  }

  function getGymShareText() {
    var output = readOutput();

    if (output) {
      return output;
    }

    var gymName = readValue([
      "#gymName",
      "#gym-name",
      "#gym",
      "[name='gymName']",
      "[name='gym-name']",
      "[name='gym']"
    ]);

    var location = readValue([
      "#gymLocation",
      "#gym-location",
      "#location",
      "[name='location']",
      "[name='gymLocation']",
      "[name='gym-location']"
    ]);

    var note = readValue([
      "#gymNote",
      "#gym-note",
      "#publicNote",
      "#public-note",
      "[name='note']",
      "[name='publicNote']",
      "[name='public-note']"
    ]);

    var lines = [];

    if (gymName) {
      lines.push(gymName);
    }

    if (location) {
      lines.push(location);
    }

    if (note) {
      lines.push(note);
    }

    if (lines.length > 0) {
      return lines.join("\n");
    }

    return "Enter gym details before printing QR.";
  }

  function findButtonHost() {
    var directHosts = [
      ".tool-form",
      ".calculator-grid",
      ".tool-card",
      ".active-tool",
      ".tool-panel",
      "main"
    ];

    var buttons = Array.prototype.slice.call(document.querySelectorAll("button, .button"));

    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      var text = (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

      if (
        text.indexOf("generate") !== -1 ||
        text.indexOf("share") !== -1 ||
        text.indexOf("copy") !== -1
      ) {
        return button.parentElement || button.closest(".tool-form") || button.closest(".tool-card") || button.closest("section");
      }
    }

    for (var j = 0; j < directHosts.length; j += 1) {
      var host = document.querySelector(directHosts[j]);

      if (host) {
        return host;
      }
    }

    return document.body;
  }

  function ensurePrintButton() {
    var existing = document.getElementById("gymSharePrintQr");

    if (existing) {
      return existing;
    }

    var button = document.createElement("button");
    button.className = "button button-secondary gym-share-print-qr-button";
    button.id = "gymSharePrintQr";
    button.type = "button";
    button.textContent = "Print QR";

    var host = findButtonHost();
    host.appendChild(button);

    return button;
  }

  function ensurePrintPanel() {
    var existing = document.getElementById("gymShareQrPrintPanel");

    if (existing) {
      return existing;
    }

    var panel = document.createElement("section");
    panel.className = "gym-share-qr-print-panel";
    panel.id = "gymShareQrPrintPanel";
    panel.setAttribute("aria-hidden", "true");

    panel.innerHTML =
      '<div class="qr-print-card">' +
        '<p class="kicker">GYM SHARE QR</p>' +
        '<h2 id="gymShareQrTitle">Gym Share</h2>' +
        '<img class="qr-image" id="gymShareQrImage" alt="Gym Share QR code">' +
        '<pre id="gymShareQrPayload"></pre>' +
        '<p class="qr-print-note">Scan the QR code or use the printed details below.</p>' +
      '</div>';

    var main = document.querySelector("main") || document.body;
    main.appendChild(panel);

    return panel;
  }

  function bindGymShareQrPrint() {
    if (!isGymSharePage()) {
      return;
    }

    ensurePrintPanel();

    var button = ensurePrintButton();

    if (!button || button.dataset.bound === "true") {
      return;
    }

    button.dataset.bound = "true";

    button.addEventListener("click", function () {
      var payload = getGymShareText();
      var qrImage = document.getElementById("gymShareQrImage");
      var qrPayload = document.getElementById("gymShareQrPayload");
      var qrTitle = document.getElementById("gymShareQrTitle");

      if (qrTitle) {
        var firstLine = payload.split(/\r?\n/).filter(Boolean)[0];
        qrTitle.textContent = firstLine || "Gym Share";
      }

      if (qrPayload) {
        qrPayload.textContent = payload;
      }

      if (qrImage) {
        qrImage.onload = function () {
          window.setTimeout(function () {
            window.print();
          }, 120);
        };

        qrImage.onerror = function () {
          window.print();
        };

        qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&data=" + encodeURIComponent(payload);
      }
      else {
        window.print();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindGymShareQrPrint);
  }
  else {
    bindGymShareQrPrint();
  }
})();

/* === GYM SHARE PRINT QR END === */
