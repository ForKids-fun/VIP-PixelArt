// ===== CORE ELEMENTS (REQUIRED) =====
const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const exportCanvas = document.getElementById("exportCanvas");

// ===== OPTIONAL ELEMENTS (SAFE) =====
const brushType = document.getElementById("brushType");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const gridSizeSelect = document.getElementById("gridSize");
const resizeBtn = document.getElementById("resize");
const themeSelect = document.getElementById("themeSelect");
const applyThemeBtn = document.getElementById("applyTheme");
const randomThemeBtn = document.getElementById("randomTheme");
const exportSizeInput = document.getElementById("exportSize");
const music = document.getElementById("bgMusic");

// ===== STATE =====
let gridSize = 32;
let isPainting = false;
let erasing = false;

// ===== THEMES =====
const themes = [
  "Cotton Candy","Strawberry Milk","Matcha Latte","Lavender Dream","Baby Blue Sky",
  "Midnight Black","Obsidian","Dark Mode Plus","Neon City","Cyberpunk",
  "Forest Walk","Ocean Breeze","Golden Hour","Minimal Zen","Retro Arcade"
];

// ===== LOAD THEMES SAFELY =====
if (themeSelect) {
  themes.forEach(t => {
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    themeSelect.appendChild(o);
  });
}

// ===== GRID CREATION =====
function createGrid(size) {
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${size}, 16px)`;

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixel.style.width = "16px";
    pixel.style.height = "16px";
    pixel.style.background = "#ffffff";

    pixel.addEventListener("mousedown", () => paint(pixel));
    pixel.addEventListener("mouseover", () => {
      if (isPainting) paint(pixel);
    });

    grid.appendChild(pixel);
  }
}

// ===== PAINT FUNCTION =====
function paint(pixel) {
  const color = erasing ? "#ffffff" : colorPicker.value;
  pixel.style.background = color;

  if (!brushType) return;

  const index = [...grid.children].indexOf(pixel);
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);

  if (brushType.value === "mirror-h") {
    const mirror = grid.children[y * gridSize + (gridSize - x - 1)];
    if (mirror) mirror.style.background = color;
  }

  if (brushType.value === "mirror-v") {
    const mirror = grid.children[(gridSize - y - 1) * gridSize + x];
    if (mirror) mirror.style.background = color;
  }
}

// ===== MOUSE PAINTING =====
window.addEventListener("mousedown", () => isPainting = true);
window.addEventListener("mouseup", () => isPainting = false);

// ===== BUTTONS =====
if (eraserBtn) eraserBtn.onclick = () => erasing = !erasing;

if (clearBtn) {
  clearBtn.onclick = () =>
    document.querySelectorAll(".pixel")
      .forEach(p => p.style.background = "#ffffff");
}

if (resizeBtn && gridSizeSelect) {
  resizeBtn.onclick = () => {
    gridSize = Number(gridSizeSelect.value);
    createGrid(gridSize);
  };
}

// ===== SAVE HD =====
if (saveBtn && exportSizeInput) {
  saveBtn.onclick = () => {
    const size = Number(exportSizeInput.value);
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext("2d");
    const scale = size / gridSize;

    document.querySelectorAll(".pixel").forEach((p, i) => {
      ctx.fillStyle = p.style.background || "#ffffff";
      ctx.fillRect(
        (i % gridSize) * scale,
        Math.floor(i / gridSize) * scale,
        scale,
        scale
      );
    });

    const a = document.createElement("a");
    a.download = "pixel-art-vip.png";
    a.href = exportCanvas.toDataURL("image/png");
    a.click();
  };
}

// ===== THEMES =====
function applyTheme(name) {
  if (!name) return;

  if (name.includes("Dark") || name.includes("Black")) {
    document.body.style.background = "#111";
    grid.style.background = "#222";
  } else if (name.includes("Candy") || name.includes("Milk")) {
    document.body.style.background = "#ffd6e8";
    grid.style.background = "#ffffff";
  } else if (name.includes("Neon") || name.includes("Cyber")) {
    document.body.style.background = "#0f0c29";
    grid.style.background = "#302b63";
  } else {
    document.body.style.background = "#f2f2f2";
    grid.style.background = "#dddddd";
  }
}

if (applyThemeBtn && themeSelect) {
  applyThemeBtn.onclick = () => applyTheme(themeSelect.value);
}

if (randomThemeBtn && themeSelect) {
  randomThemeBtn.onclick = () => {
    const t = themes[Math.floor(Math.random() * themes.length)];
    themeSelect.value = t;
    applyTheme(t);
  };
}

// ===== MUSIC =====
if (music) {
  music.volume = 0.25;
  document.addEventListener("click", () => {
    music.play().catch(() => {});
  }, { once: true });
}

// ===== INIT =====
createGrid(gridSize);
