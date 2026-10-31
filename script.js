/* =========================================================
   WEDDING INVITATION — SCRIPT
   ========================================================= */

// Change wedding date here (format: YYYY-MM-DDTHH:MM:SS+timezone)
const WEDDING_DATE = "2026-12-25T10:00:00+05:30";

// Change number of falling petals here (0 to turn off)
const PETAL_COUNT = 14;

// ---------------------------------------------------------
// Elements
// ---------------------------------------------------------
const welcome = document.getElementById("welcome");
const openBtn = document.getElementById("openBtn");
const main = document.getElementById("main");
const petalsBox = document.querySelector(".petals");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Keep the invitation locked behind the welcome screen until opened
document.body.classList.add("is-locked");
main.inert = true;


// ---------------------------------------------------------
// Falling petals (welcome screen)
// ---------------------------------------------------------
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createPetals() {
  if (prefersReducedMotion || !petalsBox) return;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.setProperty("--x", random(0, 100).toFixed(1) + "%");
    petal.style.setProperty("--size", random(9, 18).toFixed(1) + "px");
    petal.style.setProperty("--dur", random(9, 16).toFixed(1) + "s");
    petal.style.setProperty("--delay", random(0, 10).toFixed(1) + "s");
    petal.style.setProperty("--drift", random(-80, 80).toFixed(0) + "px");
    petalsBox.appendChild(petal);
  }
}


// ---------------------------------------------------------
// Scroll reveal animations (Intersection Observer)
// ---------------------------------------------------------
function startReveals() {
  const items = document.querySelectorAll(".reveal");

  // Fallback for very old browsers
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}


// ---------------------------------------------------------
// Open invitation button
// ---------------------------------------------------------
function openInvitation() {
  openBtn.disabled = true;

  document.body.classList.remove("is-locked");
  main.inert = false;
  window.scrollTo(0, 0);

  const finish = () => {
    welcome.hidden = true;
  };

  if (prefersReducedMotion) {
    finish();
  } else {
    welcome.classList.add("is-opening");
    setTimeout(finish, 1500);
  }

  startReveals();
}

openBtn.addEventListener("click", openInvitation);


// ---------------------------------------------------------
// Countdown
// ---------------------------------------------------------
const cdGrid = document.getElementById("countdownGrid");
const cdMessage = document.getElementById("cdMessage");
const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

const targetTime = new Date(WEDDING_DATE).getTime();
let countdownTimer = null;

function pad(number) {
  return String(number).padStart(2, "0");
}

function updateCountdown() {
  const diff = targetTime - Date.now();

  // Wedding day has arrived
  if (diff <= 0) {
    cdGrid.hidden = true;
    cdMessage.hidden = false;
    clearInterval(countdownTimer);
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  cdDays.textContent = pad(Math.floor(totalSeconds / 86400));
  cdHours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  cdMinutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  cdSeconds.textContent = pad(totalSeconds % 60);
}

function startCountdown() {
  if (Number.isNaN(targetTime)) {
    console.warn("WEDDING_DATE is not a valid date. Check the format in script.js.");
    return;
  }
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}


// ---------------------------------------------------------
// Start everything
// ---------------------------------------------------------
createPetals();
startCountdown();
