/*
 * GOOGLE FORMS SETUP
 * 1. Tạo Google Form với 4 câu hỏi: Nơi hẹn, Món ăn, Lời nhắn, Ngày hẹn.
 *    Phương tiện sẽ được ghép vào câu trả lời "Nơi hẹn" để không cần thêm entry mới.
 * 2. Mở "Get pre-filled link", điền thử và lấy các mã entry.xxxxx trong URL.
 * 3. Thay FORM_ACTION và các mã entry bên dưới. Không cần backend riêng.
 */
const GOOGLE_FORM = {
  FORM_ACTION: "https://docs.google.com/forms/d/e/1FAIpQLSdikvkwKddIxIBAkOG-ktBzvH5DkzFYC07l9NRolk34tfBAgQ/formResponse", // Ví dụ: https://docs.google.com/forms/d/e/FORM_ID/formResponse
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
const magicLayer = document.querySelector("#magic-layer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const dateChoice = document.querySelector("#date-choice");
const planTitle = document.querySelector("#plan-title");
const planNote = document.querySelector("#plan-note");
const planList = document.querySelector("#plan-list");
const planPreview = document.querySelector("#plan-preview");
const placeGrid = document.querySelector(".choice-grid--places");
const introPortrait = document.querySelector(".intro__portrait");
const petalLayer = document.querySelector("#petal-layer");

const SUNDAY_PLANS = {
  "Hồ Tây và phố đi bộ Trịnh Công Sơn": {
    title: "Một ngày chậm quanh Hồ Tây",
    note: "Plan nhẹ nhất, hợp hôm muốn ở gần và không phải dậy sớm.",
    stops: [
      ["09:00", "Gặp nhau, ăn sáng hoặc brunch ở khu Trúc Bạch."],
      ["10:30", "Dạo hồ, ghé chùa Trấn Quốc rồi tìm một quán cà phê."],
      ["13:00", "Ăn trưa, nghỉ một chút và chụp photobooth nếu tiện đường."],
      ["16:30", "Đi một vòng Hồ Tây, đợi hoàng hôn xuống."],
      ["19:00", "Ăn tối rồi ghé phố đi bộ Trịnh Công Sơn nếu hôm đó mở."],
    ],
  },
  "Làng gốm Bát Tràng": {
    title: "Bát Tràng rồi về ngắm Hồ Tây",
    note: "Có hoạt động để làm cùng nhau nhưng lịch vẫn đủ thong thả.",
    stops: [
      ["08:00", "Xuất phát từ nội thành, ăn sáng trên đường."],
      ["09:15", "Dạo làng gốm, xem chợ và những con ngõ cũ."],
      ["10:30", "Chọn một workshop nặn hoặc vẽ gốm cùng nhau."],
      ["12:30", "Ăn trưa ở Bát Tràng rồi ngồi nghỉ, đợi đồ gốm hoàn thiện."],
      ["15:30", "Về lại nội thành, cà phê và ngắm hoàng hôn ở Hồ Tây."],
      ["19:00", "Ăn tối gần hồ rồi đưa em về."],
    ],
  },
  "Làng cổ Đường Lâm": {
    title: "Đường Lâm và Sơn Tây",
    note: "Kèo nhiều ảnh đẹp, đồ ăn quê và một quãng đường vừa đủ để nói chuyện.",
    stops: [
      ["07:30", "Xuất phát, dừng ăn sáng hoặc mua đồ uống mang theo."],
      ["09:15", "Vào làng cổ, đi bộ qua cổng làng, đình và các ngôi nhà cổ."],
      ["11:45", "Ăn trưa trong làng, thử chè lam và nước vối."],
      ["14:00", "Đi chậm thêm một vòng hoặc thuê xe đạp quanh làng."],
      ["15:45", "Ghé Thành cổ Sơn Tây rồi tìm quán nghỉ chân."],
      ["18:00", "Về Hà Nội và ăn tối nếu hai đứa vẫn còn bụng."],
    ],
  },
  "Vườn quốc gia Ba Vì": {
    title: "Một ngày trốn lên Ba Vì",
    note: "Kèo dậy sớm và đi bộ nhiều nhất, đổi lại là cả ngày ở giữa cây xanh.",
    stops: [
      ["06:45", "Xuất phát sớm, ăn sáng trên đường lên Ba Vì."],
      ["09:00", "Vào vườn quốc gia, chọn tuyến đi bộ vừa sức và dừng chụp ảnh."],
      ["12:00", "Ăn trưa, nghỉ đủ lâu rồi mới đi tiếp."],
      ["13:30", "Ghé một điểm trên tuyến như nhà thờ cổ hoặc khu rừng thông."],
      ["16:00", "Xuống núi, uống gì đó rồi về Hà Nội trước khi tối hẳn."],
      ["19:00", "Ăn tối trong thành phố và tổng kết chuyến trốn đi một ngày."],
    ],
  },
  "Hồ Hoàn Kiếm và phố cổ": {
    title: "Lang thang phố cổ cả ngày",
    note: "Kèo gần, dễ đổi lịch và hợp hôm chỉ muốn vừa đi vừa ăn.",
    stops: [
      ["08:30", "Gặp nhau ăn sáng trong phố cổ, không cần vội."],
      ["10:00", "Đi một vòng Hồ Hoàn Kiếm, ghé đền Ngọc Sơn nếu hai đứa thích."],
      ["12:00", "Chọn một món Hà Nội để ăn trưa rồi nghỉ chân."],
      ["14:00", "Ghé bảo tàng hoặc một hiệu sách, sau đó tìm quán cà phê yên tĩnh."],
      ["17:00", "Đi bộ tiếp trong phố, chụp vài tấm ảnh lúc trời dịu."],
      ["19:00", "Ăn tối mỗi chỗ một ít rồi về khi đã no."],
    ],
  },
  "Văn Miếu và Hoàng thành Thăng Long": {
    title: "Một ngày rất Hà Nội",
    note: "Hai điểm gần nhau, nhiều góc đẹp và vẫn có đủ thời gian ngồi cà phê.",
    stops: [
      ["08:30", "Ăn sáng rồi bắt đầu ở Văn Miếu - Quốc Tử Giám."],
      ["10:45", "Đi bộ chậm, chụp ảnh rồi tìm một quán ăn gần đó."],
      ["12:00", "Ăn trưa và nghỉ một lúc trước chặng chiều."],
      ["13:45", "Tham quan Hoàng thành Thăng Long và khu khảo cổ."],
      ["16:30", "Ngồi cà phê, xem lại ảnh và đợi phố lên đèn."],
      ["19:00", "Chốt ngày bằng một bữa tối ở khu trung tâm."],
    ],
  },
  "Việt Phủ Thành Chương và Sóc Sơn": {
    title: "Việt Phủ rồi trốn lên Sóc Sơn",
    note: "Kèo ra khỏi phố vừa đủ, hợp hôm muốn nhiều cây xanh và ít tiếng xe.",
    stops: [
      ["07:30", "Xuất phát sớm, ăn sáng trên đường đi Sóc Sơn."],
      ["09:00", "Tham quan Việt Phủ Thành Chương, đi chậm và chụp ảnh."],
      ["11:45", "Ăn trưa ở Sóc Sơn rồi nghỉ một chút."],
      ["13:30", "Chọn một quán cà phê hoặc khu dã ngoại nhiều cây gần đó."],
      ["16:30", "Bắt đầu về nội thành trước giờ đông xe."],
      ["19:00", "Ăn tối nhẹ nếu hai đứa vẫn chưa muốn kết thúc ngày."],
    ],
  },
  "Thiên đường Bảo Sơn": {
    title: "Một ngày chơi hết mình",
    note: "Nên xem lịch mở cửa và biểu diễn trên trang địa điểm trước khi đi.",
    stops: [
      ["08:00", "Gặp nhau, ăn sáng rồi đi tới công viên."],
      ["09:00", "Vào cửa, xem sơ đồ và chọn những trò cả hai cùng muốn thử."],
      ["11:30", "Ghé thủy cung hoặc khu tham quan trong nhà rồi ăn trưa."],
      ["13:30", "Xem chương trình phù hợp với lịch hôm đó và chơi tiếp."],
      ["16:30", "Rời công viên, tìm chỗ uống nước và nghỉ chân."],
      ["18:30", "Về nội thành ăn tối để bù lại năng lượng đã tiêu."],
    ],
  },
};

const TOTAL_STEPS = 4;
const stepNames = ["Đi bằng gì đây?", "Đi đâu đây?", "Ăn gì đây?", "Nhắn anh một câu"];
let currentStep = 1;

const today = new Date();
document.querySelector("#current-year").textContent = today.getFullYear();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateChoice.min = today.toISOString().split("T")[0];
setupAmbientMotion();
setupPortraitDepth();
setupDecorationControls();

openCaseButton.addEventListener("click", () => {
  if (openCaseButton.disabled) return;
  createSparkBurst(openCaseButton, 12);

  if (reducedMotion.matches) {
    revealCaseFile();
    return;
  }

  openCaseButton.disabled = true;
  intro.classList.add("is-opening");
  window.setTimeout(revealCaseFile, 520);
});

function revealCaseFile() {
  intro.hidden = true;
  caseFile.hidden = false;
  caseFile.classList.add("is-revealed");
  window.scrollTo({ top: 0, behavior: "instant" });
  document.querySelector("#case-title").focus({ preventScroll: true });
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

message.addEventListener("input", () => {
  characterCount.textContent = message.value.length;
});

form.addEventListener("change", (event) => {
  if (event.target.matches("input[type='radio']")) {
    clearError(event.target.name);
    createSparkBurst(event.target.closest("label"), 5);
    if (event.target.name === "place") renderSundayPlan(event.target.value);
  }
});

dateChoice.addEventListener("change", () => validateSunday(false));

nextButton.addEventListener("click", async () => {
  if (!validateStep(currentStep)) return;

  if (currentStep < TOTAL_STEPS) {
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
  const fieldName = step === 1 ? "transport" : step === 2 ? "place" : step === 3 ? "food" : "message";
  const value = fieldName === "message"
    ? message.value.trim()
    : new FormData(form).get(fieldName);

  if (!value) {
    const copy = fieldName === "transport"
      ? "Chọn giúp anh cách mình đi nhé, hoặc cứ giao anh sắp xếp ♡"
      : fieldName === "place"
        ? "Chọn giúp anh một chỗ đi, không là anh lại phân vân cả tối đó ♡"
      : fieldName === "food"
        ? "Chọn luôn món nhé, để anh còn biết đường đặt bàn."
        : "Nhắn anh một câu cũng được, đừng để ô này trống nha ♡";
    showError(fieldName, copy);
    const target = fieldName === "message" ? message : form.querySelector(`[name="${fieldName}"]`);
    target.focus();
    return false;
  }
  clearError(fieldName);
  if (step === TOTAL_STEPS && !validateSunday(true)) return false;
  return true;
}

function validateSunday(shouldFocus) {
  if (!dateChoice.value) {
    clearError("date");
    return true;
  }

  const selectedDate = new Date(`${dateChoice.value}T12:00:00`);
  if (selectedDate.getDay() !== 0) {
    showError("date", "Mình chốt lịch cả ngày Chủ nhật nhé. Em chọn lại giúp anh nha ♡");
    if (shouldFocus) dateChoice.focus();
    return false;
  }

  clearError("date");
  return true;
}

function renderSundayPlan(place) {
  const plan = SUNDAY_PLANS[place];
  if (!plan) return;

  const selectedInput = form.querySelector(`input[name="place"]:checked`);
  const selectedOption = selectedInput?.closest(".place-option");
  const placeOptions = [...placeGrid.querySelectorAll(".place-option")];
  const selectedIndex = placeOptions.indexOf(selectedOption);

  if (selectedIndex >= 0) {
    const isSingleColumn = window.matchMedia("(max-width: 600px)").matches;
    const rowEndIndex = isSingleColumn
      ? selectedIndex
      : Math.min(selectedIndex + (selectedIndex % 2 === 0 ? 1 : 0), placeOptions.length - 1);
    placeOptions[rowEndIndex].after(planPreview);
  }

  planTitle.textContent = plan.title;
  const transport = new FormData(form).get("transport");
  const transportNote = transport === "Để anh sắp xếp"
    ? "Phương tiện để anh chọn cho hợp lịch."
    : `Mình sẽ đi bằng ${transport?.toLowerCase()}.`;
  planNote.textContent = transport ? `${plan.note} ${transportNote}` : plan.note;
  planList.replaceChildren(...plan.stops.map(([time, activity]) => {
    const item = document.createElement("li");
    const timeElement = document.createElement("time");
    const copy = document.createElement("span");
    timeElement.textContent = time;
    copy.textContent = activity;
    item.append(timeElement, copy);
    return item;
  }));

  planPreview.hidden = false;
  planPreview.classList.add("has-plan");

  if (!reducedMotion.matches) {
    planPreview.getAnimations().forEach((animation) => animation.cancel());
    planPreview.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(.99)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 260, easing: "cubic-bezier(.2, .8, .2, 1)" },
    );
  }

}

function renderStep() {
  steps.forEach((step, index) => {
    const active = index + 1 === currentStep;
    step.hidden = !active;
    step.classList.toggle("is-active", active);
    step.classList.toggle("is-entering", active);
  });

  progressBar.style.transform = `scaleX(${currentStep / TOTAL_STEPS})`;
  stepCount.textContent = `${currentStep} / ${TOTAL_STEPS}`;
  stepName.textContent = stepNames[currentStep - 1];
  document.querySelector(".progress").setAttribute("aria-label", `Tiến độ: bước ${currentStep} trên ${TOTAL_STEPS}`);
  backButton.hidden = currentStep === 1;
  nextButton.querySelector("span").textContent = currentStep === TOTAL_STEPS ? "Gửi cho Kyrux" : "Tiếp tục";
  steps[currentStep - 1].querySelector("legend").focus({ preventScroll: true });
  document.querySelector(".progress").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function submitMission() {
  const values = new FormData(form);
  const transport = values.get("transport");
  const place = values.get("place");
  const food = values.get("food");
  const note = values.get("message").trim();
  const date = values.get("date") || "Chưa chọn ngày";

  setSubmitState(true);

  try {
    if (GOOGLE_FORM.FORM_ACTION) {
      const payload = new FormData();
      payload.append(GOOGLE_FORM.PLACE_ENTRY, `${place} | Di chuyển: ${transport}`);
      payload.append(GOOGLE_FORM.FOOD_ENTRY, food);
      payload.append(GOOGLE_FORM.MESSAGE_ENTRY, note);
      payload.append(GOOGLE_FORM.DATE_ENTRY, date);
      await fetch(GOOGLE_FORM.FORM_ACTION, { method: "POST", mode: "no-cors", body: payload });
    } else {
      await new Promise((resolve) => setTimeout(resolve, 450));
      console.info("Google Form chưa được cấu hình. Dữ liệu xem trước:", { transport, place, food, note, date });
      showToast("Đang ở chế độ xem trước. Hãy cấu hình Google Form trong app.js để nhận phản hồi thật.");
    }

    successSummary.textContent = `Chốt “${place}”, đi bằng “${transport}”, ăn “${food}”. Kyrux ghi lại rồi.`;
    dialog.showModal();
    createSparkBurst(dialog, 12);
  } catch (error) {
    console.error(error);
    showToast("Bức thư chưa gửi được. Kiểm tra kết nối rồi thử lại nhé.");
  } finally {
    setSubmitState(false);
  }
}

function setSubmitState(isSubmitting) {
  nextButton.disabled = isSubmitting;
  nextButton.querySelector("span").textContent = isSubmitting ? "Đang gửi..." : "Gửi cho Kyrux";
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

function setupAmbientMotion() {
  if (reducedMotion.matches) return;

  document.body.classList.add("motion-ready");
  createCamelliaPetals();
  steps[0].classList.add("is-entering");

  const revealItems = document.querySelectorAll(
    ".hero__copy, .contact-sheet, .mission, .final-note > img, .final-note blockquote"
  );

  revealItems.forEach((item) => item.classList.add("reveal-on-scroll"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8%" });

  revealItems.forEach((item) => observer.observe(item));
}

function createCamelliaPetals() {
  const petalCount = window.innerWidth < 600 ? 12 : 22;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < petalCount; index += 1) {
    const petal = document.createElement("span");
    const size = randomBetween(9, 17);
    const drift = randomBetween(-100, 100);

    petal.className = "camellia-petal";
    petal.dataset.tone = index % 4 === 0 ? "pale" : index % 3 === 0 ? "deep" : "rose";
    petal.style.setProperty("--petal-x", `${randomBetween(2, 98)}vw`);
    petal.style.setProperty("--petal-size", `${size}px`);
    petal.style.setProperty("--petal-drift", `${drift}px`);
    petal.style.setProperty("--petal-spin", `${randomBetween(280, 680)}deg`);
    petal.style.setProperty("--petal-duration", `${randomBetween(12, 22)}s`);
    petal.style.setProperty("--petal-delay", `${randomBetween(-22, 0)}s`);
    petal.style.setProperty("--petal-flutter", `${randomBetween(1.8, 3.8)}s`);
    fragment.append(petal);
  }

  petalLayer.replaceChildren(fragment);
}

function setupDecorationControls() {
  const toggle = document.querySelector("#motion-toggle");
  const glimmers = document.querySelector("#glimmer-layer");

  function syncMotionPreference() {
    toggle.disabled = reducedMotion.matches;
    if (reducedMotion.matches) {
      toggle.textContent = "Hiệu ứng đã giảm";
      petalLayer.replaceChildren();
      glimmers.replaceChildren();
      magicLayer.replaceChildren();
      return;
    }
    toggle.textContent = document.body.classList.contains("motion-paused") ? "Bật hiệu ứng" : "Tạm dừng hiệu ứng";
    if (!petalLayer.childElementCount) createCamelliaPetals();
    if (glimmers.childElementCount) return;
    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 600 ? 6 : 10;
    for (let index = 0; index < count; index += 1) {
      const mote = document.createElement("span");
      mote.className = "glimmer";
      mote.style.setProperty("--glimmer-x", `${randomBetween(3, 97)}%`);
      mote.style.setProperty("--glimmer-y", `${randomBetween(8, 95)}%`);
      mote.style.setProperty("--glimmer-duration", `${randomBetween(5, 9)}s`);
      mote.style.setProperty("--glimmer-delay", `${randomBetween(-9, 0)}s`);
      fragment.append(mote);
    }
    glimmers.append(fragment);
  }

  toggle.addEventListener("click", () => {
    const paused = document.body.classList.toggle("motion-paused");
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = paused ? "Bật hiệu ứng" : "Tạm dừng hiệu ứng";
    if (paused) magicLayer.replaceChildren();
  });
  reducedMotion.addEventListener("change", syncMotionPreference);
  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("tab-hidden", document.hidden);
  });
  syncMotionPreference();
}

function setupPortraitDepth() {
  if (reducedMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let frame;
  introPortrait.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || document.body.classList.contains("motion-paused")) return;
    const bounds = introPortrait.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      introPortrait.style.setProperty("--portrait-x", `${(x - .5) * -14}px`);
      introPortrait.style.setProperty("--portrait-y", `${(y - .5) * -10}px`);
      introPortrait.style.setProperty("--light-x", `${x * 100}%`);
      introPortrait.style.setProperty("--light-y", `${y * 100}%`);
    });
  });

  introPortrait.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    introPortrait.style.setProperty("--portrait-x", "0px");
    introPortrait.style.setProperty("--portrait-y", "0px");
    introPortrait.style.setProperty("--light-x", "58%");
    introPortrait.style.setProperty("--light-y", "42%");
  });
}

function createSparkBurst(source, amount) {
  if (reducedMotion.matches || document.body.classList.contains("motion-paused") || !source) return;

  const bounds = source.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;

  for (let index = 0; index < amount; index += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / amount + Math.random() * 0.35;
    const distance = randomBetween(34, 92);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    spark.className = index % 4 === 0 ? "burst-spark burst-spark--heart" : "burst-spark burst-spark--petal";
    if (index % 4 === 0) spark.textContent = "♡";
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    magicLayer.append(spark);

    const animation = spark.animate(
      [
        { opacity: 0, transform: "translate(-50%, -50%) scale(.25) rotate(0deg)" },
        { opacity: 1, offset: 0.18 },
        { opacity: 0, transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(135deg)` },
      ],
      { duration: randomBetween(520, 820), easing: "cubic-bezier(.16, 1, .3, 1)" }
    );

    animation.finished.then(() => spark.remove(), () => spark.remove());
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
