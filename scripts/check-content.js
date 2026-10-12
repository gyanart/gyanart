const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "content", "articles");
if (!fs.existsSync(root)) {
  console.log("No content/articles directory yet; content workflow checks passed.");
  process.exit(0);
}

const files = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else if (item.isFile() && item.name.endsWith(".md") && item.name.toLowerCase() !== "readme.md") files.push(full);
  }
}
walk(root);

const errors = [];
const allowedStatuses = new Set(["draft", "review", "approved"]);
for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    errors.push(`${rel}: missing YAML front matter`);
    continue;
  }

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (field) meta[field[1]] = field[2].trim().replace(/^["']|["']$/g, "");
  }

  for (const key of ["title", "slug", "status", "primary_keyword", "meta_description", "description", "updated"]) {
    if (!meta[key]) errors.push(`${rel}: missing required metadata "${key}"`);
  }
  if (meta.status && !allowedStatuses.has(meta.status)) {
    errors.push(`${rel}: status must be draft, review, or approved`);
  }
  if (meta.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) {
    errors.push(`${rel}: slug must be lowercase words separated by hyphens`);
  }
  if (meta.meta_description && (meta.meta_description.length < 80 || meta.meta_description.length > 170)) {
    errors.push(`${rel}: meta_description should be 80–170 characters (currently ${meta.meta_description.length})`);
  }
  const body = raw.slice(match[0].length);
  if (!/^#\s+\S/m.test(body)) errors.push(`${rel}: body needs an H1 heading`);
  if (/\[VERIFY:|\[SOURCE NEEDED\]|TODO FACT CHECK/i.test(body) && meta.status !== "draft") {
    errors.push(`${rel}: unresolved fact-check placeholder; keep as draft or resolve it`);
  }
  if (meta.status === "review" || meta.status === "approved") {
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    if (words < 400) errors.push(`${rel}: review/approved article has only ${words} words; confirm it is sufficiently useful or return to draft`);
    if (!/https?:\/\//i.test(body)) errors.push(`${rel}: review/approved article needs source or reference URLs in the body or source notes`);
    if (!/\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\)/.test(body)) {
      errors.push(`${rel}: review/approved article needs at least one linked source or relevant internal link`);
    }
  }
}

if (errors.length) {
  console.error("Content checks failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`Content checks passed for ${files.length} article file(s). These checks do not verify factual accuracy or grant publication approval.`);
