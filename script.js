const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const themeSelect = document.getElementById("themeSelect");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

/* 🎧 BACKGROUND MUSIC */
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

if (bgMusic) {
  bgMusic.volume = 0.25;
}

if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", () => {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = "Studio Music On 🎶";
  });
}

/* Fallback: start music on first interaction */
document.addEventListener(
  "click",
  () => {
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().catch(() => {});
    }
  },
  { once: true }
);

const GRID_SIZE = 24;
let mouseDown = false;
let currentColor = colorPicker.value;

/* 🔥 100 CLEAN, NOT-CHILDISH THEMES */
const themes = [
  "Monochrome Ink","Soft Charcoal","Muted Pastel","Midnight Studio","Warm Paper",
  "Cool Slate","Minimal Beige","Modern Clay","Foggy Blue","Desert Sand",
  "Rose Dust","Cement Grey","Studio Olive","Muted Teal","Vintage Print",
  "Coffee Stain","Soft Lavender","Misty Green","Classic Noir","Editorial Cream",
  "Gallery White","Urban Steel","Autumn Ash","Cold Marble","Warm Linen",
  "Ink Wash","Soft Blush","Pine Shadow","Calm Sky","Neutral Taupe",
  "Sunlit Stone","Dusty Rose","Graphite","Muted Coral","Nordic Ice",
  "Museum Grey","Dry Ink","Old Paper","Soft Moss","Warm Shadow",
  "Chalkboard","Muted Indigo","Cool Concrete","Fog","Wheat Paper",
  "Soft Peach","Storm Cloud","Calm Clay","Olive Paper","Cool Sand",
  "Charcoal Wash","Muted Mint","Evening Blue","Natural Fiber","Warm Grey",
  "Soft Cocoa","Stone White","Inkwell","Light Ash","Parchment",
  "Soft Smoke","Neutral Sky","Warm Stone","Studio Cream","Cool Linen",
  "Quiet Blue","Dry Clay","Soft Olive","Muted Plum","Calm Shadow",
  "Winter Fog","Natural Cotton","Warm Chalk","Ink Grey","Soft Slate",
  "Paper White","Muted Bronze","Cool Fog","Studio Neutral","Balanced Grey"
];

/* Populate theme dropdown */
themes.forEach(theme => {
  const option = document.createElement("option");
  option.value = theme;
  option.textContent = theme;
  themeSelect.appendChild(option);
});

/* Build grid */
grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 20px)`;

for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
  const pixel = document.createElement("div");
  pixel.className = "pixel";

  pixel.addEventListener("mousedown", () => {
    pixel.style.backgroundColor = currentColor;
  });

  pixel.addEventListener("mouseover", () => {
    if (mouseDown) {
      pixel.style.backgroundColor = currentColor;
    }
  });

  grid.appendChild(pixel);
}

/* Drag drawing */
document.body.addEventListener("mousedown", () => (mouseDown = true));
document.body.addEventListener("mouseup", () => (mouseDown = false));

/* Color picker */
colorPicker.addEventListener("input", e => {
  currentColor = e.target.value;
});

/* Theme logic (NO background changes) */
themeSelect.addEventListener("change", () => {
  console.log("Theme selected:", themeSelect.value);
});

/* Clear */
clearBtn.addEventListener("click", () => {
  document.querySelectorAll(".pixel").forEach(p => {
    p.style.backgroundColor = "white";
  });
});

/* Save PNG (VIP quality, no watermark) */
saveBtn.addEventListener("click", () => {
  const canvas = document.getElementById("exportCanvas");
  canvas.width = GRID_SIZE;
  canvas.height = GRID_SIZE;
  const ctx = canvas.getContext("2d");

  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach((pixel, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    ctx.fillStyle = pixel.style.backgroundColor || "white";
    ctx.fillRect(x, y, 1, 1);
  });

  const link = document.createElement("a");
  link.download = "pixel-art-vip.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
