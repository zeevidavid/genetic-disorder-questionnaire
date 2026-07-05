const API_URL =
  "https://script.google.com/macros/s/AKfycbzsI9Odp7lF4fVrWNyalh5l4d-owgRu9YkvBjVojTVOvaqfntdpByZmbVSfHihQdCqN/exec";

const sectionState = {
  "Clinical Severity": false,
  "Pathogenicity Evidence": false,
  "Screening Utility": false,
};

const sectionRegistry = {};

const container = document.getElementById("questionnaire");

const STORAGE_KEY = "genetics_questionnaire_draft";

/*
 * STATE: stores all answers
 */
const answers = {};

function getSectionProgress(sectionName) {
  let total = 0;
  let answered = 0;

  questionnaire.forEach((q) => {
    if (q.section !== sectionName) return;

    total++;

    if (answers[q.id] !== undefined && answers[q.id] !== null) {
      answered++;
    }
  });

  return {
    total,
    answered,
    percent: total === 0 ? 0 : Math.round((answered / total) * 100),
  };
}

/*
 * Score containers (we will add UI elements in HTML next step)
 */
let scoreElements = {};

function initScoreElements() {
  scoreElements = {
    severity: document.getElementById("severityScore"),
    evidence: document.getElementById("evidenceScore"),
    utility: document.getElementById("utilityScore"),
    overall: document.getElementById("overallScore"),
  };
}

/*
 * SECTION MAP
 */
function getSectionKey(sectionName) {
  if (sectionName.includes("Clinical")) return "severity";
  if (sectionName.includes("Pathogenicity")) return "evidence";
  if (sectionName.includes("Screening")) return "utility";

  return null;
}

/*
 * UPDATE SCORES
 */
function updateScores() {
  let sectionTotals = {
    severity: { sum: 0, total: 0 },
    evidence: { sum: 0, total: 0 },
    utility: { sum: 0, total: 0 },
  };

  questionnaire.forEach((q) => {
    const key = getSectionKey(q.section);
    if (!key) return;

    sectionTotals[key].total++;

    const value = answers[q.id];

    if (value) {
      sectionTotals[key].sum += parseInt(value);
    }
  });

  function avg(sum, total) {
    if (total === 0) return 0;
    return sum / total;
  }

  const severity = avg(
    sectionTotals.severity.sum,
    sectionTotals.severity.total,
  );

  const evidence = avg(
    sectionTotals.evidence.sum,
    sectionTotals.evidence.total,
  );

  const utility = avg(sectionTotals.utility.sum, sectionTotals.utility.total);

  const priorityScore = 0.45 * severity + 0.35 * evidence + 0.2 * utility;

  // Update UI
  if (scoreElements.severity)
    scoreElements.severity.textContent = severity.toFixed(2);

  if (scoreElements.evidence)
    scoreElements.evidence.textContent = evidence.toFixed(2);

  if (scoreElements.utility)
    scoreElements.utility.textContent = utility.toFixed(2);

  if (scoreElements.overall)
    scoreElements.overall.textContent = priorityScore.toFixed(2);
}

/*
 * CREATE SCALE
 */
function createScale(question) {
  const scaleContainer = document.createElement("div");
  scaleContainer.className = "scale";

  const labelRow = document.createElement("div");
  labelRow.className = "scaleLabels";

  const low = document.createElement("span");
  low.textContent = question.lowLabel;

  const high = document.createElement("span");
  high.textContent = question.highLabel;

  labelRow.appendChild(low);
  labelRow.appendChild(high);

  scaleContainer.appendChild(labelRow);

  const radioRow = document.createElement("div");
  radioRow.className = "radioRow";

  for (let i = 1; i <= 10; i++) {
    const label = document.createElement("label");

    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = question.id;
    radio.value = i;

    radio.addEventListener("change", () => {
      answers[question.id] = radio.value;

      updateScores();
      updateGlobalProgress();
      checkAutoAdvance();
      saveDraft();

      // ⭐ THIS is the missing piece
      Object.values(sectionRegistry).forEach((section) => {
        section.updateHeader();
      });
    });

    label.appendChild(radio);
    label.append(" " + i);

    radioRow.appendChild(label);
  }

  scaleContainer.appendChild(radioRow);

  return scaleContainer;
}

/*
 * CREATE QUESTION
 */
function createQuestion(question) {
  const div = document.createElement("div");
  div.className = "question";

  const title = document.createElement("h3");
  title.textContent = question.id + "   " + question.title;
  div.appendChild(title);

  const text = document.createElement("p");
  text.textContent = question.question;
  div.appendChild(text);

  if (question.help) {
    const help = document.createElement("div");
    help.className = "helpText";
    help.textContent = "ⓘ " + question.help;
    div.appendChild(help);
  }

  if (question.comments) {
    const comments = document.createElement("textarea");
    comments.rows = 3;
    comments.placeholder = "Comments (optional)";
    div.appendChild(comments);
  }

  return div;
}

/*
 * CREATE SECTION
 */
function createSection(sectionName) {
  const card = document.createElement("div");
  card.className = "sectionCard";

  const header = document.createElement("div");
  header.className = "sectionHeader";

  const content = document.createElement("div");
  content.className = "sectionContent";

  let isOpen = false; // ⭐ collapsed by default

  function updateHeader() {
    const p = getSectionProgress(sectionName);

    const icon = isOpen ? "▼" : "▶";

    header.textContent = `${icon} ${sectionName} (${p.answered}/${p.total} · ${p.percent}%)`;
  }

  function openSection() {
    isOpen = true;
    content.style.display = "block";
    updateHeader();
  }

  function closeSection() {
    isOpen = false;
    content.style.display = "none";
    updateHeader();
  }

  header.addEventListener("click", () => {
    isOpen ? closeSection() : openSection();
  });

  // ⭐ START CLOSED
  content.style.display = "none";

  card.appendChild(header);
  card.appendChild(content);

  container.appendChild(card);

  updateHeader();

  return {
    content,
    updateHeader,
    openSection,
    closeSection,
  };
}

