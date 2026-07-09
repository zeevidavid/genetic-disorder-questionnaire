function isLoggedIn() {
  return !!sessionStorage.getItem("reviewer");
}

function requireLogin() {
  if (!isLoggedIn()) {
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("app").style.display = "none";

    return false;
  }

  return true;
}

window.addEventListener("load", () => {
  if (isLoggedIn()) {
    const reviewer = sessionStorage.getItem("reviewer");

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";

    const el = document.getElementById("reviewerDisplay");
    if (el) el.textContent = reviewer;

    function initApp() {
      // Prevent double-binding (important when login/logout happens)
      if (window.__appInitialized) return;
      window.__appInitialized = true;

      // Logout
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
      }

      // Save
      const saveBtn = document.getElementById("saveBtn");
      if (saveBtn) {
        saveBtn.addEventListener("click", saveEvaluation);
      }

      // Reset
      const resetBtn = document.getElementById("resetBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", resetCase);
      }

      console.log("App initialized");
    }

    // optional: initialize app
    if (typeof initApp === "function") initApp();
  } else {
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("app").style.display = "none";
  }
});

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
 * STATE: stores all answers and "show" variants and comments
 */
const answers = {};
const variantLookup = {};
const comments = {};

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const errorBox = document.getElementById("loginError");
  errorBox.textContent = "";

  if (!username || !password) {
    errorBox.textContent = "Please enter username and password";
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username,
        password,
      }),
    });

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    const data = JSON.parse(text);

    if (!data.success) {
      errorBox.textContent = data.error || "Invalid credentials";
      return;
    }

    // -----------------------------
    // Store authenticated session
    // -----------------------------
    sessionStorage.setItem("reviewer", data.reviewer);
    sessionStorage.setItem("role", data.role || "");

    // Update reviewer display (if present)
    const reviewerDisplay = document.getElementById("reviewerDisplay");
    if (reviewerDisplay) {
      reviewerDisplay.textContent = data.reviewer;
    }

    // Show application
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";

    // -----------------------------
    // Fresh evaluation
    // -----------------------------
    localStorage.removeItem(STORAGE_KEY);

    await loadVariants();

    resetCase();

    // Initialize application (only once)
    if (typeof initApp === "function") {
      initApp();
    }

    // Put cursor on Variant selector
    document.getElementById("variant")?.focus();

    console.log("Login successful:", data.reviewer);
  } catch (err) {
    console.error(err);
    errorBox.textContent = "Server error. Please try again.";
  }
}

async function loadVariants() {
  const select = document.getElementById("variant");

  select.innerHTML = '<option value="">Select a variant...</option>';

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "variants",
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    data.variants.forEach((v) => {
      // Key lookup by MutID
      variantLookup[v.mutID] = v;

      const option = document.createElement("option");

      option.value = v.mutID;

      option.textContent = v.variant;

      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);

    select.innerHTML = '<option value="">Unable to load variants</option>';
  }
}

document.getElementById("variant").addEventListener("change", function () {
  const v = variantLookup[this.value];

  if (!v) {
    document.getElementById("gene").value = "";
    document.getElementById("disease").value = "";

    return;
  }

  document.getElementById("gene").value = v.gene;
  document.getElementById("disease").value = v.disease;

  saveDraft();
});

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

function createScale(question) {
  const scaleContainer = document.createElement("div");
  scaleContainer.className = "rubric";

  question.rubric.forEach((item) => {
    const row = document.createElement("label");
    row.className = "rubricRow";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = question.id;
    radio.value = item.score;

    radio.addEventListener("change", () => {
      answers[question.id] = item.score;

      updateScores();
      updateGlobalProgress();
      checkAutoAdvance();
      saveDraft();

      Object.values(sectionRegistry).forEach((section) => {
        section.updateHeader();
      });
    });

    const score = document.createElement("span");
    score.className = "rubricScore";
    score.textContent = item.score;

    const text = document.createElement("span");
    text.className = "rubricLabel";
    text.textContent = item.label;

    row.appendChild(radio);
    row.appendChild(score);
    row.appendChild(text);

    scaleContainer.appendChild(row);
  });

  return scaleContainer;
}

/*
 * UPDATE SCORES
 */
