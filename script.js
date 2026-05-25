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

function clearResultForTool(name) {
  if (name === "Event Block Calculator") {
    resultState.textContent = "AWAITING INPUT";
    resultTitle.textContent = "Choose an event date to generate block dates.";
    blockStart.textContent = """;
    taperStart.textContent = """;
    eventDateOut.textContent = """;
    return;
  }

  resultState.textContent = "TOOL SELECTED";
  resultTitle.textContent = "This tool slot is ready for its functional implementation.";
  blockStart.textContent = """;
  taperStart.textContent = """;
  eventDateOut.textContent = """;
}

function selectTool(card, shouldScroll = true) {
  for (const item of cards) {
    item.classList.remove("is-selected");
  }

  card.classList.add("is-selected");

  const name = card.dataset.toolName || "Selected Tool";
  const shortName = card.dataset.toolShort || name;
  const status = card.dataset.toolStatus || "Available";

  previewToolName.textContent = name;
  metricSelectedTool.textContent = shortName;
  metricStatus.textContent = status;
  activeToolTitle.textContent = name;
  activeToolStatus.textContent = status;

  clearResultForTool(name);

  if (shouldScroll) {
    document.querySelector(".active-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

for (const card of cards) {
  card.addEventListener("click", () => selectTool(card));
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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedCard = document.querySelector("[data-tool-card].is-selected");
  if (!selectedCard || selectedCard.dataset.toolName !== "Event Block Calculator") {
    resultState.textContent = "TOOL SELECTED";
    resultTitle.textContent = "Select Event Block Calculator to use this calculator.";
    return;
  }

  const eventDateInput = document.getElementById("eventDate");
  const blockLengthInput = document.getElementById("blockLength");
  const taperLengthInput = document.getElementById("taperLength");

  if (!eventDateInput.value) {
    return;
  }

  const eventDate = new Date(`${eventDateInput.value}T12:00:00`);
  const blockWeeks = Number(blockLengthInput.value);
  const taperWeeks = Number(taperLengthInput.value);

  const calculatedBlockStart = addDays(eventDate, -(blockWeeks * 7));
  const calculatedTaperStart = addDays(eventDate, -(taperWeeks * 7));

  resultState.textContent = "CALCULATED";
  resultTitle.textContent = `${blockWeeks}-week block generated for the selected event date.`;
  blockStart.textContent = formatDate(calculatedBlockStart);
  taperStart.textContent = taperWeeks === 0 ? "No taper" : formatDate(calculatedTaperStart);
  eventDateOut.textContent = formatDate(eventDate);
});

const initialCard = document.querySelector("[data-tool-card].is-selected");
if (initialCard) {
  selectTool(initialCard, false);
}