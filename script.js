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
const paletteToggle = document.getElementById("paletteToggle");
const palettePanel = document.getElementById("palettePanel");
const languageSelect = document.getElementById("languageSelect");
const darkModeToggle = document.getElementById("darkModeToggle");
const ditherStrengthInput = document.getElementById("ditherStrength");
const ditherStrengthValue = document.getElementById("ditherStrengthValue");
const detailPreserveInput = document.getElementById("detailPreserve");
const detailPreserveValue = document.getElementById("detailPreserveValue");
const ditherStrengthControl = document.getElementById("ditherStrengthControl");
const detailPreserveControl = document.getElementById("detailPreserveControl");
const layersGrid = document.getElementById("layersGrid");
const layersCount = document.getElementById("layersCount");
const layersSelectAll = document.getElementById("layersSelectAll");
const layersClear = document.getElementById("layersClear");
const layersToggle = document.getElementById("layersToggle");
const originalCanvas = document.getElementById("originalCanvas");
const outputCanvas = document.getElementById("outputCanvas");
const originalWrap = originalCanvas.closest(".canvas-wrap");
const outputWrap = outputCanvas.closest(".canvas-wrap");
const pixelTooltip = document.getElementById("pixelTooltip");
const pixelSample = document.getElementById("pixelSample");
const pixelMeta = document.getElementById("pixelMeta");
const adSlot = document.getElementById("adSlot");
const adFallback = document.getElementById("adFallback");
const adFallbackImage = document.getElementById("adFallbackImage");

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

const colorNames = {
  en: {
    "#000000": "Black",
    "#3c3c3c": "Dark Gray",
    "#787878": "Gray",
    "#aaaaaa": "Medium Gray",
    "#d2d2d2": "Light Gray",
    "#ffffff": "White",
    "#600018": "Deep Red",
    "#a50e1e": "Dark Red",
    "#ed1c24": "Red",
    "#fa8072": "Light Red",
    "#e45c1a": "Dark Orange",
    "#ff7f27": "Orange",
    "#f6aa09": "Gold",
    "#f9dd3b": "Yellow",
    "#fffabc": "Light Yellow",
    "#9c8431": "Dark Goldenrod",
    "#c5ad31": "Goldenrod",
    "#e8d45f": "Light Goldenrod",
    "#4a6b3a": "Dark Olive",
    "#5a944a": "Olive",
    "#84c573": "Light Olive",
    "#0eb968": "Dark Green",
    "#13e67b": "Green",
    "#87ff5e": "Light Green",
    "#0c816e": "Dark Teal",
    "#10aea6": "Teal",
    "#13e1be": "Light Teal",
    "#0f799f": "Dark Cyan",
    "#60f7f2": "Cyan",
    "#bbfaf2": "Light Cyan",
    "#28509e": "Dark Blue",
    "#4093e4": "Blue",
    "#7dc7ff": "Light Blue",
    "#4d31b8": "Dark Indigo",
    "#6b50f6": "Indigo",
    "#99b1fb": "Light Indigo",
    "#4a4284": "Dark Slate Blue",
    "#7a71c4": "Slate Blue",
    "#b5aef1": "Light Slate Blue",
    "#780c99": "Dark Purple",
    "#aa38b9": "Purple",
    "#e09ff9": "Light Purple",
    "#cb007a": "Dark Pink",
    "#ec1f80": "Pink",
    "#f38da9": "Light Pink",
    "#9b5249": "Dark Peach",
    "#d18078": "Peach",
    "#fab6a4": "Light Peach",
    "#684634": "Dark Brown",
    "#95682a": "Brown",
    "#dba463": "Light Brown",
    "#7b6352": "Dark Tan",
    "#9c846b": "Tan",
    "#d6b594": "Light Tan",
    "#d18051": "Dark Beige",
    "#f8b277": "Beige",
    "#ffc5a5": "Light Beige",
    "#6d643f": "Dark Stone",
    "#948c6b": "Stone",
    "#cdc59e": "Light Stone",
    "#333941": "Dark Slate",
    "#6d758d": "Slate",
    "#b3b9d1": "Light Slate",
  },
};