function updateScores() {
  const sectionTotals = {
    severity: { sum: 0, answered: 0 },
    evidence: { sum: 0, answered: 0 },
    utility: { sum: 0, answered: 0 },
  };

  questionnaire.forEach((q) => {
    const key = getSectionKey(q.section);
    if (!key) return;

    const value = answers[q.id];

    if (value !== undefined && value !== null) {
      sectionTotals[key].sum += Number(value);
      sectionTotals[key].answered++;
    }
  });

  function average(section) {
    if (section.answered === 0) return 0;
    return section.sum / section.answered;
  }

  function normalize(avg4Point) {
    // No answers yet
    if (avg4Point === 0) return 0;

    // Convert 1–4 scale to 0–10
    return ((avg4Point - 1) / 3) * 10;
  }

  const severityAvg = average(sectionTotals.severity);
  const evidenceAvg = average(sectionTotals.evidence);
  const utilityAvg = average(sectionTotals.utility);

  const severity = normalize(severityAvg);
  const evidence = normalize(evidenceAvg);
  const utility = normalize(utilityAvg);

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
    const textarea = document.createElement("textarea");

    textarea.rows = 3;
    textarea.placeholder = "Comments (optional)";
    textarea.dataset.question = question.id;

    // Restore draft (if one exists)
    if (comments[question.id]) {
      textarea.value = comments[question.id];
    }

    // Keep comments object up to date
    textarea.addEventListener("input", () => {
      comments[question.id] = textarea.value.trim();

      saveDraft();
    });

    div.appendChild(textarea);
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
      variant: document.getElementById("variant")?.value || "", // MutID
      date: document.getElementById("date")?.value || "",
    },

    answers: { ...answers },

    comments: { ...comments },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const data = JSON.parse(raw);

  // restore metadata
  if (data.meta) {
    document.getElementById("date").value = data.meta.date || "";

    if (data.meta.variant) {
      const select = document.getElementById("variant");

      select.value = data.meta.variant;

      // Populate Disease/Gene from the lookup
      select.dispatchEvent(new Event("change"));
    }
  }

  // restore answers
  if (data.answers) {
    Object.assign(answers, data.answers);
  }

  if (data.comments) {
    Object.assign(comments, data.comments);
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
  // 1. Clear answers
  Object.keys(answers).forEach((k) => delete answers[k]);

  // 2. Clear comments
  Object.keys(comments).forEach((k) => delete comments[k]);

  // 3. Reset Variant dropdown
  const variant = document.getElementById("variant");
  if (variant) {
    variant.selectedIndex = 0;
  }

  // 4. Clear automatically populated fields
  document.getElementById("disease").value = "";
  document.getElementById("gene").value = "";

  // 5. Reset today's date
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").value = today;

  // 6. Clear radio buttons
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.checked = false;
  });

  // 7. Clear comment textareas
  document.querySelectorAll("textarea").forEach((t) => {
    t.value = "";
  });

  // 8. Remove saved draft
  localStorage.removeItem(STORAGE_KEY);

  // 9. Reset section auto-advance
  Object.keys(sectionState).forEach((k) => {
    sectionState[k] = false;
  });

  // 10. Close every section
  Object.values(sectionRegistry).forEach((section) => {
    section.closeSection();
  });

  // 11. Open the first section
  const firstSection = Object.keys(sectionRegistry)[0];
  if (firstSection) {
    sectionRegistry[firstSection].openSection();
  }

  // 12. Refresh UI
  updateScores();
  updateGlobalProgress();

  Object.values(sectionRegistry).forEach((section) => {
    section.updateHeader();
  });

  // 13. Focus Variant selector
  variant?.focus();
}

function buildSubmission() {
  const selected = variantLookup[document.getElementById("variant").value];
  const commentText = Object.entries(comments)
    .filter(([id, text]) => text && text.trim() !== "")
    .map(([id, text]) => `${id}: ${text}`)
    .join("; ");

  return {
    variant: selected ? selected.variant : "",

    mutID: selected ? selected.mutID : "",

    dyDis: selected ? selected.dyDis : "",

    dyMut: selected ? selected.dyMut : "",

    disease: selected ? selected.disease : "",

    gene: selected ? selected.gene : "",

    // Reviewer comes from the login session
    reviewer: sessionStorage.getItem("reviewer") || "",

    reviewDate: document.getElementById("date").value,

    severityScore: parseFloat(scoreElements.severity.textContent),

    evidenceScore: parseFloat(scoreElements.evidence.textContent),

    utilityScore: parseFloat(scoreElements.utility.textContent),

    priorityScore: parseFloat(scoreElements.overall.textContent),

    completionPercent: Math.round(
      (Object.keys(answers).length / questionnaire.length) * 100,
    ),

    answers: { ...answers },

    comments: commentText,
  };
}

async function saveEvaluation() {
  if (!requireLogin()) return;
  const payload = buildSubmission();
  payload.action = "submit";

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
      resetCase();
    } else {
      alert("Submission failed:\n" + result.error);
    }
  } catch (err) {
    alert("Network error:\n\n" + err);
  }
}

let lastActivity = Date.now();
const TIMEOUT = 30 * 60 * 1000; // 30 minutes

document.addEventListener("click", () => (lastActivity = Date.now()));
document.addEventListener("keydown", () => (lastActivity = Date.now()));

setInterval(() => {
  if (!isLoggedIn()) return;

  if (Date.now() - lastActivity > TIMEOUT) {
    alert("Session expired. Please log in again.");

    sessionStorage.clear();

    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("app").style.display = "none";
  }
}, 60000);

function logout() {
  sessionStorage.clear();

  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("app").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const dateField = document.getElementById("date");

  if (dateField) {
    const today = new Date().toISOString().split("T")[0];
    dateField.value = today;
  }
});

document.getElementById("loginBtn").addEventListener("click", login);
//document.getElementById("saveBtn").addEventListener("click", () => {
//  if (!requireLogin()) return;

//  saveEvaluation(); // your existing function
//});
//document.getElementById("logoutBtn").addEventListener("click", logout);

function attachMetaAutoSave() {
  ["disease", "gene", "variant", "reviewer", "date"].forEach((id) => {
    const el = document.getElementById(id);

    if (el) {
      el.addEventListener("input", saveDraft);
      el.addEventListener("change", saveDraft);
    }
  });
}

fetch(API_URL, {
  method: "POST",
  body: JSON.stringify({ action: "variants" }),
})
  .then((r) => r.json())
  .then(console.log);

async function initializeQuestionnaire() {
  renderQuestionnaire();

  await loadVariants();

  //loadDraft();

  restoreAnswerUI();

  attachMetaAutoSave();

  initScoreElements();
  updateScores();
  updateGlobalProgress();
}

initializeQuestionnaire();

document.getElementById("resetBtn")?.addEventListener("click", resetCase);
