function initTerminal(container) {
  const term = document.createElement("div");
  term.className = "term";
  container.appendChild(term);

  const out = {
    add(text, cls, bold) {
      const div = document.createElement("div");
      if (cls) div.className = cls;
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
        out.add("available commands:", "c-accent");
        [
          ["help", "show this list"],
          ["neofetch", "show system info"],
          ["ls [path]", "list files"],
          ["cd <dir>", "change directory"],
          ["cat <file>", "read a file"],
          ["pwd", "print working dir"],
          ["whoami", "who am i"],
          ["echo <text>", "print text"],
          ["open <app>", "open an app (terminal, files, about, projects)"],
          ["date", "show the date"],
          ["clear", "clear the screen"],
          ["exit", "close this window"],
        ].forEach(([c, d]) => {
          const div = document.createElement("div");
          const k = document.createElement("span");
          k.className = "c-green";
          k.textContent = c.padEnd(14, " ");
          const v = document.createElement("span");
          v.className = "c-dim";
          v.textContent = d;
          div.appendChild(k);
          div.appendChild(v);
          term.insertBefore(div, line);
        });
        break;
      case "neofetch":
        printNeofetch(out);
        break;
      case "ls": {
        const target = resolvePath(args[0] || ".", cwd);
        if (!target) {
          out.add("ls: " + (args[0] || ".") + ": no such file or directory", "c-red");
          break;
        }
        const list = dirList(target);
        if (!list) {
          out.add("ls: " + (args[0] || ".") + ": not a directory", "c-red");
          break;
        }
        if (!list.length) break;
        const div = document.createElement("div");
        list.forEach((e) => {
          const s = document.createElement("span");
          s.className = e.dir ? "c-accent" : "c-fg";
          if (e.dir) s.textContent = e.name + "/ ";
          else s.textContent = e.name + "  ";
          div.appendChild(s);
        });
        term.insertBefore(div, line);
        break;
      }
      case "cd": {
        const target = args[0] || "/home/paw";
        const node = resolvePath(target, cwd);
        if (!node || !nodeIsDir(node)) {
          out.add("cd: " + target + ": no such directory", "c-red");
          break;
        }
        cwd = (target.startsWith("/") ? target : cwd + "/" + target)
          .split("/")
          .filter((p) => p && p !== ".")
          .reduce((acc, p) => (p === ".." ? acc.slice(0, -1) : acc.concat(p)), [])
          .join("/");
        if (!cwd) cwd = "/";
        refreshPrompt();
        break;
      }
      case "cat": {
        if (!args.length) {
          out.add("cat: missing file operand", "c-red");
          break;
        }
        const node = resolvePath(args[0], cwd);
        if (!node) {
          out.add("cat: " + args[0] + ": no such file", "c-red");
          break;
        }
        if (nodeIsDir(node)) {
          out.add("cat: " + args[0] + ": is a directory", "c-red");
          break;
        }
        node.split("\n").forEach((l) => out.add(l));
        break;
      }
      case "pwd":
        out.add(cwd);
        break;
      case "whoami":
        out.add("foxinwinter");
        break;
      case "echo":
        out.add(args.join(" "));
        break;
      case "open": {
        const app = args[0];
        if (APPS[app]) {
          APPS[app].open();
          out.add("opening " + app + " ...", "c-dim");
        } else {
          out.add("open: unknown app '" + (app || "") + "'", "c-red");
          out.add("apps: " + Object.keys(APPS).join(", "), "c-dim");
        }
        break;
      }
      case "date":
        out.add(new Date().toString());
        break;
      case "clear":
        Array.from(term.children).forEach((c) => {
          if (c !== line) c.remove();
        });
        break;
      case "exit":
        WM.layer.querySelectorAll(".win").forEach((w) => {
          if (w.contains(term)) w.remove();
        });
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

  term.addEventListener("mousedown", () => input.focus());

  refreshPrompt();
  printNeofetch(out);
  out.add("type 'help' for available commands", "c-dim");
  term.scrollTop = term.scrollHeight;
  input.focus();
}
