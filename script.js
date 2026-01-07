// =======================
// AUTH + USER STATE
// =======================

function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

// =======================
// AUTH ELEMENTS
// =======================

const signInButton = document.getElementById("signInButton");
const signUpButton = document.getElementById("signUpButton");
const logOutButton = document.getElementById("logOutButton");

const loginForm = document.getElementById("loginForm");
const signUpForm = document.getElementById("signUpForm");
const welcomeMessage = document.getElementById("welcomeMessage");

const checkoutBtn = document.getElementById("checkoutBtn");

// =======================
// AUTH UI
// =======================

function toggleLoggedInState(loggedIn) {
  signInButton?.classList.toggle("hidden", loggedIn);
  signUpButton?.classList.toggle("hidden", loggedIn);
  logOutButton?.classList.toggle("hidden", !loggedIn);
  checkoutBtn?.classList.toggle("hidden", !loggedIn);
  lockTools(!loggedIn);
}

function showSignIn() {
  loginForm.classList.remove("hidden");
  signUpForm.classList.add("hidden");
}

function showSignUp() {
  signUpForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
}

// =======================
// SIGN UP
// =======================

function signUp() {
  const username = document.getElementById("newUsernameInput").value.trim();
  const password = document.getElementById("newPasswordInput").value.trim();

  if (!username || !password) return alert("Fill everything 😭");

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) return alert("Username already exists 😬");

  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created! Log in 🔑✨");
  showSignIn();
}

// =======================
// LOG IN
// =======================

function logIn() {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] === password) {
    localStorage.setItem("currentUser", username);
    welcomeMessage.textContent = `Welcome, ${username} 👑`;
    welcomeMessage.classList.remove("hidden");
    loginForm.classList.add("hidden");
    signUpForm.classList.add("hidden");
    toggleLoggedInState(true);
    loadUserArt();
  } else {
    alert("Wrong username or password 😵");
  }
}

// =======================
// LOG OUT
// =======================

function logOut() {
  autoSaveArt();
  localStorage.removeItem("currentUser");
  welcomeMessage.classList.add("hidden");
  toggleLoggedInState(false);
  clearGrid();
}

// =======================
// TRANSACTION BUTTON
// =======================

if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    window.location.href = "payment.html";
  };
}

// =======================
// CORE ELEMENTS
// =======================

const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const exportCanvas = document.getElementById("exportCanvas");

const brushType = document.getElementById("brushType");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const gridSizeSelect = document.getElementById("gridSize");
const resizeBtn = document.getElementById("resize");
const exportSizeInput = document.getElementById("exportSize");
const music = document.getElementById("bgMusic");

// =======================
// STATE
// =======================

let gridSize = 32;
let isPainting = false;
let erasing = false;

// =======================
// TOOL LOCK
// =======================

function lockTools(lock) {
  document.querySelectorAll("button, input, select").forEach(el => {
    if (!el.closest(".auth-panel")) el.disabled = lock;
  });
}

// =======================
// GRID
// =======================

function createGrid(size) {
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${size}, 16px)`;
  grid.style.gridTemplateRows = `repeat(${size}, 16px)`;

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixel.style.background = "#ffffff";

    pixel.addEventListener("mousedown", () => paint(pixel));
    pixel.addEventListener("mouseover", () => isPainting && paint(pixel));

    grid.appendChild(pixel);
  }
}

function paint(pixel) {
  if (!isLoggedIn()) return;
  pixel.style.background = erasing ? "#ffffff" : colorPicker.value;
  autoSaveArt();
}

window.addEventListener("mousedown", () => isPainting = true);
window.addEventListener("mouseup", () => isPainting = false);

function clearGrid() {
  document.querySelectorAll(".pixel").forEach(p => p.style.background = "#ffffff");
}

// =======================
// AUTO SAVE PER USER
// =======================

function autoSaveArt() {
  if (!isLoggedIn()) return;
  const data = [...document.querySelectorAll(".pixel")].map(p => p.style.background);
  localStorage.setItem(`art_${getCurrentUser()}`, JSON.stringify(data));
}

function loadUserArt() {
  const data = JSON.parse(localStorage.getItem(`art_${getCurrentUser()}`));
  if (!data) return;
  document.querySelectorAll(".pixel").forEach((p, i) => {
    p.style.background = data[i] || "#ffffff";
  });
}

// =======================
// SAVE HD  ✅ THIS IS **YOUR CODE**
// =======================

saveBtn.onclick = () => {
  const size = Number(exportSizeInput.value);
  exportCanvas.width = size;
  exportCanvas.height = size;

  const ctx = exportCanvas.getContext("2d");
  const scale = size / gridSize;

  document.querySelectorAll(".pixel").forEach((p, i) => {
    ctx.fillStyle = p.style.background;
    ctx.fillRect(
      (i % gridSize) * scale,
      Math.floor(i / gridSize) * scale,
      scale,
      scale
    );
  });

  const a = document.createElement("a");
  a.download = "pixel-art-vip.png";
  a.href = exportCanvas.toDataURL();
  a.click();
};

// =======================
// MUSIC
// =======================

if (music) {
  music.volume = 0.25;
  document.addEventListener("click", () => music.play().catch(() => {}), { once: true });
}

// =======================
// INIT
// =======================

createGrid(gridSize);

window.addEventListener("load", () => {
  if (isLoggedIn()) {
    welcomeMessage.textContent = `Welcome back, ${getCurrentUser()} 👑`;
    welcomeMessage.classList.remove("hidden");
    toggleLoggedInState(true);
    loadUserArt();
  } else {
    toggleLoggedInState(false);
  }
});
