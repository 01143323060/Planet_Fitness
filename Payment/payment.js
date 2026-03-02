const coaches = [
  { id: 1, name: "Ahmed El-Sherif", specialty: "Strength & Conditioning Coach" },
  { id: 2, name: "Nouran Mahmoud", specialty: "Yoga & Mobility Specialist" },
  { id: 3, name: "Mohamed Hassan", specialty: "Functional Training Coach" },
  { id: 4, name: "Salma Abdelrahman", specialty: "Nutrition & Wellness Coach" }
];

const slots = [
  "Sat-Mon-Wed 7PM",
  "Sun-Tue-Thu 8PM",
  "Daily 6AM"
];

let selectedCoach = null;
let selectedSlot = null;

function loadCoaches() {
  coachGrid.innerHTML = coaches.map(c =>
    `<div class="coach-card" onclick="selectCoach(${c.id}, this)">
      <h3>${c.name}</h3>
      <p>${c.specialty}</p>
    </div>`
  ).join("");
}

function smoothShow(el) {
  if (el.style.display === "block") return;
  el.style.display = "block";
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";
  requestAnimationFrame(() => {
    el.style.transition = "0.6s ease";
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
  });
}

function selectCoach(id, el) {
  selectedCoach = id;
  document.querySelectorAll(".coach-card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  smoothShow(scheduleStep);
  loadSchedules();
}

function loadSchedules() {
  scheduleGrid.innerHTML = slots.map(s =>
    `<div class="slot-card" onclick="selectSlot('${s}', this)">${s}</div>`
  ).join("");
}

function selectSlot(slot, el) {
  selectedSlot = slot;
  document.querySelectorAll(".slot-card").forEach(s => s.classList.remove("selected"));
  el.classList.add("selected");
  smoothShow(paymentStep);
  updateTotal();
}

function toggleCardForm() {
  const credit = document.querySelector('input[name="payment"]:checked').value === "credit";
  creditCardForm.style.display = credit ? "block" : "none";
  card.classList.remove("flipped");
}

function getCardType(num) {
  if (/^4/.test(num)) return "VISA";
  if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]))/.test(num)) return "MASTERCARD";
  return null;
}

function luhnCheck(num) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 16);
  v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
  input.value = v;
  cardNumber.textContent = v || "#### #### #### ####";
  cardType.textContent = getCardType(v.replace(/\s/g, "")) || "CARD";
}

function updateCardHolder(v) {
  cardHolder.textContent = v.trim() ? v.toUpperCase() : "CARD HOLDER";
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
  input.value = v;
  cardExpiry.textContent = v || "MM/YY";
}

function updateCVV(v) {
  cardCVV.textContent = v ? v.padEnd(3, "•") : "•••";
}

function flipCard() {
  card.classList.add("flipped");
}

function flipCardBack() {
  card.classList.remove("flipped");
}

function validExpiry(value) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return false;
  const [mm, yy] = value.split("/").map(Number);
  const now = new Date();
  const exp = new Date(2000 + yy, mm);
  return exp > now;
}

function validCardData() {
  const number = cardNumberInput.value.replace(/\s/g, "");
  const holder = cardHolderInput.value.trim();
  const expiry = expiryInput.value;
  const cvv = cvvInput.value;

  if (!getCardType(number)) return false;
  if (number.length !== 16) return false;
  if (!luhnCheck(number)) return false;
  if (!holder) return false;
  if (!validExpiry(expiry)) return false;
  if (!/^\d{3}$/.test(cvv)) return false;

  return true;
}

function updateTotal() {
  const prices = { 1: 350, 3: 950, 6: 1700, 12: 3000 };
  totalAmount.textContent = prices[months.value] + " EGP";
}

function confirmPayment() {
  if (!selectedCoach || !selectedSlot) {
    alert("Please complete all steps");
    return;
  }

  const method = document.querySelector('input[name="payment"]:checked').value;

  if (method === "credit" && !validCardData()) {
    alert("Invalid card details");
    return;
  }

  alert("Payment Completed Successfully, welcome to Planet Fitness family.");
  window.location.replace("/Schedule/Schedule.html")
}

window.onload = () => {
  loadCoaches();
  updateTotal();
};
