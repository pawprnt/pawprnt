// terminal/index.js — core terminal shell
// imports commands from cmds/ modules, handles input, routing, history

import { execHelp } from "./cmds/help.js";
import { printNeofetch } from "./cmds/neofetch.js";
import { execNav } from "./cmds/nav.js";
import { execHack } from "./cmds/hack.js";
import { execNotify } from "./cmds/notify.js";

function initTerminal(container) {
  const term = el("div", "term");
  container.appendChild(term);

  const out = {
    add(text, cls, bold) {
      const div = el("div", cls);
      if (bold) div.style.fontWeight = "bold";
      div.textContent = text;
      term.insertBefore(div, term.querySelector(".term-line"));
    },
  };

  let cwd = "/home/paw";
  const history = [];
  let histIdx = 0;

  const line = document.createElement("div");
  line.className = "term-line";
  const prompt = document.createElement("span");
  prompt.className = "term-prompt";
  const input = document.createElement("span");
  input.className = "term-input";
  input.contentEditable = "true";
  input.spellcheck = false;
  line.appendChild(prompt);
  line.appendChild(input);
  term.appendChild(line);

  function refreshPrompt() {
    prompt.textContent = "pawprnt@" + (cwd === "/" ? "/" : cwd.replace("/", "")) + ":$ ";
  }

  function exec(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "":
        break;
      case "help":
        execHelp(out, term, line);
        break;
      case "neofetch":
        printNeofetch(out);
        break;
      case "ls":
      case "cd":
      case "cat":
      case "pwd":
      case "whoami":
      case "echo":
      case "date":
      case "clear":
      case "exit":
        execNav(cmd, args, { out, term, line, getCwd: () => cwd, setCwd: (v) => { cwd = v; }, refreshPrompt });
        break;
      case "open": {
        const app = args[0];
        if (typeof APPS !== "undefined" && APPS[app]) {
          APPS[app].open();
          out.add("opening " + app + " ...", "c-dim");
        } else {
          out.add("open: unknown app '" + (app || "") + "'", "c-red");
          if (typeof APPS !== "undefined") out.add("apps: " + Object.keys(APPS).join(", "), "c-dim");
        }
        break;
      }
      case "notify":
        execNotify(args, out);
        break;
      case "hack":
        execHack(args, out);
        break;
      default:
        out.add(cmd + ": command not found", "c-red");
        out.add("type 'help' for available commands", "c-dim");
    }
  }

  function submit() {
    const raw = input.textContent;
    out.add("", "");
    const echo = document.createElement("div");
    const p = document.createElement("span");
    p.className = "term-prompt";
    p.textContent = prompt.textContent;
    const v = document.createElement("span");
    v.textContent = raw;
    echo.appendChild(p);
    echo.appendChild(v);
    term.insertBefore(echo, line);
    if (raw.trim()) history.push(raw);
    histIdx = history.length;
    input.textContent = "";
    exec(raw);
    term.scrollTop = term.scrollHeight;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.textContent = history[histIdx] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.textContent = history[histIdx];
      } else {
        histIdx = history.length;
        input.textContent = "";
      }
    }
  });

  term.addEventListener("mousedown", (e) => {
    e.preventDefault();
    input.focus();
  });

  term.addEventListener("click", () => input.focus());

  refreshPrompt();
  printNeofetch(out);
  out.add("type 'help' for available commands", "c-dim");
  term.scrollTop = term.scrollHeight;
  input.focus();
}

window.initTerminal = initTerminal;
