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

// ===== FULL THEMES (NO CANDY, NO PASTEL & SOFT) =====
const themes = [
  // Dark & Moody
  "Midnight Black", "Obsidian", "Carbon Fiber", "Space Station", "Dark Mode Plus",
  "Hacker Green", "Deep Navy", "Luxury Charcoal", "Eclipse", "Black Gold",
  "Neon Noir", "Galaxy Void", "Steel Gray", "Dark Sapphire", "Moon Shadow",
  "Cyber Night", "Phantom Blue", "Cosmic Dust", "After Hours", "Executive Suite",

  // Nature & Outdoors
  "Forest Walk", "Moss Green", "Ocean Breeze", "Deep Sea", "Mountain Air",
  "Rainy Day", "Sunset Beach", "Golden Hour", "Desert Sand", "Autumn Leaves",
  "Spring Meadow", "Morning Dew", "Waterfall", "Pine Woods", "Driftwood",

  // Futuristic & Tech
  "Neon City", "Cyberpunk", "Vaporwave", "Synthwave", "Laser Grid",
  "Electric Blue", "Plasma Pink", "Digital Rain", "Glitch Core", "Pixel Matrix",
  "AI Dream", "Retro Arcade", "Future Chrome", "VR World", "Tech Glow",

  // Art & Creativity
  "Paint Splash", "Marker Madness", "Crayon Box", "Sketchbook", "Graffiti Wall",
  "Watercolor Wash", "Comic Panel", "Pop Art", "Minimal Zen", "Mystery Mode",

  // Fantasy & Magic
  "Fairy Glade", "Unicorn Meadow", "Wizard Tower", "Magic Potion", "Crystal Cave",
  "Floating Islands", "Mermaid Lagoon", "Enchanted Forest", "Friendly Dragons", "Moonlit Spell",
  "Phoenix Fire", "Starry Portal", "Elf Village", "Gnome Homes", "Mystical Mask",
  "Dream Castle", "Talking Animals", "Rainbow Bridge", "Magical Library", "Potion Shelf",

  // Everyday & People
  "Street Market", "Skateboard Park", "Kids Playing", "Cooking Time", "Reading Window",
  "Rainy Umbrella", "Music Concert", "Dancing Crowd", "Picnic Day", "Cafe Scene",
  "Bicycle Ride", "Library Corner", "Festival Fun", "Sunset Watch", "Old Town Street",
  "Farmer Field", "Roller Skating", "Sandcastle Fun", "Board Games", "Friends Laughing"
];

// ===== LOAD THEMES INTO SELECT =====
if (themeSelect) {
  themes.forEach(t => {
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    themeSelect.appendChild(o);
  });
}

// ===== CREATE GRID =====
function createGrid(size) {
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${size}, 16px)`;
  grid.style.gridTemplateRows = `repeat(${size}, 16px)`;
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

// ===== MOUSE EVENTS =====
window.addEventListener("mousedown", () => isPainting = true);
window.addEventListener("mouseup", () => isPainting = false);

// ===== BUTTONS =====
if (eraserBtn) eraserBtn.onclick = () => erasing = !erasing;

if (clearBtn) clearBtn.onclick = () =>
  document.querySelectorAll(".pixel").forEach(p => p.style.background = "#ffffff");

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

// ===== APPLY THEMES =====
function applyTheme(name) {
  if (!name) return;

  if (name.includes("Dark") || name.includes("Black") || name.includes("Night")) {
    document.body.style.background = "#111";
    grid.style.background = "#222";
  } else if (name.includes("Candy") || name.includes("Pink") || name.includes("Milk")) {
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

if (applyThemeBtn && themeSelect) applyThemeBtn.onclick = () => applyTheme(themeSelect.value);

if (randomThemeBtn && themeSelect) randomThemeBtn.onclick = () => {
  const t = themes[Math.floor(Math.random() * themes.length)];
  themeSelect.value = t;
  applyTheme(t);
};

// ===== MUSIC =====
if (music) {
  music.volume = 0.25;
  document.addEventListener("click", () => {
    music.play().catch(() => {});
  }, { once: true });
}

// ===== INIT GRID =====
createGrid(gridSize);
