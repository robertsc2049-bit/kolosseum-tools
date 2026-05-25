const KG_TO_LB = 2.2046226218;
const LB_TO_KG = 0.45359237;
const PLATE_SETTINGS_KEY = "kolosseum-ironclock-plate-settings-v2";
const DEFAULT_AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

const targetWeightInput = document.getElementById("targetWeightInput");
const unitSelect = document.getElementById("unitSelect");
const loadedWeight = document.getElementById("loadedWeight");
const exactStatus = document.getElementById("exactStatus");
const roundingNote = document.getElementById("roundingNote");
const barbellVisual = document.getElementById("barbellVisual");
const plateList = document.getElementById("plateList");
const plateSummary = document.getElementById("plateSummary");
const barStatus = document.getElementById("barStatus");

const barButtons = Array.from(document.querySelectorAll(".segment-btn"));
const collarButtons = Array.from(document.querySelectorAll(".collar-btn"));
const allPlateButtons = Array.from(document.querySelectorAll(".plate-toggle"));

const timerDisplay = document.getElementById("timerDisplay");
const overlayTimerDisplay = document.getElementById("overlayTimerDisplay");
const timerStatus = document.getElementById("timerStatus");
const customMinutesInput = document.getElementById("customMinutesInput");
const customSecondsInput = document.getElementById("customSecondsInput");
const startPauseBtn = document.getElementById("startPauseBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const maximiseTimerBtn = document.getElementById("maximiseTimerBtn");
const timerOverlay = document.getElementById("timerOverlay");
const closeOverlayBtn = document.getElementById("closeOverlayBtn");
const overlayStartPauseBtn = document.getElementById("overlayStartPauseBtn");
const overlayResetBtn = document.getElementById("overlayResetBtn");
const shareToolBtn = document.getElementById("shareToolBtn");

let barWeightKg = 0;
let collarsKg = 0;

let selectedSeconds = 180;
let remainingSeconds = 180;
let timerInterval = null;
let timerRunning = false;

function roundTo(value, decimals = 2) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function displayNumber(value) {
  const rounded = roundTo(value, 2);
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function convertToKg(value, unit) {
  return unit === "kg" ? value : value * LB_TO_KG;
}

function convertFromKg(valueKg, unit) {
  return unit === "kg" ? valueKg : valueKg * KG_TO_LB;
}

function getAllPlateValues() {
  const values = new Set();

  allPlateButtons.forEach(function (button) {
    const plate = Number(button.dataset.plate);
    if (Number.isFinite(plate)) {
      values.add(plate);
    }
  });

  return Array.from(values);
}

function setPlateAvailability(plate, isActive) {
  allPlateButtons.forEach(function (button) {
    if (Number(button.dataset.plate) === plate) {
      button.classList.toggle("active", isActive);
    }
  });
}

function applyPlateAvailability(availablePlates) {
  const available = new Set(availablePlates.map(Number));

  getAllPlateValues().forEach(function (plate) {
    setPlateAvailability(plate, available.has(plate));
  });
}

function getAvailablePlates() {
  const available = new Set();

  allPlateButtons.forEach(function (button) {
    if (button.classList.contains("active")) {
      available.add(Number(button.dataset.plate));
    }
  });

  return Array.from(available).sort(function (a, b) {
    return b - a;
  });
}

function savePlateSettings() {
  try {
    window.localStorage.setItem(PLATE_SETTINGS_KEY, JSON.stringify(getAvailablePlates()));
  }
  catch {
    return;
  }
}

function loadSavedPlateSettings() {
  try {
    const saved = window.localStorage.getItem(PLATE_SETTINGS_KEY);

    if (!saved) {
      applyPlateAvailability(DEFAULT_AVAILABLE_PLATES);
      return;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      applyPlateAvailability(DEFAULT_AVAILABLE_PLATES);
      return;
    }

    const validValues = new Set(getAllPlateValues());
    const clean = parsed
      .map(Number)
      .filter(function (value) {
        return Number.isFinite(value) && validValues.has(value);
      });

    applyPlateAvailability(clean.length ? clean : DEFAULT_AVAILABLE_PLATES);
  }
  catch {
    applyPlateAvailability(DEFAULT_AVAILABLE_PLATES);
  }
}

function updateBarStatus() {
  if (barWeightKg > 0) {
    barStatus.textContent = "Current bar weight: " + displayNumber(barWeightKg) + "kg.";
  }
  else {
    barStatus.textContent = "Bar not selected. Current bar weight: 0kg.";
  }
}

function updatePlateSummary() {
  const plates = getAvailablePlates();
  plateSummary.textContent = "Available plates: " + plates.map(function (plate) {
    return displayNumber(plate) + "kg";
  }).join(", ");
}

function renderSelectBarPlaceholder() {
  barbellVisual.innerHTML = "";

  const placeholder = document.createElement("div");
  placeholder.className = "barbell-placeholder";
  placeholder.textContent = "Select bar";
  barbellVisual.appendChild(placeholder);
}

function resetBarbellVisual(message = "Select a bar and enter a target weight.") {
  loadedWeight.textContent = "0 kg";
  exactStatus.textContent = "Unset";
  exactStatus.classList.add("warning");
  roundingNote.textContent = message;
  plateList.textContent = "Per side: no plates selected";
  renderSelectBarPlaceholder();
  updateBarStatus();
  updatePlateSummary();
}

function getPlateClass(plate) {
  if (plate >= 25) return "plate-red";
  if (plate >= 20) return "plate-blue";
  if (plate >= 15) return "plate-yellow";
  if (plate >= 10) return "plate-green";
  if (plate >= 5) return "plate-white";
  if (plate >= 2.5) return "plate-black";
  return "plate-small";
}

function renderBarbell(plates, unit = "kg") {
  barbellVisual.innerHTML = "";

  const shaft = document.createElement("div");
  shaft.className = "bar-shaft";
  barbellVisual.appendChild(shaft);

  const sleeve = document.createElement("div");
  sleeve.className = "bar-sleeve";
  barbellVisual.appendChild(sleeve);

  plates.forEach(function (plate) {
    const plateEl = document.createElement("div");
    plateEl.className = "bar-plate " + getPlateClass(plate);

    const label = document.createElement("span");
    label.textContent = displayNumber(convertFromKg(plate, unit));
    plateEl.appendChild(label);

    barbellVisual.appendChild(plateEl);
  });

  if (collarsKg > 0) {
    const collar = document.createElement("div");
    collar.className = "bar-collar";
    barbellVisual.appendChild(collar);
  }

  const sleeveEnd = document.createElement("div");
  sleeveEnd.className = "bar-sleeve-end";
  barbellVisual.appendChild(sleeveEnd);
}

function renderResult(result) {
  const loadedDisplay = convertFromKg(result.loadedKg, result.unit);
  loadedWeight.textContent = displayNumber(loadedDisplay) + " " + result.unit;

  exactStatus.textContent = result.exact ? "Exact" : "Rounded";
  exactStatus.classList.toggle("warning", !result.exact);

  if (result.exact) {
    roundingNote.textContent = "Exact load available with selected plates.";
  }
  else {
    const targetKg = convertToKg(result.targetInput, result.unit);
    const difference = convertFromKg(result.loadedKg - targetKg, result.unit);
    const direction = difference > 0 ? "up" : "down";
    roundingNote.textContent = "Target cannot be loaded exactly with selected plates. Rounded " + direction + " by " + displayNumber(Math.abs(difference)) + " " + result.unit + ".";
  }

  const plateText = result.plates.length
    ? result.plates.map(function (plate) {
      return displayNumber(convertFromKg(plate, result.unit)) + " " + result.unit;
    }).join(" + ")
    : "No plates per side";

  plateList.textContent = "Per side: " + plateText;
  renderBarbell(result.plates, result.unit);
}

function calculateLoad() {
  const unit = unitSelect.value;
  const rawTarget = targetWeightInput.value.trim();

  if (barWeightKg <= 0) {
    resetBarbellVisual("Select a bar before calculating plate loading.");
    return;
  }

  if (rawTarget === "") {
    resetBarbellVisual("Enter a target weight.");
    return;
  }

  const targetInput = Number(rawTarget);

  if (!Number.isFinite(targetInput) || targetInput <= 0) {
    resetBarbellVisual("Enter a valid target weight.");
    return;
  }

  const targetKg = convertToKg(targetInput, unit);
  const availablePlates = getAvailablePlates();

  let remainingPerSide = (targetKg - barWeightKg - collarsKg) / 2;

  if (remainingPerSide < 0 || availablePlates.length === 0) {
    renderResult({
      unit,
      targetInput,
      loadedKg: barWeightKg + collarsKg,
      plates: [],
      exact: false
    });
    updateBarStatus();
    updatePlateSummary();
    return;
  }

  const plates = [];

  for (const plate of availablePlates) {
    while (remainingPerSide + 0.0001 >= plate) {
      plates.push(plate);
      remainingPerSide -= plate;
    }
  }

  const platesPerSideKg = plates.reduce(function (total, plate) {
    return total + plate;
  }, 0);

  const loadedKg = barWeightKg + collarsKg + platesPerSideKg * 2;
  const exact = Math.abs(loadedKg - targetKg) < 0.001;

  renderResult({
    unit,
    targetInput,
    loadedKg,
    plates,
    exact
  });

  updateBarStatus();
  updatePlateSummary();
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function updateTimerDisplay() {
  const formatted = formatTime(remainingSeconds);

  timerDisplay.textContent = formatted;
  overlayTimerDisplay.textContent = formatted;
  startPauseBtn.textContent = timerRunning ? "Pause" : "Start";
  overlayStartPauseBtn.textContent = timerRunning ? "Pause" : "Start";
  timerStatus.textContent = timerRunning ? "Running" : "Ready";
}

function stopTimer() {
  timerRunning = false;

  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }

  updateTimerDisplay();
}

function setTimer(seconds) {
  stopTimer();
  selectedSeconds = Math.max(0, seconds);
  remainingSeconds = selectedSeconds;
  customMinutesInput.value = Math.floor(selectedSeconds / 60);
  customSecondsInput.value = selectedSeconds % 60;
  updateTimerDisplay();
}

function startTimer() {
  if (remainingSeconds <= 0) {
    remainingSeconds = selectedSeconds;
  }

  if (timerRunning) {
    return;
  }

  timerRunning = true;

  timerInterval = window.setInterval(function () {
    remainingSeconds -= 1;

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      stopTimer();
      return;
    }

    updateTimerDisplay();
  }, 1000);

  updateTimerDisplay();
}

function toggleTimer() {
  if (timerRunning) {
    stopTimer();
  }
  else {
    startTimer();
  }
}

function resetTimer() {
  stopTimer();
  remainingSeconds = selectedSeconds;
  updateTimerDisplay();
}

async function shareTool() {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Kolosseum IronClock",
        text: "Free barbell calculator and rest timer.",
        url
      });
    }
    catch {
      return;
    }
  }
  else if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    shareToolBtn.textContent = "Link copied";
    window.setTimeout(function () {
      shareToolBtn.textContent = "Share";
    }, 1500);
  }
}

barButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    barButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const nextBarWeight = Number(button.dataset.bar);
    barWeightKg = Number.isFinite(nextBarWeight) && nextBarWeight > 0 ? nextBarWeight : 0;

    calculateLoad();
  });
});

collarButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    collarButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const nextCollars = Number(button.dataset.collars);
    collarsKg = Number.isFinite(nextCollars) && nextCollars >= 0 ? nextCollars : 0;

    calculateLoad();
  });
});

allPlateButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const plate = Number(button.dataset.plate);
    const nextState = !button.classList.contains("active");

    setPlateAvailability(plate, nextState);
    savePlateSettings();
    calculateLoad();
  });
});

targetWeightInput.addEventListener("input", calculateLoad);
unitSelect.addEventListener("change", calculateLoad);

document.querySelectorAll(".time-preset").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll(".time-preset").forEach(function (preset) {
      preset.classList.remove("active");
    });

    button.classList.add("active");
    setTimer(Number(button.dataset.seconds));
  });
});

[customMinutesInput, customSecondsInput].forEach(function (input) {
  input.addEventListener("input", function () {
    const minutes = Math.max(0, Number(customMinutesInput.value) || 0);
    const seconds = Math.max(0, Math.min(59, Number(customSecondsInput.value) || 0));

    document.querySelectorAll(".time-preset").forEach(function (preset) {
      preset.classList.remove("active");
    });

    setTimer(minutes * 60 + seconds);
  });
});

startPauseBtn.addEventListener("click", toggleTimer);
overlayStartPauseBtn.addEventListener("click", toggleTimer);
resetTimerBtn.addEventListener("click", resetTimer);
overlayResetBtn.addEventListener("click", resetTimer);

maximiseTimerBtn.addEventListener("click", function () {
  timerOverlay.classList.add("open");
  timerOverlay.setAttribute("aria-hidden", "false");
});

closeOverlayBtn.addEventListener("click", function () {
  timerOverlay.classList.remove("open");
  timerOverlay.setAttribute("aria-hidden", "true");
});

timerOverlay.addEventListener("click", function (event) {
  if (event.target === timerOverlay) {
    timerOverlay.classList.remove("open");
    timerOverlay.setAttribute("aria-hidden", "true");
  }
});

shareToolBtn.addEventListener("click", shareTool);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    timerOverlay.classList.remove("open");
    timerOverlay.setAttribute("aria-hidden", "true");
  }
});

loadSavedPlateSettings();
resetBarbellVisual();
updateTimerDisplay();