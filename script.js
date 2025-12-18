const fileInput = document.getElementById("fileInput");
const modeSelect = document.getElementById("modeSelect");
const pixelSizeInput = document.getElementById("pixelSize");
const pixelSizeValue = document.getElementById("pixelSizeValue");
const colorLevelsInput = document.getElementById("colorLevels");
const colorLevelsValue = document.getElementById("colorLevelsValue");
const levelsControl = document.getElementById("levelsControl");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const sizeInfo = document.getElementById("sizeInfo");
const paletteGrid = document.getElementById("paletteGrid");
const paletteCount = document.getElementById("paletteCount");
const paletteSelectAll = document.getElementById("paletteSelectAll");
const paletteClear = document.getElementById("paletteClear");
const originalCanvas = document.getElementById("originalCanvas");
const outputCanvas = document.getElementById("outputCanvas");

const originalCtx = originalCanvas.getContext("2d");
const outputCtx = outputCanvas.getContext("2d");

let baseCanvas = document.createElement("canvas");
let baseCtx = baseCanvas.getContext("2d");
let baseImageReady = false;
let sourceImage = null;

const paletteHex = [
  "#000000",
  "#3c3c3c",
  "#787878",
  "#aaaaaa",
  "#d2d2d2",
  "#ffffff",
  "#600018",
  "#a50e1e",
  "#ed1c24",
  "#fa8072",
  "#e45c1a",
  "#ff7f27",
  "#f6aa09",
  "#f9dd3b",
  "#fffabc",
  "#9c8431",
  "#c5ad31",
  "#e8d45f",
  "#4a6b3a",
  "#5a944a",
  "#84c573",
  "#0eb968",
  "#13e67b",
  "#87ff5e",
  "#0c816e",
  "#10aea6",
  "#13e1be",
  "#0f799f",
  "#60f7f2",
  "#bbfaf2",
  "#28509e",
  "#4093e4",
  "#7dc7ff",
  "#4d31b8",
  "#6b50f6",
  "#99b1fb",
  "#4a4284",
  "#7a71c4",
  "#b5aef1",
  "#780c99",
  "#aa38b9",
  "#e09ff9",
  "#cb007a",
  "#ec1f80",
  "#f38da9",
  "#9b5249",
  "#d18078",
  "#fab6a4",
  "#684634",
  "#95682a",
  "#dba463",
  "#7b6352",
  "#9c846b",
  "#d6b594",
  "#d18051",
  "#f8b277",
  "#ffc5a5",
  "#6d643f",
  "#948c6b",
  "#cdc59e",
  "#333941",
  "#6d758d",
  "#b3b9d1",
];

const paletteState = new Map(paletteHex.map((hex) => [hex, true]));
let activePalette = [];

const MAX_DIMENSION = 720;
const MIN_DIMENSION = 16;
const MAX_USER_DIMENSION = 2000;

const hexToRgb = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const updateActivePalette = () => {
  const activeHex = paletteHex.filter((hex) => paletteState.get(hex));
  activePalette = activeHex.map(hexToRgb);
  paletteCount.textContent = `${activePalette.length} activos`;
};

