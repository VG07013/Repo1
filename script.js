const form = document.getElementById("commentForm");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("statusMessage");
const versionBadge = document.getElementById("versionBadge");
const captchaQuestion = document.getElementById("captchaQuestion");
const captchaAnswer = document.getElementById("captchaAnswer");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const appConfig = window.APP_CONFIG || {};
const scriptUrl = appConfig.googleScriptUrl || "";
let expectedCaptchaAnswer = Number(captchaQuestion.dataset.answer || "7");
const namePattern = /^[A-Za-z ]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitsPattern = /^\d+$/;

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

function updateSubmitState() {
  submitButton.disabled = Number(captchaAnswer.value) !== expectedCaptchaAnswer;
}

function validateFormFields() {
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!fullName || !namePattern.test(fullName)) {
    setStatus("Name can contain only letters and spaces.", "error");
    fullNameInput.focus();
    return false;
  }

  if (email && !emailPattern.test(email)) {
    setStatus("If you enter an email address, it must be in a valid format.", "error");
    emailInput.focus();
    return false;
  }

  if (!phone || !digitsPattern.test(phone)) {
    setStatus("Phone number can contain digits only.", "error");
    phoneInput.focus();
    return false;
  }

  return true;
}

function generateCaptcha() {
  const firstNumber = Math.floor(Math.random() * 8) + 2;
  const secondNumber = Math.floor(Math.random() * 8) + 2;
  expectedCaptchaAnswer = firstNumber + secondNumber;
  captchaQuestion.textContent = `What is ${firstNumber} + ${secondNumber}?`;
  captchaAnswer.value = "";
  updateSubmitState();
}

fullNameInput.addEventListener("input", () => {
  fullNameInput.value = fullNameInput.value.replace(/[^A-Za-z ]+/g, "");
});

phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D+/g, "");
});

captchaAnswer.addEventListener("input", () => {
  setStatus("");
  updateSubmitState();
});

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

  if (!validateFormFields()) {
    return;
  }

  if (Number(captchaAnswer.value) !== expectedCaptchaAnswer) {
    setStatus("CAPTCHA answer is incorrect. Please try again.", "error");
    generateCaptcha();
    captchaAnswer.focus();
    return;
  }

  const formData = new FormData(form);
  formData.delete("captchaAnswer");

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    form.reset();
    generateCaptcha();
    setStatus(
      "Submitted successfully. The name, email, and phone number should appear in your sheet shortly.",
      "success"
    );
  } catch (error) {
    setStatus("Submission failed. Please try again in a moment.", "error");
  } finally {
    submitButton.textContent = "Submit";
    updateSubmitState();
  }
});

generateCaptcha();
loadVersion();
