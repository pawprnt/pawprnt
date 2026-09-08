// repos.js — github repository data and utilities for pawprntos
// used by projects and wiki apps

// repository definitions
const REPOS = [
  { name: "forager", url: "https://github.com/pawprnt/forager", api: "pawprnt/forager", branch: "main" },
  { name: "OneBoot", url: "https://github.com/pawprnt/OneBoot", api: "pawprnt/OneBoot", branch: "main" },
  { name: "onewm", url: "https://github.com/pawprnt/onewm", api: "pawprnt/onewm", branch: "main" },
];

function fmtGhDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "unknown";
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

async function ghRepoStat(repo) {
  const base = "https://api.github.com/repos/" + repo.api;
  const [info, commit, rel] = await Promise.allSettled([
    ghFetch(base),
    ghFetch(base + "/commits?per_page=1"),
    ghFetch(base + "/releases/latest"),
  ]);
  const stars = info.status === "fulfilled" ? info.value.stargazers_count : "?";
  const last = commit.status === "fulfilled" && commit.value[0] ? fmtGhDate(commit.value[0].commit.author.date) : "unknown";
  const release = rel.status === "fulfilled" ? fmtGhDate(rel.value.published_at) : "no release";
  return { stars, last, release };
}

function rawWiki(repo, path) {
  return "https://raw.githubusercontent.com/" + repo.api + "/" + repo.branch + "/wiki/" + path;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdInline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function mdToHtml(md) {
  const lines = escapeHtml(md).split("\n");
  let html = "";
  let inCode = false;
  let buf = [];
  let tableRows = [];
  const flush = () => {
    html += "<pre><code>" + buf.join("\n") + "</code></pre>";
    buf = [];
  };
  const flushTable = () => {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(1);
    html += "<table><thead><tr>";
    header.forEach((c) => { html += "<th>" + mdInline(c) + "</th>"; });
    html += "</tr></thead><tbody>";
    body.forEach((row) => {
      html += "<tr>";
      row.forEach((c) => { html += "<td>" + mdInline(c) + "</td>"; });
      html += "</tr>";
    });
    html += "</tbody></table>";
    tableRows = [];
  };
  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) { flush(); inCode = false; }
      else { inCode = true; }
      continue;
    }
    if (inCode) { buf.push(line); continue; }
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const isSep = /^\|[\s\-:|]+\|$/.test(trimmed);
      if (!isSep) {
        const cells = trimmed.split("|").slice(1, -1).map((c) => c.trim());
        tableRows.push(cells);
      }
      continue;
    }
    if (tableRows.length > 0 && trimmed === "") continue;
    flushTable();
    if (/^### /.test(line)) html += "<h3>" + mdInline(line.slice(4)) + "</h3>";
    else if (/^## /.test(line)) html += "<h2>" + mdInline(line.slice(3)) + "</h2>";
    else if (/^# /.test(line)) html += "<h1>" + mdInline(line.slice(2)) + "</h1>";
    else if (/^[-*] /.test(line)) html += "<li>" + mdInline(line.slice(2)) + "</li>";
    else if (trimmed !== "") html += "<p>" + mdInline(line) + "</p>";
  }
  if (inCode) flush();
  flushTable();
  return html;
}
