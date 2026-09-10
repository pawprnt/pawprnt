// cmds/help.js — help command output

export function execHelp(out, term, line) {
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
}
