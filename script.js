const form = document.getElementById("commentForm");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("statusMessage");
const versionBadge = document.getElementById("versionBadge");

const appConfig = window.APP_CONFIG || {};
const scriptUrl = appConfig.googleScriptUrl || "";

function setStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("is-success", "is-error");

  if (type) {
    statusMessage.classList.add(type === "success" ? "is-success" : "is-error");
  }
}

async function loadVersion() {
  try {
    const response = await fetch(`version.json?ts=${Date.now()}`);
    if (!response.ok) {
      throw new Error("Version file not found");
    }

    const data = await response.json();
    const parts = [`Version ${data.version || "dev"}`];

    if (data.commit) {
      parts.push(`(${data.commit})`);
    }

    versionBadge.textContent = parts.join(" ");
  } catch (error) {
    versionBadge.textContent = "Version dev-local";
  }
}

function validateConfig() {
  return (
    typeof scriptUrl === "string" &&
    scriptUrl.length > 0 &&
    !scriptUrl.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");

  if (!validateConfig()) {
    setStatus(
      "Google Apps Script URL is not configured yet. Update config.js first.",
      "error"
    );
    return;
  }

  const formData = new FormData(form);

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    form.reset();
    setStatus("Submitted successfully. Your response should appear in the sheet shortly.", "success");
  } catch (error) {
    setStatus("Submission failed. Please try again in a moment.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});

loadVersion();
