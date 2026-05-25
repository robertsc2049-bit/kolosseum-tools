const cards = Array.from(document.querySelectorAll("[data-tool-card]"));
const previewToolName = document.getElementById("preview-tool-name");
const previewToolStatus = document.getElementById("preview-tool-status");
const activeToolTitle = document.getElementById("active-tool-title");
const activeToolStatus = document.getElementById("active-tool-status");

function selectTool(card) {
  for (const item of cards) {
    item.classList.remove("is-selected");
  }

  card.classList.add("is-selected");

  const name = card.dataset.toolName || "Selected Tool";
  const status = card.dataset.toolStatus || "Available";

  previewToolName.textContent = name;
  previewToolStatus.textContent = status;
  activeToolTitle.textContent = name;
  activeToolStatus.textContent = status;

  if (name !== "Event Block Calculator") {
    document.querySelector(".result-kicker").textContent = "Tool selected";
    document.querySelector("#resultCard h3").textContent = "This tool slot is ready for its functional implementation.";
    document.getElementById("blockStart").textContent = "—";
    document.getElementById("taperStart").textContent = "—";
    document.getElementById("eventDateOut").textContent = "—";
  } else {
    document.querySelector(".result-kicker").textContent = "Awaiting input";
    document.querySelector("#resultCard h3").textContent = "Choose an event date to generate block dates.";
  }

  document.getElementById("active-tool").scrollIntoView({ behavior: "smooth", block: "start" });
}

for (const card of cards) {
  card.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("[data-tool-action]")) {
      event.preventDefault();
    }

    selectTool(card);
  });
}

const form = document.getElementById("eventBlockForm");

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

  const eventDateInput = document.getElementById("eventDate");
  const blockLengthInput = document.getElementById("blockLength");
  const taperLengthInput = document.getElementById("taperLength");

  if (!eventDateInput.value) {
    return;
  }

  const eventDate = new Date(`${eventDateInput.value}T12:00:00`);
  const blockWeeks = Number(blockLengthInput.value);
  const taperWeeks = Number(taperLengthInput.value);

  const blockStart = addDays(eventDate, -(blockWeeks * 7));
  const taperStart = addDays(eventDate, -(taperWeeks * 7));

  document.querySelector(".result-kicker").textContent = "Calculated";
  document.querySelector("#resultCard h3").textContent = `${blockWeeks}-week block generated for the selected event date.`;
  document.getElementById("blockStart").textContent = formatDate(blockStart);
  document.getElementById("taperStart").textContent = taperWeeks === 0 ? "No taper" : formatDate(taperStart);
  document.getElementById("eventDateOut").textContent = formatDate(eventDate);
});
