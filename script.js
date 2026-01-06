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

let gridSize = 32;
let isPainting = false;
let erasing = false;

function createGrid(size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 16px)`;

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixel.style.width = "16px";
    pixel.style.height = "16px";

    pixel.addEventListener("mousedown", () => paint(pixel));
    pixel.addEventListener("mouseover", () => {
      if (isPainting) paint(pixel);
    });

    grid.appendChild(pixel);
  }
}

function paint(pixel) {
  if (erasing) {
    pixel.style.background = "white";
    return;
  }

  const color = colorPicker.value;
  pixel.style.background = color;

  const index = [...grid.children].indexOf(pixel);
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);

  if (brushType.value === "mirror-h") {
    const mirror = grid.children[y * gridSize + (gridSize - x - 1)];
    mirror.style.background = color;
  }

  if (brushType.value === "mirror-v") {
    const mirror = grid.children[(gridSize - y - 1) * gridSize + x];
    mirror.style.background = color;
  }
}

document.body.addEventListener("mousedown", () => isPainting = true);
document.body.addEventListener("mouseup", () => isPainting = false);

eraserBtn.onclick = () => erasing = !erasing;

clearBtn.onclick = () => {
  document.querySelectorAll(".pixel").forEach(p => p.style.background = "white");
};

resizeBtn.onclick = () => {
  gridSize = Number(gridSizeSelect.value);
  createGrid(gridSize);
};

saveBtn.onclick = () => {
  const size = Number(document.getElementById("exportSize").value);
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctx = exportCanvas.getContext("2d");
  const pixels = document.querySelectorAll(".pixel");
  const scale = size / gridSize;

  pixels.forEach((p, i) => {
    ctx.fillStyle = p.style.background || "white";
    ctx.fillRect(
      (i % gridSize) * scale,
      Math.floor(i / gridSize) * scale,
      scale,
      scale
    );
  });

  const link = document.createElement("a");
  link.download = "pixel-art-vip.png";
  link.href = exportCanvas.toDataURL();
  link.click();
};

createGrid(gridSize);
