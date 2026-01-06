const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const brushType = document.getElementById("brushType");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const gridSizeSelect = document.getElementById("gridSize");
const resizeBtn = document.getElementById("resize");
const exportCanvas = document.getElementById("exportCanvas");
const themeSelect = document.getElementById("themeSelect");
const applyThemeBtn = document.getElementById("applyTheme");
const randomThemeBtn = document.getElementById("randomTheme");

let gridSize = 32;
let isPainting = false;
let erasing = false;

/* 🎨 100 THEMES */
const themes = [
  "Cotton Candy","Strawberry Milk","Matcha Latte","Lavender Dream","Baby Blue Sky",
  "Peach Blush","Vanilla Cream","Rose Quartz","Cloud Nine","Soft Lilac",
  "Pastel Rainbow","Blush Pink","Mint Breeze","Powder Blue","Sakura Bloom",
  "Cozy Beige","Warm Honey","Milk Tea","Soft Sunset","Morning Fog",
  "Midnight Black","Obsidian","Carbon Fiber","Space Station","Dark Mode Plus",
  "Hacker Green","Deep Navy","Luxury Charcoal","Eclipse","Black Gold",
  "Neon Noir","Galaxy Void","Steel Gray","Dark Sapphire","Moon Shadow",
  "Cyber Night","Phantom Blue","Cosmic Dust","After Hours","Executive Suite",
  "Gummy Bears","Jellybean Party","Candy Shop","Rainbow Sprinkles","Bubblegum Pop",
  "Donut Glaze","Ice Cream Truck","Cotton Candy Sky","Lollipop Lane","Unicorn Sparkle",
  "Slime Time","Toy Box","Crayon Chaos","Sticker Pack","Playroom",
  "Cartoon City","Happy Balloons","Confetti Blast","Pixel Playground","Birthday Cake",
  "Forest Walk","Moss Green","Ocean Breeze","Deep Sea","Mountain Air",
  "Rainy Day","Sunset Beach","Golden Hour","Desert Sand","Autumn Leaves",
  "Spring Meadow","Morning Dew","Waterfall","Pine Woods","Driftwood",
  "Neon City","Cyberpunk","Vaporwave","Synthwave","Laser Grid",
  "Electric Blue","Plasma Pink","Digital Rain","Glitch Core","Pixel Matrix",
  "AI Dream","Retro Arcade","Future Chrome","VR World","Tech Glow",
  "Paint Splash","Marker Madness","Crayon Box","Sketchbook","Graffiti Wall",
  "Watercolor Wash","Comic Panel","Pop Art","Minimal Zen","Mystery Mode"
];

/* LOAD THEMES */
themes.forEach(t => {
  const o = document.createElement("option");
  o.value = t;
  o.textContent = t;
  themeSelect.appendChild(o);
});

/* GRID */
function createGrid(size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 16px)`;

  for (let i = 0; i < size * size; i++) {
    const p = document.createElement("div");
    p.className = "pixel";
    p.style.width = "16px";
    p.style.height = "16px";
    p.style.background = "white";

    p.addEventListener("mousedown", () => paint(p));
    p.addEventListener("mouseover", () => {
      if (isPainting) paint(p);
    });

    grid.appendChild(p);
  }
}

function paint(pixel) {
  const color = erasing ? "white" : colorPicker.value;
  pixel.style.background = color;

  const index = [...grid.children].indexOf(pixel);
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);

  if (brushType.value === "mirror-h") {
    grid.children[y * gridSize + (gridSize - x - 1)].style.background = color;
  }
  if (brushType.value === "mirror-v") {
    grid.children[(gridSize - y - 1) * gridSize + x].style.background = color;
  }
}

/* EVENTS */
document.body.onmousedown = () => isPainting = true;
document.body.onmouseup = () => isPainting = false;

eraserBtn.onclick = () => erasing = !erasing;

clearBtn.onclick = () =>
  document.querySelectorAll(".pixel").forEach(p => p.style.background = "white");

resizeBtn.onclick = () => {
  gridSize = Number(gridSizeSelect.value);
  createGrid(gridSize);
};

/* SAVE HD */
saveBtn.onclick = () => {
  const size = Number(document.getElementById("exportSize").value);
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctx = exportCanvas.getContext("2d");
  const scale = size / gridSize;

  document.querySelectorAll(".pixel").forEach((p, i) => {
    ctx.fillStyle = p.style.background || "white";
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

/* THEMES */
applyThemeBtn.onclick = () => applyTheme(themeSelect.value);
randomThemeBtn.onclick = () => {
  const t = themes[Math.floor(Math.random() * themes.length)];
  themeSelect.value = t;
  applyTheme(t);
};

const music = document.getElementById("bgMusic");
music.volume = 0.25; // calm, classy, billionaire vibes

document.addEventListener("click", () => {
  music.play().catch(() => {});
}, { once: true });


function applyTheme(name) {
  document.body.style.transition = "0.3s";

  if (name.includes("Dark") || name.includes("Black") || name.includes("Night")) {
    document.body.style.background = "#111";
    grid.style.background = "#222";
  } else if (name.includes("Candy") || name.includes("Pink") || name.includes("Milk")) {
    document.body.style.background = "#ffd6e8";
    grid.style.background = "#fff";
  } else if (name.includes("Neon") || name.includes("Cyber")) {
    document.body.style.background = "#0f0c29";
    grid.style.background = "#302b63";
  } else {
    document.body.style.background = "#f2f2f2";
    grid.style.background = "#ddd";
  }
}

createGrid(gridSize);
