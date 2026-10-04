/*
 * GOOGLE FORMS SETUP
 * 1. Tạo Google Form với 4 câu hỏi: Nơi hẹn, Món ăn, Lời nhắn, Ngày hẹn.
 * 2. Mở "Get pre-filled link", điền thử và lấy các mã entry.xxxxx trong URL.
 * 3. Thay FORM_ACTION và các mã entry bên dưới. Không cần backend riêng.
 */
const GOOGLE_FORM = {
  FORM_ACTION: "https://docs.google.com/forms/d/e/1FAIpQLSdikvkwKddIxIBAkOG-ktBzvH5DkzFYC07l9NRolk34tfBAgQ/viewform?usp=publish-editor", // Ví dụ: https://docs.google.com/forms/d/e/FORM_ID/formResponse
  PLACE_ENTRY: "entry.373653805",
  FOOD_ENTRY: "entry.1969045336",
  MESSAGE_ENTRY: "entry.923988375",
  DATE_ENTRY: "entry.1781621852",
};

const intro = document.querySelector("#intro");
const caseFile = document.querySelector("#case-file");
const openCaseButton = document.querySelector("#open-case");
const form = document.querySelector("#date-form");
const steps = [...document.querySelectorAll(".form-step")];
const progressBar = document.querySelector("#progress-bar");
const stepCount = document.querySelector("#step-count");
const stepName = document.querySelector("#step-name");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const message = document.querySelector("#message");
const characterCount = document.querySelector("#character-count");
const dialog = document.querySelector("#success-dialog");
const closeSuccess = document.querySelector("#close-success");
const successSummary = document.querySelector("#success-summary");
const toast = document.querySelector("#toast");

const stepNames = ["Mình đi đâu nhỉ?", "Mình ăn gì nhé?", "Điều em muốn nói"];
let currentStep = 1;

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#date-choice").min = new Date().toISOString().split("T")[0];

openCaseButton.addEventListener("click", () => {
  intro.hidden = true;
  caseFile.hidden = false;
  caseFile.classList.add("is-revealed");
  window.scrollTo({ top: 0, behavior: "instant" });
  document.querySelector("#case-title").focus({ preventScroll: true });
});

message.addEventListener("input", () => {
  characterCount.textContent = message.value.length;
});

form.addEventListener("change", (event) => {
  if (event.target.matches("input[type='radio']")) {
    clearError(event.target.name);
  }
});

nextButton.addEventListener("click", async () => {
  if (!validateStep(currentStep)) return;

  if (currentStep < 3) {
    currentStep += 1;
    renderStep();
    return;
  }

  await submitMission();
});

backButton.addEventListener("click", () => {
  if (currentStep <= 1) return;
  currentStep -= 1;
  renderStep();
});

closeSuccess.addEventListener("click", () => dialog.close());

function validateStep(step) {
  const fieldName = step === 1 ? "place" : step === 2 ? "food" : "message";
  const value = fieldName === "message"
    ? message.value.trim()
    : new FormData(form).get(fieldName);

  if (!value) {
    const copy = fieldName === "place"
      ? "Em chọn một nơi mình thích trước nhé ♡"
      : fieldName === "food"
        ? "Chiếc bụng của em đang nghiêng về món nào?"
        : "Để lại cho anh ít nhất một lời nhắn nhé ♡";
    showError(fieldName, copy);
    const target = fieldName === "message" ? message : form.querySelector(`[name="${fieldName}"]`);
    target.focus();
    return false;
  }
  clearError(fieldName);
  return true;
}

function renderStep() {
  steps.forEach((step, index) => {
    const active = index + 1 === currentStep;
    step.hidden = !active;
    step.classList.toggle("is-active", active);
    step.classList.toggle("is-entering", active);
  });

  progressBar.style.transform = `scaleX(${currentStep / 3})`;
  stepCount.textContent = `${currentStep} / 3`;
  stepName.textContent = stepNames[currentStep - 1];
  document.querySelector(".progress").setAttribute("aria-label", `Tiến độ: bước ${currentStep} trên 3`);
  backButton.hidden = currentStep === 1;
  nextButton.querySelector("span").textContent = currentStep === 3 ? "Gửi cho anh" : "Tiếp tục";
  steps[currentStep - 1].querySelector("legend").focus({ preventScroll: true });
  document.querySelector(".progress").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function submitMission() {
  const values = new FormData(form);
  const place = values.get("place");
  const food = values.get("food");
  const note = values.get("message").trim();
  const date = values.get("date") || "Chưa chọn ngày";

  setSubmitState(true);

  try {
    if (GOOGLE_FORM.FORM_ACTION) {
      const payload = new FormData();
      payload.append(GOOGLE_FORM.PLACE_ENTRY, place);
      payload.append(GOOGLE_FORM.FOOD_ENTRY, food);
      payload.append(GOOGLE_FORM.MESSAGE_ENTRY, note);
      payload.append(GOOGLE_FORM.DATE_ENTRY, date);
      await fetch(GOOGLE_FORM.FORM_ACTION, { method: "POST", mode: "no-cors", body: payload });
    } else {
      await new Promise((resolve) => setTimeout(resolve, 450));
      console.info("Google Form chưa được cấu hình. Dữ liệu xem trước:", { place, food, note, date });
      showToast("Đang ở chế độ xem trước. Hãy cấu hình Google Form trong app.js để nhận phản hồi thật.");
    }

    successSummary.textContent = `Em đã chọn “${place}” và “${food}”. Phần còn lại cứ để anh lo nhé.`;
    dialog.showModal();
  } catch (error) {
    console.error(error);
    showToast("Bức thư chưa gửi được. Kiểm tra kết nối rồi thử lại nhé.");
  } finally {
    setSubmitState(false);
  }
}

function setSubmitState(isSubmitting) {
  nextButton.disabled = isSubmitting;
  nextButton.querySelector("span").textContent = isSubmitting ? "Đang gửi thư..." : "Gửi cho anh";
}

function showError(name, copy) {
  const error = document.querySelector(`[data-error="${name}"]`);
  error.textContent = copy;
  error.closest(".form-step").animate(
    [{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
    { duration: 220, easing: "ease-out" }
  );
}

function clearError(name) {
  const error = document.querySelector(`[data-error="${name}"]`);
  if (error) error.textContent = "";
}

let toastTimer;
function showToast(copy) {
  clearTimeout(toastTimer);
  toast.textContent = copy;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 5000);
}