const translations = {
  es: {
    eyebrow: "Wplace tools",
    heroTitle: "Convierte tu imagen en pixel art",
    heroLede:
      "Sube una imagen, elige un modo de conversión y ajusta el tamaño del píxel. El resultado se genera en tiempo real para preparar tu arte en wplace.",
    language: "Idioma",
    langSpanish: "Español",
    langEnglish: "Inglés",
    langPortuguese: "Portugués",
    langGerman: "Alemán",
    langRussian: "Ruso",
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
    paletteToggle: "Paleta",
    paletteShow: "Mostrar paleta",
    paletteHide: "Ocultar paleta",
    inputImage: "Imagen de entrada",
    mode: "Modo",
    modePixelate: "Pixelado limpio",
    modeBlocks: "Bloques promedio",
    modePosterize: "Posterizado",
    modeGrayscale: "Escala de grises",
    modeBW: "Blanco y negro",
    modeDither: "Tramado (Floyd)",
    modeBayer: "Tramado (Bayer)",
    modeColorDither: "Tramado en color",
    modeSepia: "Sepia",
    modeInvert: "Invertido",
    modeEdges: "Contornos",
    ditherStrength: "Intensidad de dithering",
    detailPreserve: "Preservacion de detalle",
    pixelSize: "Tamaño del píxel",
    colorLevels: "Niveles de color",
    outputSize: "Dimensiones de salida (px)",
    widthPlaceholder: "Ancho",
    heightPlaceholder: "Alto",
    sizeHintAuto: "Auto según la imagen",
    sizeOutput: "Salida: {width} x {height} px",
    paletteTitle: "Paleta activa",
    paletteHint: "Selecciona los colores permitidos para el pixel art.",
    paletteSelectAll: "Seleccionar todo",
    paletteClear: "Limpiar",
    paletteCount: "{count} activos",
    paletteMin: "Mínimo 1 color seleccionado.",
    layersTitle: "Capas por color",
    layersHint: "Muestra u oculta colores en el resultado sin alterar la paleta.",
    layersSelectAll: "Mostrar todo",
    layersClear: "Ocultar todo",
    layersToggle: "Ver por capas",
    layersCount: "{count} visibles",
    layersSummary: "Capas por color",
    originalTitle: "Original",
    originalSubtitle: "Referencia",
    pixelArtTitle: "Pixel art",
    pixelArtSubtitle: "Resultado",
    pixelHoverHint: "Pasa el cursor para ver el color y la posición.",
    pixelInfo: "Color: {color} · Posición: {x},{y}",
    adSlot: "Espacio para anuncio de Google (728x90)",
    tipsPaletteTitle: "Paleta personalizada",
    tipsPaletteBody: "Marca los tonos que quieras usar. Todo el pixel art se ajusta a esa paleta.",
    tipsScaleTitle: "Controla la escala",
    tipsScaleBody: "Define el ancho o el alto y la otra medida se calcula automáticamente.",
  },
  en: {
    eyebrow: "Wplace tools",
    heroTitle: "Turn your image into pixel art",
    heroLede:
      "Upload an image, choose a conversion mode, and adjust pixel size. The result updates in real time to prep your art for wplace.",
    language: "Language",
    langSpanish: "Spanish",
    langEnglish: "English",
    langPortuguese: "Portuguese",
    langGerman: "German",
    langRussian: "Russian",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    paletteToggle: "Palette",
    paletteShow: "Show palette",
    paletteHide: "Hide palette",
    inputImage: "Input image",
    mode: "Mode",
    modePixelate: "Clean pixelate",
    modeBlocks: "Average blocks",
    modePosterize: "Posterize",
    modeGrayscale: "Grayscale",
    modeBW: "Black and white",
    modeDither: "Dither (Floyd)",
    modeBayer: "Dither (Bayer)",
    modeColorDither: "Color dither",
    modeSepia: "Sepia",
    modeInvert: "Invert",
    modeEdges: "Edges",
    ditherStrength: "Dither strength",
    detailPreserve: "Detail preservation",
    pixelSize: "Pixel size",
    colorLevels: "Color levels",
    outputSize: "Output size (px)",
    widthPlaceholder: "Width",
    heightPlaceholder: "Height",
    sizeHintAuto: "Auto from image",
    sizeOutput: "Output: {width} x {height} px",
    paletteTitle: "Active palette",
    paletteHint: "Select the allowed colors for the pixel art.",
    paletteSelectAll: "Select all",
    paletteClear: "Clear",
    paletteCount: "{count} active",
    paletteMin: "At least 1 color selected.",
    layersTitle: "Color layers",
    layersHint: "Show or hide colors in the result without changing the palette.",
    layersSelectAll: "Show all",
    layersClear: "Hide all",
    layersToggle: "View layers",
    layersCount: "{count} visible",
    layersSummary: "Color layers",
    originalTitle: "Original",
    originalSubtitle: "Reference",
    pixelArtTitle: "Pixel art",
    pixelArtSubtitle: "Result",
    pixelHoverHint: "Hover to see color and position.",
    pixelInfo: "Color: {color} · Position: {x},{y}",
    adSlot: "Google ad slot (728x90)",
    tipsPaletteTitle: "Custom palette",
    tipsPaletteBody: "Pick the tones you want to use. All pixel art snaps to that palette.",
    tipsScaleTitle: "Control the scale",
    tipsScaleBody: "Set width or height and the other side updates automatically.",
  },
  pt: {
    eyebrow: "Wplace tools",
    heroTitle: "Transforme sua imagem em pixel art",
    heroLede:
      "Envie uma imagem, escolha um modo de conversao e ajuste o tamanho do pixel. O resultado atualiza em tempo real para preparar sua arte no wplace.",
    language: "Idioma",
    langSpanish: "Espanhol",
    langEnglish: "Ingles",
    langPortuguese: "Portugues",
    langGerman: "Alemao",
    langRussian: "Russo",
    darkMode: "Modo escuro",
    lightMode: "Modo claro",
    paletteToggle: "Paleta",
    paletteShow: "Mostrar paleta",
    paletteHide: "Ocultar paleta",
    inputImage: "Imagem de entrada",
    mode: "Modo",
    modePixelate: "Pixelado limpo",
    modeBlocks: "Blocos medios",
    modePosterize: "Posterizar",
    modeGrayscale: "Escala de cinza",
    modeBW: "Preto e branco",
    modeDither: "Dither (Floyd)",
    modeBayer: "Dither (Bayer)",
    modeColorDither: "Dither em cor",
    modeSepia: "Sepia",
    modeInvert: "Invertido",
    modeEdges: "Bordas",
    ditherStrength: "Intensidade do dither",
    detailPreserve: "Preservacao de detalhe",
    pixelSize: "Tamanho do pixel",
    colorLevels: "Niveis de cor",
    outputSize: "Dimensoes de saida (px)",
    widthPlaceholder: "Largura",
    heightPlaceholder: "Altura",
    sizeHintAuto: "Auto pela imagem",
    sizeOutput: "Saida: {width} x {height} px",
    paletteTitle: "Paleta ativa",
    paletteHint: "Selecione as cores permitidas para o pixel art.",
    paletteSelectAll: "Selecionar tudo",
    paletteClear: "Limpar",
    paletteCount: "{count} ativos",
    paletteMin: "Minimo de 1 cor selecionada.",
    layersTitle: "Camadas por cor",
    layersHint: "Mostre ou oculte cores no resultado sem alterar a paleta.",
    layersSelectAll: "Mostrar tudo",
    layersClear: "Ocultar tudo",
    layersToggle: "Ver camadas",
    layersCount: "{count} visiveis",
    layersSummary: "Camadas por cor",
    originalTitle: "Original",
    originalSubtitle: "Referencia",
    pixelArtTitle: "Pixel art",
    pixelArtSubtitle: "Resultado",
    pixelHoverHint: "Passe o cursor para ver cor e posicao.",
    pixelInfo: "Cor: {color} · Posicao: {x},{y}",
    adSlot: "Espaco para anuncio do Google (728x90)",
    tipsPaletteTitle: "Paleta personalizada",
    tipsPaletteBody: "Marque os tons que deseja usar. Todo o pixel art se ajusta a essa paleta.",
    tipsScaleTitle: "Controle a escala",
    tipsScaleBody: "Defina a largura ou a altura e a outra medida e calculada automaticamente.",
  },
  de: {
    eyebrow: "Wplace tools",
    heroTitle: "Verwandle dein Bild in Pixel Art",
    heroLede:
      "Lade ein Bild hoch, wähle einen Modus und passe die Pixelgrosse an. Das Ergebnis aktualisiert sich in Echtzeit für wplace.",
    language: "Sprache",
    langSpanish: "Spanisch",
    langEnglish: "Englisch",
    langPortuguese: "Portugiesisch",
    langGerman: "Deutsch",
    langRussian: "Russisch",
    darkMode: "Dunkelmodus",
    lightMode: "Hellmodus",
    paletteToggle: "Palette",
    paletteShow: "Palette anzeigen",
    paletteHide: "Palette ausblenden",
    inputImage: "Eingabebild",
    mode: "Modus",
    modePixelate: "Saubere Pixelung",
    modeBlocks: "Durchschnittliche Blöcke",
    modePosterize: "Posterize",
    modeGrayscale: "Graustufen",
    modeBW: "Schwarzweiß",
    modeDither: "Dithering (Floyd)",
    modeBayer: "Dithering (Bayer)",
    modeColorDither: "Farbiges Dithering",
    modeSepia: "Sepia",
    modeInvert: "Invertieren",
    modeEdges: "Kanten",
    ditherStrength: "Dither-Starke",
    detailPreserve: "Detailerhalt",
    pixelSize: "Pixelgrosse",
    colorLevels: "Farbstufen",
    outputSize: "Ausgabeabmessungen (px)",
    widthPlaceholder: "Breite",
    heightPlaceholder: "Hohe",
    sizeHintAuto: "Automatisch aus dem Bild",
    sizeOutput: "Ausgabe: {width} x {height} px",
    paletteTitle: "Aktive Palette",
    paletteHint: "Wahle die erlaubten Farben fur die Pixel Art.",
    paletteSelectAll: "Alles auswahlen",
    paletteClear: "Leeren",
    paletteCount: "{count} aktiv",
    paletteMin: "Mindestens 1 Farbe ausgewahlt.",
    layersTitle: "Farb-Ebenen",
    layersHint: "Farben im Ergebnis ein- oder ausblenden, ohne die Palette zu andern.",
    layersSelectAll: "Alles zeigen",
    layersClear: "Alles ausblenden",
    layersToggle: "Ebenen anzeigen",
    layersCount: "{count} sichtbar",
    layersSummary: "Farb-Ebenen",
    originalTitle: "Original",
    originalSubtitle: "Referenz",
    pixelArtTitle: "Pixel art",
    pixelArtSubtitle: "Ergebnis",
    pixelHoverHint: "Bewegen zum Anzeigen von Farbe und Position.",
    pixelInfo: "Farbe: {color} · Position: {x},{y}",
    adSlot: "Google-Werbeflache (728x90)",
    tipsPaletteTitle: "Benutzerdefinierte Palette",
    tipsPaletteBody: "Wahle die Tone, die du nutzen willst. Alles richtet sich nach dieser Palette.",
    tipsScaleTitle: "Skalierung steuern",
    tipsScaleBody: "Lege Breite oder Hohe fest, die andere Seite wird automatisch berechnet.",
  },
  ru: {
    eyebrow: "Wplace tools",
    heroTitle: "Преобразуйте изображение в пиксель-арт",
    heroLede:
      "Загрузите изображение, выберите режим и настройте размер пикселя. Результат обновляется в реальном времени для wplace.",
    language: "Язык",
    langSpanish: "Испанский",
    langEnglish: "Английский",
    langPortuguese: "Португальский",
    langGerman: "Немецкий",
    langRussian: "Русский",
    darkMode: "Темный режим",
    lightMode: "Светлый режим",
    paletteToggle: "Палитра",
    paletteShow: "Показать палитру",
    paletteHide: "Скрыть палитру",
    inputImage: "Исходное изображение",
    mode: "Режим",
    modePixelate: "Чистая пикселизация",
    modeBlocks: "Средние блоки",
    modePosterize: "Постеризация",
    modeGrayscale: "Оттенки серого",
    modeBW: "Черно-белый",
    modeDither: "Дизеринг (Флойд)",
    modeBayer: "Дизеринг (Байер)",
    modeSepia: "Сепия",
    modeInvert: "Инверсия",
    modeEdges: "Контуры",
    pixelSize: "Размер пикселя",
    colorLevels: "Уровни цвета",
    outputSize: "Размер вывода (px)",
    widthPlaceholder: "Ширина",
    heightPlaceholder: "Высота",
    sizeHintAuto: "Авто по изображению",
    sizeOutput: "Вывод: {width} x {height} px",
    paletteTitle: "Активная палитра",
    paletteHint: "Выберите допустимые цвета для пиксель-арта.",
    paletteSelectAll: "Выбрать все",
    paletteClear: "Очистить",
    paletteCount: "{count} активно",
    paletteMin: "Минимум 1 цвет выбран.",
    layersTitle: "Слои по цветам",
    layersHint: "Показывайте или скрывайте цвета в результате без изменения палитры.",
    layersSelectAll: "Показать все",
    layersClear: "Скрыть все",
    layersToggle: "Показать слои",
    layersCount: "{count} видно",
    layersSummary: "Слои по цветам",
    originalTitle: "Оригинал",
    originalSubtitle: "Референс",
    pixelArtTitle: "Пиксель-арт",
    pixelArtSubtitle: "Результат",
    pixelHoverHint: "Наведите курсор, чтобы увидеть цвет и позицию.",
    pixelInfo: "Цвет: {color} · Позиция: {x},{y}",
    adSlot: "Место для рекламы Google (728x90)",
    tipsPaletteTitle: "Пользовательская палитра",
    tipsPaletteBody: "Отметьте нужные тона. Весь пиксель-арт будет подстроен под эту палитру.",
    tipsScaleTitle: "Управляйте масштабом",
    tipsScaleBody: "Задайте ширину или высоту, другая сторона посчитается автоматически.",
  },
};