const syncPaletteButtons = () => {
  paletteGrid.querySelectorAll(".swatch").forEach((button) => {
    const hex = button.dataset.hex;
    const isActive = paletteState.get(hex);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const buildPaletteGrid = () => {
  paletteGrid.innerHTML = "";
  paletteHex.forEach((hex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch active";
    button.style.backgroundColor = hex;
    button.dataset.hex = hex;
    button.setAttribute("aria-pressed", "true");
    button.title = hex;
    button.addEventListener("click", () => {
      const isActive = paletteState.get(hex);
      const activeCount = paletteHex.reduce(
        (count, color) => count + (paletteState.get(color) ? 1 : 0),
        0
      );
      if (isActive && activeCount === 1) {
        return;
      }
      paletteState.set(hex, !isActive);
      syncPaletteButtons();
      updateActivePalette();
      render();
    });
    paletteGrid.appendChild(button);
  });
};

const updateRangeLabels = () => {
  pixelSizeValue.textContent = `${pixelSizeInput.value} px`;
  colorLevelsValue.textContent = colorLevelsInput.value;
};

const updateControls = () => {
  const mode = modeSelect.value;
  levelsControl.style.display = mode === "posterize" ? "flex" : "none";
};

const parseDimension = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.min(MAX_USER_DIMENSION, Math.max(MIN_DIMENSION, Math.round(parsed)));
};

const fitImage = (img, maxDimension) => {
  const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
  return {
    width: Math.round(img.width * ratio),
    height: Math.round(img.height * ratio),
  };
};

const getTargetSize = (img) => {
  const targetWidth = parseDimension(widthInput.value);
  const targetHeight = parseDimension(heightInput.value);

  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight };
  }

  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round((targetWidth * img.height) / img.width),
    };
  }

  if (targetHeight) {
    return {
      width: Math.round((targetHeight * img.width) / img.height),
      height: targetHeight,
    };
  }

  return fitImage(img, MAX_DIMENSION);
};

const updateSizeInfo = (size) => {
  sizeInfo.textContent = `Salida: ${size.width} x ${size.height} px`;
};

const drawToBase = (img) => {
  const fitted = getTargetSize(img);
  baseCanvas.width = fitted.width;
  baseCanvas.height = fitted.height;
  baseCtx.clearRect(0, 0, fitted.width, fitted.height);
  baseCtx.drawImage(img, 0, 0, fitted.width, fitted.height);
  baseImageReady = true;

  originalCanvas.width = fitted.width;
  originalCanvas.height = fitted.height;
  originalCtx.clearRect(0, 0, fitted.width, fitted.height);
  originalCtx.drawImage(baseCanvas, 0, 0);
  updateSizeInfo(fitted);
};

const drawPixelated = (ctx, sourceCanvas, pixelSize) => {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const smallWidth = Math.max(1, Math.floor(width / pixelSize));
  const smallHeight = Math.max(1, Math.floor(height / pixelSize));

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = smallWidth;
  tempCanvas.height = smallHeight;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.imageSmoothingEnabled = true;
  tempCtx.drawImage(sourceCanvas, 0, 0, smallWidth, smallHeight);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0, width, height);
};

const drawPixelatedBlocks = (ctx, sourceCanvas, pixelSize) => {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const sourceData = baseCtx.getImageData(0, 0, width, height).data;
  ctx.clearRect(0, 0, width, height);

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      const yEnd = Math.min(y + pixelSize, height);
      const xEnd = Math.min(x + pixelSize, width);

      for (let yy = y; yy < yEnd; yy += 1) {
        for (let xx = x; xx < xEnd; xx += 1) {
          const idx = (yy * width + xx) * 4;
          r += sourceData[idx];
          g += sourceData[idx + 1];
          b += sourceData[idx + 2];
          count += 1;
        }
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, xEnd - x, yEnd - y);
    }
  }
};

const posterize = (imageData, levels) => {
  const data = imageData.data;
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }
  return imageData;
};

const applyGrayscale = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const value = Math.round(luminance);
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  return imageData;
};

const applyBW = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const value = luminance > 140 ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  return imageData;
};

const applySepia = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
  return imageData;
};

const applyInvert = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
};

const applyDither = (imageData) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      const oldPixel = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      const newPixel = oldPixel < 128 ? 0 : 255;
      const error = oldPixel - newPixel;
      data[idx] = newPixel;
      data[idx + 1] = newPixel;
      data[idx + 2] = newPixel;

      const distribute = (dx, dy, factor) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          return;
        }
        const nidx = (ny * width + nx) * 4;
        data[nidx] = Math.min(255, Math.max(0, data[nidx] + error * factor));
        data[nidx + 1] = Math.min(255, Math.max(0, data[nidx + 1] + error * factor));
        data[nidx + 2] = Math.min(255, Math.max(0, data[nidx + 2] + error * factor));
      };

      distribute(1, 0, 7 / 16);
      distribute(-1, 1, 3 / 16);
      distribute(0, 1, 5 / 16);
      distribute(1, 1, 1 / 16);
    }
  }
  return imageData;
};

