// cmds/neofetch.js — neofetch system info display

function neofetchAscii() {
  return "   ,     ,\n   )\\_._/(\n  =>  Y  <=\n  /       \\\n  \\       /\n   \\     /\n    )|(\n     \" \"";
}

export function printNeofetch(out) {
  out.add("pawprntos 0.1", "c-pink", true);
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