const paletteState = new Map(paletteHex.map((hex) => [hex, true]));
const layerState = new Map(paletteHex.map((hex) => [hex, true]));
let activePalette = [];
let currentLang = document.documentElement.lang || "es";
let lastSize = null;
let outputImageData = null;
let isDarkMode = false;
let paletteCollapsed = false;
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let dragStartX = 0;
let dragStartY = 0;
let lastWrapWidth = 0;
let lastWrapHeight = 0;

const MAX_DIMENSION = 720;
const MIN_DIMENSION = 16;
const MAX_USER_DIMENSION = 2000;
const adFallbackConfig = {
  image: "ad-fallback.jpg",
  link: "https://example.com",
};

const hexToRgb = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const paletteRgbMap = new Map(paletteHex.map((hex) => [hex, hexToRgb(hex)]));

const formatTemplate = (template, vars) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));

const t = (key, vars = {}) => {
  const table = translations[currentLang] || translations.es;
  const fallback = translations.es;
  const template = table[key] || fallback[key] || "";
  return formatTemplate(template, vars);
};

const normalizeHex = (hex) => hex.toLowerCase();

const getColorName = (hex) => {
  const normalized = normalizeHex(hex);
  const names = colorNames[currentLang] || colorNames.en;
  return (names && names[normalized]) || colorNames.es[normalized] || normalized;
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`.toLowerCase();

const updateActivePalette = () => {
  const activeHex = paletteHex.filter((hex) => paletteState.get(hex));
  activePalette = activeHex.map(hexToRgb);
  paletteCount.textContent = t("paletteCount", { count: activePalette.length });
};

const updateLayersCount = () => {
  const visibleCount = paletteHex.reduce(
    (count, hex) => count + (layerState.get(hex) ? 1 : 0),
    0
  );
  layersCount.textContent = t("layersCount", { count: visibleCount });
};

const syncPaletteButtons = () => {
  paletteGrid.querySelectorAll(".swatch").forEach((button) => {
    const hex = button.dataset.hex;
    const isActive = paletteState.get(hex);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const syncLayerButtons = () => {
  layersGrid.querySelectorAll(".swatch").forEach((button) => {
    const hex = button.dataset.hex;
    const isVisible = layerState.get(hex);
    button.classList.toggle("active", isVisible);
    button.setAttribute("aria-pressed", String(isVisible));
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
    const swatchLabel = document.createElement("span");
    swatchLabel.className = "swatch-label";
    swatchLabel.textContent = getColorName(hex);
    button.appendChild(swatchLabel);
    button.title = getColorName(hex);
    button.setAttribute("aria-label", getColorName(hex));
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
      showSwatchLabel(button);
    });
    paletteGrid.appendChild(button);
  });
};

const buildLayersGrid = () => {
  layersGrid.innerHTML = "";
  paletteHex.forEach((hex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch active";
    button.style.backgroundColor = hex;
    button.dataset.hex = hex;
    button.setAttribute("aria-pressed", "true");
    const swatchLabel = document.createElement("span");
    swatchLabel.className = "swatch-label";
    swatchLabel.textContent = getColorName(hex);
    button.appendChild(swatchLabel);
    button.title = getColorName(hex);
    button.setAttribute("aria-label", getColorName(hex));
    button.addEventListener("click", () => {
      const isVisible = layerState.get(hex);
      layerState.set(hex, !isVisible);
      syncLayerButtons();
      updateLayersCount();
      render();
      showSwatchLabel(button);
    });
    layersGrid.appendChild(button);
  });
};

const swatchLabelTimeouts = new WeakMap();

const showSwatchLabel = (button) => {
  const timeout = swatchLabelTimeouts.get(button);
  if (timeout) {
    clearTimeout(timeout);
  }
  button.classList.add("show-label");
  const nextTimeout = setTimeout(() => {
    button.classList.remove("show-label");
  }, 1400);
  swatchLabelTimeouts.set(button, nextTimeout);
};

const updateSwatchLabels = () => {
  [paletteGrid, layersGrid].forEach((grid) => {
    grid.querySelectorAll(".swatch").forEach((button) => {
      const hex = button.dataset.hex;
      const name = getColorName(hex);
      const label = button.querySelector(".swatch-label");
      if (label) {
        label.textContent = name;
      }
      button.title = name;
      button.setAttribute("aria-label", name);
    });
  });
};

const updateRangeLabels = () => {
  pixelSizeValue.textContent = `${pixelSizeInput.value} px`;
  colorLevelsValue.textContent = colorLevelsInput.value;
  ditherStrengthValue.textContent = `${ditherStrengthInput.value}%`;
  detailPreserveValue.textContent = `${detailPreserveInput.value}%`;
};

const updateControls = () => {
  const mode = modeSelect.value;
  levelsControl.style.display = mode === "posterize" ? "flex" : "none";
  const showColorDither = mode === "colorDither";
  ditherStrengthControl.style.display = showColorDither ? "flex" : "none";
  detailPreserveControl.style.display = showColorDither ? "flex" : "none";
};

const updateDarkModeLabel = () => {
  darkModeToggle.textContent = isDarkMode ? t("lightMode") : t("darkMode");
};

const updatePaletteToggleLabel = () => {
  paletteToggle.textContent = paletteCollapsed ? t("paletteShow") : t("paletteHide");
};

const applyPaletteCollapsed = (collapsed) => {
  paletteCollapsed = collapsed;
  palettePanel.classList.toggle("palette-panel--collapsed", collapsed);
  updatePaletteToggleLabel();
};

const applyDarkMode = (enabled) => {
  isDarkMode = enabled;
  document.body.classList.toggle("dark", enabled);
  updateDarkModeLabel();
  localStorage.setItem("wplaceDarkMode", enabled ? "1" : "0");
};

const applyTranslations = (lang) => {
  currentLang = translations[lang] ? lang : "es";
  document.documentElement.lang = currentLang;
  languageSelect.value = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });

  document.querySelectorAll("[data-i18n-option]").forEach((element) => {
    const key = element.dataset.i18nOption;
    element.textContent = t(key);
  });

  updateSwatchLabels();
  updateActivePalette();
  updateLayersCount();
  if (lastSize) {
    updateSizeInfo(lastSize);
  } else {
    setSizeHint();
  }
  updateDarkModeLabel();
  updatePaletteToggleLabel();
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
  lastSize = size;
  sizeInfo.textContent = t("sizeOutput", {
    width: size.width,
    height: size.height,
  });
};

const setSizeHint = () => {
  lastSize = null;
  sizeInfo.textContent = t("sizeHintAuto");
};

const updateCanvasWraps = (size) => {
  if (!size) {
    return;
  }
  const ratio = `${size.width} / ${size.height}`;
  if (originalWrap) {
    originalWrap.style.aspectRatio = ratio;
  }
  if (outputWrap) {
    outputWrap.style.aspectRatio = ratio;
  }
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
  updateCanvasWraps(fitted);
  resetZoom();
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

const drawBaseImage = (ctx, sourceCanvas) => {
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
  ctx.drawImage(sourceCanvas, 0, 0);
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

const getClosestPaletteColor = (r, g, b, palette) => {
  let best = palette[0];
  let bestDistance = Infinity;
  for (const color of palette) {
    const dr = r - color[0];
    const dg = g - color[1];
    const db = b - color[2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDistance) {
      bestDistance = dist;
      best = color;
    }
  }
  return best;
};

const applyColorDither = (imageData, palette, strength, preserve) => {
  if (!palette.length) {
    return imageData;
  }
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const work = new Float32Array(data.length);
  for (let i = 0; i < data.length; i += 1) {
    work[i] = data[i];
  }

  const getEdgeFactor = (x, y, idx) => {
    let edge = 0;
    let samples = 0;
    if (x + 1 < width) {
      const rightIdx = idx + 4;
      edge +=
        Math.abs(work[idx] - work[rightIdx]) +
        Math.abs(work[idx + 1] - work[rightIdx + 1]) +
        Math.abs(work[idx + 2] - work[rightIdx + 2]);
      samples += 1;
    }
    if (y + 1 < height) {
      const downIdx = idx + width * 4;
      edge +=
        Math.abs(work[idx] - work[downIdx]) +
        Math.abs(work[idx + 1] - work[downIdx + 1]) +
        Math.abs(work[idx + 2] - work[downIdx + 2]);
      samples += 1;
    }
    if (!samples) {
      return 0;
    }
    return clamp(edge / (samples * 3 * 255), 0, 1);
  };

  const distribute = (x, y, errorR, errorG, errorB, factor) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return;
    }
    const idx = (y * width + x) * 4;
    work[idx] += errorR * factor;
    work[idx + 1] += errorG * factor;
    work[idx + 2] += errorB * factor;
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      const r = work[idx];
      const g = work[idx + 1];
      const b = work[idx + 2];
      const [pr, pg, pb] = getClosestPaletteColor(r, g, b, palette);
      data[idx] = pr;
      data[idx + 1] = pg;
      data[idx + 2] = pb;
      data[idx + 3] = 255;
      const errorR = r - pr;
      const errorG = g - pg;
      const errorB = b - pb;
      const edgeFactor = preserve > 0 ? getEdgeFactor(x, y, idx) : 0;
      const diffusion = strength * (1 - preserve * edgeFactor);
      if (diffusion <= 0) {
        continue;
      }
      distribute(x + 1, y, errorR, errorG, errorB, (7 / 16) * diffusion);
      distribute(x - 1, y + 1, errorR, errorG, errorB, (3 / 16) * diffusion);
      distribute(x, y + 1, errorR, errorG, errorB, (5 / 16) * diffusion);
      distribute(x + 1, y + 1, errorR, errorG, errorB, (1 / 16) * diffusion);
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

const applyLayerVisibility = (imageData) => {
  if (!layersToggle.checked) {
    return imageData;
  }
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
    const matchHex = paletteRgbMap.has(hex) ? hex : getClosestPaletteHex(data[i], data[i + 1], data[i + 2]);
    if (!layerState.get(matchHex)) {
      data[i + 3] = 0;
    }
  }
  return imageData;
};

const getCanvasPointer = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((event.clientX - rect.left) * scaleX);
  const y = Math.floor((event.clientY - rect.top) * scaleY);
  return {
    x: Math.min(canvas.width - 1, Math.max(0, x)),
    y: Math.min(canvas.height - 1, Math.max(0, y)),
  };
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const applyCanvasTransform = () => {
  outputCanvas.style.transformOrigin = "0 0";
  outputCanvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  outputCanvas.classList.toggle("is-zoomed", zoomLevel > 1);
};

const constrainPan = () => {
  if (!outputWrap) {
    return;
  }
  const wrapRect = outputWrap.getBoundingClientRect();
  const baseWidth = outputCanvas.offsetWidth;
  const baseHeight = outputCanvas.offsetHeight;
  const scaledWidth = baseWidth * zoomLevel;
  const scaledHeight = baseHeight * zoomLevel;

  if (scaledWidth <= wrapRect.width) {
    panX = (wrapRect.width - scaledWidth) / 2;
  } else {
    panX = clamp(panX, wrapRect.width - scaledWidth, 0);
  }

  if (scaledHeight <= wrapRect.height) {
    panY = (wrapRect.height - scaledHeight) / 2;
  } else {
    panY = clamp(panY, wrapRect.height - scaledHeight, 0);
  }
};

const resetZoom = () => {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  constrainPan();
  applyCanvasTransform();
  if (outputWrap) {
    const wrapRect = outputWrap.getBoundingClientRect();
    lastWrapWidth = wrapRect.width;
    lastWrapHeight = wrapRect.height;
  }
};

const applyZoom = (event) => {
  event.preventDefault();
  hidePixelTooltip();
  if (!baseImageReady) {
    return;
  }
  if (!outputWrap) {
    return;
  }
  const wrapRect = outputWrap.getBoundingClientRect();
  const offsetX = event.clientX - wrapRect.left;
  const offsetY = event.clientY - wrapRect.top;
  const zoomFactor = event.deltaY < 0 ? 1.12 : 0.9;
  const previousZoom = zoomLevel;
  zoomLevel = clamp(zoomLevel * zoomFactor, 1, 8);
  const zoomRatio = zoomLevel / previousZoom;
  panX = offsetX - (offsetX - panX) * zoomRatio;
  panY = offsetY - (offsetY - panY) * zoomRatio;
  constrainPan();
  applyCanvasTransform();
};

const startPan = (event) => {
  if (event.button !== 0 || !baseImageReady) {
    return;
  }
  isPanning = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  panStartX = panX;
  panStartY = panY;
  outputCanvas.setPointerCapture(event.pointerId);
  outputCanvas.classList.add("is-dragging");
  hidePixelTooltip();
};

const movePan = (event) => {
  if (!isPanning) {
    return;
  }
  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;
  panX = panStartX + deltaX;
  panY = panStartY + deltaY;
  constrainPan();
  applyCanvasTransform();
};

const endPan = (event) => {
  if (!isPanning) {
    return;
  }
  isPanning = false;
  outputCanvas.classList.remove("is-dragging");
  if (event.pointerId !== undefined) {
    outputCanvas.releasePointerCapture(event.pointerId);
  }
};

const handleResize = () => {
  if (!baseImageReady) {
    return;
  }
  if (!outputWrap) {
    return;
  }
  const wrapRect = outputWrap.getBoundingClientRect();
  if (
    (lastWrapWidth && wrapRect.width < lastWrapWidth) ||
    (lastWrapHeight && wrapRect.height < lastWrapHeight)
  ) {
    resetZoom();
  } else {
    constrainPan();
    applyCanvasTransform();
  }
  lastWrapWidth = wrapRect.width;
  lastWrapHeight = wrapRect.height;
};

const checkAdFallback = () => {
  if (!adSlot || !adFallback || !adFallbackImage) {
    return;
  }
  const hasAdContent =
    adSlot.dataset.adLoaded === "1" || adSlot.querySelector("iframe, ins, img, script");
  const adHidden = adSlot.offsetHeight === 0 || adSlot.offsetParent === null;
  if (adHidden || !hasAdContent) {
    adSlot.hidden = true;
    adFallback.hidden = false;
  } else {
    adSlot.hidden = false;
    adFallback.hidden = true;
  }
};

const initAdFallback = () => {
  if (!adSlot || !adFallback || !adFallbackImage) {
    return;
  }
  if (adFallbackConfig.image) {
    adFallbackImage.src = adFallbackConfig.image;
  }
  adFallback.href = adFallbackConfig.link || "#";
  setTimeout(checkAdFallback, 1200);
  window.addEventListener("load", () => {
    setTimeout(checkAdFallback, 1200);
  });
};

const getClosestPaletteHex = (r, g, b) => {
  let bestHex = paletteHex[0];
  let bestDistance = Infinity;
  paletteHex.forEach((hex) => {
    if (!paletteState.get(hex)) {
      return;
    }
    const [pr, pg, pb] = paletteRgbMap.get(hex);
    const dr = r - pr;
    const dg = g - pg;
    const db = b - pb;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDistance) {
      bestDistance = dist;
      bestHex = hex;
    }
  });
  return bestHex;
};

const hidePixelTooltip = () => {
  pixelTooltip.classList.remove("visible");
  pixelTooltip.setAttribute("aria-hidden", "true");
};

const showPixelTooltip = (event) => {
  event.preventDefault();
  if (!outputImageData) {
    return;
  }
  const { x, y } = getCanvasPointer(event, outputCanvas);
  const idx = (y * outputImageData.width + x) * 4;
  const r = outputImageData.data[idx];
  const g = outputImageData.data[idx + 1];
  const b = outputImageData.data[idx + 2];
  let hex = rgbToHex(r, g, b);
  if (!paletteRgbMap.has(hex)) {
    hex = getClosestPaletteHex(r, g, b);
  }
  const pixelSize = Number(pixelSizeInput.value);
  const cellX = Math.floor(x / pixelSize) + 1;
  const cellY = Math.floor(y / pixelSize) + 1;
  pixelSample.style.backgroundColor = hex;
  pixelMeta.textContent = t("pixelInfo", { color: getColorName(hex), x: cellX, y: cellY });

  const card = outputCanvas.closest(".card");
  const cardRect = card ? card.getBoundingClientRect() : outputCanvas.getBoundingClientRect();
  const offsetX = event.clientX - cardRect.left;
  const offsetY = event.clientY - cardRect.top;
  const padding = 12;
  const left = Math.min(Math.max(offsetX, padding), cardRect.width - padding);
  const top = Math.min(Math.max(offsetY, padding), cardRect.height - padding);
  pixelTooltip.style.left = `${left}px`;
  pixelTooltip.style.top = `${top}px`;
  pixelTooltip.classList.add("visible");
  pixelTooltip.setAttribute("aria-hidden", "false");
};

const render = () => {
  if (!baseImageReady) {
    return;
  }

  const pixelSize = Number(pixelSizeInput.value);
  const mode = modeSelect.value;

  outputCanvas.width = baseCanvas.width;
  outputCanvas.height = baseCanvas.height;

  const isDitherMode = mode === "dither" || mode === "bayer" || mode === "colorDither";
  if (isDitherMode) {
    drawBaseImage(outputCtx, baseCanvas);
  } else if (mode === "blocks") {
    drawPixelatedBlocks(outputCtx, baseCanvas, pixelSize);
  } else {
    drawPixelated(outputCtx, baseCanvas, pixelSize);
  }

  const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);

  if (mode === "colorDither") {
    const strength = Number(ditherStrengthInput.value) / 100;
    const preserve = Number(detailPreserveInput.value) / 100;
    applyColorDither(imageData, activePalette, strength, preserve);
  } else {
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
  }
  applyLayerVisibility(imageData);

  outputCtx.putImageData(imageData, 0, 0);
  outputImageData = imageData;
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

[languageSelect].forEach((control) => {
  control.addEventListener("change", (event) => {
    applyTranslations(event.target.value);
  });
});

darkModeToggle.addEventListener("click", () => {
  applyDarkMode(!isDarkMode);
});

paletteToggle.addEventListener("click", () => {
  applyPaletteCollapsed(!paletteCollapsed);
});

[pixelSizeInput, modeSelect, colorLevelsInput, ditherStrengthInput, detailPreserveInput].forEach((control) => {
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

layersSelectAll.addEventListener("click", () => {
  paletteHex.forEach((hex) => layerState.set(hex, true));
  syncLayerButtons();
  updateLayersCount();
  render();
});

layersClear.addEventListener("click", () => {
  paletteHex.forEach((hex) => layerState.set(hex, false));
  syncLayerButtons();
  updateLayersCount();
  render();
});

layersToggle.addEventListener("change", () => {
  render();
});

buildPaletteGrid();
buildLayersGrid();
updateRangeLabels();
updateControls();
updateActivePalette();
updateLayersCount();
setSizeHint();
applyTranslations(currentLang);
initAdFallback();

const savedTheme = localStorage.getItem("wplaceDarkMode");
if (savedTheme === null) {
  applyDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
} else {
  applyDarkMode(savedTheme === "1");
}

outputCanvas.addEventListener("contextmenu", showPixelTooltip);
outputCanvas.addEventListener("click", hidePixelTooltip);
outputCanvas.addEventListener("mouseleave", hidePixelTooltip);
outputCanvas.addEventListener("wheel", applyZoom, { passive: false });
outputCanvas.addEventListener("pointerdown", startPan);
outputCanvas.addEventListener("pointermove", movePan);
outputCanvas.addEventListener("pointerup", endPan);
outputCanvas.addEventListener("pointercancel", endPan);
outputCanvas.addEventListener("pointerleave", endPan);
window.addEventListener("resize", handleResize);