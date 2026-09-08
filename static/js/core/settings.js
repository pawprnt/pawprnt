// settings.js — global settings management for pawprntos
// accent colors, themes, motion, font sizes, and other preferences

// local storage key for settings
const SET_KEY = "pawprntos.settings";

const ACCENTS = [
  { name: "lavender", value: "#c7a2ff" },
  { name: "pink", value: "#ff9dd2" },
  { name: "mint", value: "#9be0a8" },
  { name: "sky", value: "#7fd1e0" },
  { name: "amber", value: "#ffd77a" },
  { name: "coral", value: "#ff8f8a" },
];

const DEFAULT_SETTINGS = {
  accent: "#c7a2ff",
  theme: "dark",
  motion: true,
  corners: true,
  blur: true,
  fontSize: "md",
  clock24: false,
  boot: true,
};

const FONT_SIZES = { sm: "14px", md: "16px", lg: "18px" };

// loads settings from localStorage, merging with defaults
function loadSettings() {
  try {
    return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SET_KEY) || "null"));
  } catch (e) {
    return Object.assign({}, DEFAULT_SETTINGS);
  }
}

// saves settings to localStorage
function saveSettings(s) {
  try { localStorage.setItem(SET_KEY, JSON.stringify(s)); } catch (e) {}
}

// applies settings to the document (theme, accent, motion, etc.)
function applySettings(s) {
  const set = s || loadSettings();
  const root = document.documentElement;
  root.dataset.theme = set.theme;
  root.style.setProperty("--accent", set.accent);
  root.dataset.motion = set.motion ? "on" : "off";
  root.dataset.corners = set.corners ? "on" : "off";
  root.dataset.blur = set.blur ? "on" : "off";
  root.style.fontSize = FONT_SIZES[set.fontSize] || "16px";
  if (window.__tickTaskClock) window.__tickTaskClock();
  if (window.__tickStatusClock) window.__tickStatusClock();
  return set;
}
