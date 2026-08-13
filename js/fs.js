const FILESYSTEM = {
  "/": {
    home: {
      paw: {
        "bio.txt": "  ╱|、            sexuality: im pansexual!\n (˚ˎ 。7           model: femboy (he/him)\n  |、˜〵         uptime: 16 years\n  じしˍ,)ノ",
        "notes.txt": "pawprints left on everything i make.\nnothing here is finished. that's the point.\n",
        documents: {
          "ideas.txt": "make a fake os for the org.  [done]\nbuild a device mesh.            [later]\n",
        },
        projects: {
          "forager.md": "# forager\n\na game launcher for your local game library.\ngithub.com/pawprnt/forager\n",
          "tizentube.md": "# tizentube\n\nad-free youtube for samsung tizen tvs.\ngithub.com/pawprnt/tizentube\n",
          "tizenMngr.md": "# tizenMngr\n\ntizen security research notes.\ngithub.com/pawprnt/tizenMngr\n",
        },
      },
    },
    etc: {
      "motd": "welcome to pawprntos.\neverything here is a work in progress.\n",
      os_release: "NAME=\"pawprntos\"\nVERSION=\"0.1.0\"\nPRETTY_NAME=\"pawprntos 0.1\"\n",
    },
    usr: {
      share: {
        "ascii.txt": "   ,     ,\n   )\\_._/(\n  =>  Y  <=\n  /       \\\n  \\       /\n   \\     /\n    )|(\n     \" \"\n",
      },
    },
  },
};

function resolvePath(path, cwd) {
  if (!path) return null;
  const parts = (path.startsWith("/") ? path : cwd + "/" + path)
    .split("/")
    .filter((p) => p && p !== ".");
  const stack = [];
  for (const p of parts) {
    if (p === "..") stack.pop();
    else stack.push(p);
  }
  let node = FILESYSTEM["/"];
  for (const p of stack) {
    if (node && typeof node === "object" && !Array.isArray(node) && p in node) {
      node = node[p];
    } else {
      return null;
    }
  }
  return node;
}

function nodeIsDir(node) {
  return node && typeof node === "object" && !Array.isArray(node);
}

function dirList(node) {
  if (!nodeIsDir(node)) return null;
  const dirs = [];
  const files = [];
  for (const k of Object.keys(node)) {
    if (nodeIsDir(node[k])) dirs.push({ name: k, dir: true });
    else files.push({ name: k, dir: false });
  }
  dirs.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));
  return dirs.concat(files);
}