const applyBayerDither = (imageData) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      const luminance = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      const threshold = ((bayerMatrix[y % 4][x % 4] + 0.5) / 16) * 255;
      const value = luminance < threshold ? 0 : 255;
      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
    }
  }
  return imageData;
};

const applyEdges = (imageData) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const gray = new Float32Array(width * height);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 1) {
    gray[j] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  const output = new Uint8ClampedArray(data.length);
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let gx = 0;
      let gy = 0;
      let k = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const value = gray[(y + ky) * width + (x + kx)];
          gx += value * sobelX[k];
          gy += value * sobelY[k];
          k += 1;
        }
      }
      const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      const outIdx = (y * width + x) * 4;
      output[outIdx] = magnitude;
      output[outIdx + 1] = magnitude;
      output[outIdx + 2] = magnitude;
      output[outIdx + 3] = 255;
    }
  }

  data.set(output);
  return imageData;
};

const applyPalette = (imageData, palette) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let best = palette[0];
    let bestDistance = Infinity;
    for (const color of palette) {
      const dr = data[i] - color[0];
      const dg = data[i + 1] - color[1];
      const db = data[i + 2] - color[2];
      const dist = dr * dr + dg * dg + db * db;
      if (dist < bestDistance) {
        bestDistance = dist;
        best = color;
      }
    }
    data[i] = best[0];
    data[i + 1] = best[1];
    data[i + 2] = best[2];
  }
  return imageData;
};

const render = () => {
  if (!baseImageReady) {
    return;
  }

  const pixelSize = Number(pixelSizeInput.value);
  const mode = modeSelect.value;

  outputCanvas.width = baseCanvas.width;
  outputCanvas.height = baseCanvas.height;

  if (mode === "blocks") {
    drawPixelatedBlocks(outputCtx, baseCanvas, pixelSize);
  } else {
    drawPixelated(outputCtx, baseCanvas, pixelSize);
  }

  const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);

  if (mode === "posterize") {
    posterize(imageData, Number(colorLevelsInput.value));
  }

  if (mode === "grayscale") {
    applyGrayscale(imageData);
  }

  if (mode === "bw") {
    applyBW(imageData);
  }

  if (mode === "dither") {
    applyDither(imageData);
  }

  if (mode === "bayer") {
    applyBayerDither(imageData);
  }

  if (mode === "sepia") {
    applySepia(imageData);
  }

  if (mode === "invert") {
    applyInvert(imageData);
  }

  if (mode === "edges") {
    applyEdges(imageData);
  }

  applyPalette(imageData, activePalette);

  outputCtx.putImageData(imageData, 0, 0);
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      sourceImage = img;
      drawToBase(img);
      render();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

[pixelSizeInput, modeSelect, colorLevelsInput].forEach((control) => {
  control.addEventListener("input", () => {
    updateRangeLabels();
    updateControls();
    render();
  });
});

[widthInput, heightInput].forEach((control) => {
  control.addEventListener("input", () => {
    if (!sourceImage) {
      return;
    }
    drawToBase(sourceImage);
    render();
  });
});

paletteSelectAll.addEventListener("click", () => {
  paletteHex.forEach((hex) => paletteState.set(hex, true));
  syncPaletteButtons();
  updateActivePalette();
  render();
});

paletteClear.addEventListener("click", () => {
  paletteHex.forEach((hex) => paletteState.set(hex, false));
  paletteState.set(paletteHex[0], true);
  syncPaletteButtons();
  updateActivePalette();
  render();
});

buildPaletteGrid();
updateRangeLabels();
updateControls();
updateActivePalette();
