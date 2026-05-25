const cards = Array.from(document.querySelectorAll("[data-tool-card]"));

const previewToolName = document.getElementById("preview-tool-name");
const metricSelectedTool = document.getElementById("metric-selected-tool");
const metricStatus = document.getElementById("metric-status");
const activeToolTitle = document.getElementById("active-tool-title");
const activeToolStatus = document.getElementById("active-tool-status");
const resultState = document.getElementById("resultState");
const resultTitle = document.getElementById("resultTitle");
const blockStart = document.getElementById("blockStart");
const taperStart = document.getElementById("taperStart");
const eventDateOut = document.getElementById("eventDateOut");
const form = document.getElementById("eventBlockForm");

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function clearResultForTool(name) {
  if (name === "Event Block Calculator") {
    setText(resultState, "AWAITING INPUT");
    setText(resultTitle, "Choose an event date to generate block dates.");
    setText(blockStart, "-");
    setText(taperStart, "-");
    setText(eventDateOut, "-");
    return;
  }

  setText(resultState, "TOOL SELECTED");
  setText(resultTitle, "This tool slot is ready for its functional implementation.");
  setText(blockStart, "-");
  setText(taperStart, "-");
  setText(eventDateOut, "-");
}

function selectTool(card) {
  for (const item of cards) {
    item.classList.remove("is-selected");
  }

  card.classList.add("is-selected");

  const name = card.dataset.toolName || "Selected Tool";
  const shortName = card.dataset.toolShort || name;
  const status = card.dataset.toolStatus || "Available";

  setText(previewToolName, name);
  setText(metricSelectedTool, shortName);
  setText(metricStatus, status);
  setText(activeToolTitle, name);
  setText(activeToolStatus, status);

  clearResultForTool(name);
}

for (const card of cards) {
  card.addEventListener("click", function () {
    selectTool(card);
  });
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

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedCard = document.querySelector("[data-tool-card].is-selected");
    if (!selectedCard || selectedCard.dataset.toolName !== "Event Block Calculator") {
      setText(resultState, "TOOL SELECTED");
      setText(resultTitle, "Select Event Block Calculator to use this calculator.");
      return;
    }

    const eventDateInput = document.getElementById("eventDate");
    const blockLengthInput = document.getElementById("blockLength");
    const taperLengthInput = document.getElementById("taperLength");

    if (!eventDateInput || !eventDateInput.value || !blockLengthInput || !taperLengthInput) {
      return;
    }

    const eventDate = new Date(eventDateInput.value + "T12:00:00");
    const blockWeeks = Number(blockLengthInput.value);
    const taperWeeks = Number(taperLengthInput.value);

    const calculatedBlockStart = addDays(eventDate, -(blockWeeks * 7));
    const calculatedTaperStart = addDays(eventDate, -(taperWeeks * 7));

    setText(resultState, "CALCULATED");
    setText(resultTitle, String(blockWeeks) + "-week block generated for the selected event date.");
    setText(blockStart, formatDate(calculatedBlockStart));
    setText(taperStart, taperWeeks === 0 ? "No taper" : formatDate(calculatedTaperStart));
    setText(eventDateOut, formatDate(eventDate));
  });
}

const initialCard = document.querySelector("[data-tool-card].is-selected");
if (initialCard) {
  selectTool(initialCard);
}