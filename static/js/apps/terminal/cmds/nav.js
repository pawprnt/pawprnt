// cmds/nav.js — navigation and file commands: ls, cd, cat, pwd, whoami, echo, date, clear, exit

export function execNav(cmd, args, ctx) {
  const { out, term, line, getCwd, setCwd, refreshPrompt } = ctx;

  switch (cmd) {
    case "ls": {
      const target = args[0] || ".";
      const node = resolvePath(target, getCwd());
      if (!node) {
        out.add("ls: " + target + ": no such file or directory", "c-red");
        break;
      }
      const list = dirList(node);
      if (!list) {
        out.add("ls: " + target + ": not a directory", "c-red");
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
      const node = resolvePath(target, getCwd());
      if (!node || !nodeIsDir(node)) {
        out.add("cd: " + target + ": no such directory", "c-red");
        break;
      }
      const newCwd = (target.startsWith("/") ? target : getCwd() + "/" + target)
        .split("/")
        .filter((p) => p && p !== ".")
        .reduce((acc, p) => (p === ".." ? acc.slice(0, -1) : acc.concat(p)), [])
        .join("/");
      setCwd(newCwd || "/");
      refreshPrompt();
      break;
    }
    case "cat": {
      if (!args.length) {
        out.add("cat: missing file operand", "c-red");
        break;
      }
      const node = resolvePath(args[0], getCwd());
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
      out.add(getCwd());
      break;
    case "whoami":
      out.add("foxinwinter");
      break;
    case "echo":
      out.add(args.join(" "));
      break;
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
      return false;
  }
  return true;
}