/*
 * RENDER QUESTIONNAIRE
 */
function renderQuestionnaire() {
  let currentSection = "";
  let sectionObj = null;

  questionnaire.forEach((question) => {
    if (question.section !== currentSection) {
      currentSection = question.section;
      sectionObj = createSection(currentSection);

      // store it globally
      sectionRegistry[currentSection] = sectionObj;
    }

    const q = createQuestion(question);
    const scale = createScale(question);

    q.appendChild(scale);

    sectionObj.content.appendChild(q);
  });
}

function checkAutoAdvance() {
  const sections = Object.keys(sectionRegistry);

  for (let i = 0; i < sections.length; i++) {
    const name = sections[i];
    const section = sectionRegistry[name];

    const progress = getSectionProgress(name);

    // if complete and not yet triggered
    if (progress.percent === 100 && !sectionState[name]) {
      sectionState[name] = true;

      // open next section
      const nextName = sections[i + 1];

      if (nextName && sectionRegistry[nextName]) {
        sectionRegistry[nextName].openSection();

        // optional: scroll into view
        sectionRegistry[nextName].content.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }
}

function updateGlobalProgress() {
  let total = questionnaire.length;
  let answered = 0;

  questionnaire.forEach((q) => {
    if (answers[q.id] !== undefined && answers[q.id] !== null) {
      answered++;
    }
  });

  const percent = Math.round((answered / total) * 100);

  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  if (bar) {
    bar.style.width = percent + "%";
  }

  if (text) {
    text.textContent = percent + "% completed";
  }
}

function saveDraft() {
  const data = {
    meta: {
      disease: document.getElementById("disease")?.value || "",
      gene: document.getElementById("gene")?.value || "",
      variant: document.getElementById("variant")?.value || "",
      reviewer: document.getElementById("reviewer")?.value || "",
      date: document.getElementById("date")?.value || "",
    },
    answers: answers,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const data = JSON.parse(raw);

  // restore metadata
  if (data.meta) {
    document.getElementById("disease").value = data.meta.disease || "";
    document.getElementById("gene").value = data.meta.gene || "";
    document.getElementById("variant").value = data.meta.variant || "";
    document.getElementById("reviewer").value = data.meta.reviewer || "";
    document.getElementById("date").value = data.meta.date || "";
  }

  // restore answers
  if (data.answers) {
    Object.assign(answers, data.answers);
  }
}

function restoreAnswerUI() {
  Object.keys(answers).forEach((qid) => {
    const value = answers[qid];

    const radio = document.querySelector(
      `input[name="${qid}"][value="${value}"]`,
    );

    if (radio) {
      radio.checked = true;
    }
  });
}

function resetCase() {
  // 1. Clear local state
  Object.keys(answers).forEach((k) => delete answers[k]);

  // 2. Clear metadata fields
  ["disease", "gene", "variant", "reviewer", "date"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // 3. Clear radio buttons
  document.querySelectorAll("input[type=radio]").forEach((r) => {
    r.checked = false;
  });

  // 4. Clear localStorage
  localStorage.removeItem("genetics_questionnaire_draft");

  // 5. Reset scores + progress
  updateScores();
  updateGlobalProgress();

  // 6. Reset section states (auto-advance tracking)
  if (typeof sectionState !== "undefined") {
    Object.keys(sectionState).forEach((k) => (sectionState[k] = false));
  }

  // 7. Re-save empty state (optional but clean)
  saveDraft();
}

function buildSubmission() {
  return {
    disease: document.getElementById("disease").value.trim(),

    gene: document.getElementById("gene").value.trim(),

    variant: document.getElementById("variant").value.trim(),

    reviewer: document.getElementById("reviewer").value.trim(),

    reviewDate: document.getElementById("date").value,

    severityScore: parseFloat(scoreElements.severity.textContent),

    evidenceScore: parseFloat(scoreElements.evidence.textContent),

    utilityScore: parseFloat(scoreElements.utility.textContent),

    priorityScore: parseFloat(scoreElements.overall.textContent),

    completionPercent: Math.round(
      (Object.keys(answers).length / questionnaire.length) * 100,
    ),

    answers: { ...answers },
  };
}

async function submitEvaluation() {
  const payload = buildSubmission();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      alert(
        "Evaluation saved successfully.\n\nSubmission ID: " +
          result.submissionID,
      );

      // Optional:
      // resetCase();
    } else {
      alert("Submission failed:\n" + result.error);
    }
  } catch (err) {
    alert("Network error:\n\n" + err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dateField = document.getElementById("date");

  if (dateField) {
    const today = new Date().toISOString().split("T")[0];
    dateField.value = today;
  }
});

document.getElementById("saveBtn").addEventListener("click", submitEvaluation);

function attachMetaAutoSave() {
  ["disease", "gene", "variant", "reviewer", "date"].forEach((id) => {
    const el = document.getElementById(id);

    if (el) {
      el.addEventListener("input", saveDraft);
      el.addEventListener("change", saveDraft);
    }
  });
}

renderQuestionnaire();
loadDraft();
restoreAnswerUI();
attachMetaAutoSave();
initScoreElements();
updateScores();
updateGlobalProgress();

document.getElementById("resetBtn")?.addEventListener("click", resetCase);
