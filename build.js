// Builds one static HTML page per term in terms.json, plus index.html, sitemap.xml and robots.txt.
// Run: node build.js
const fs = require('fs');
const { site, terms } = JSON.parse(fs.readFileSync('terms.json', 'utf8'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const URGENCY = { now: "Don't wait", soon: 'Fix soon', wait: 'Can usually wait' };
const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));

const page = (title, desc, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="google-site-verification" content="jHGDuf7vndmoHAYF0z2J-8fbIdiqUQPOLxNXKIT1QVU" />
<link rel="stylesheet" href="/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8267973935350100" crossorigin="anonymous"></script>
</head>
<body>
<header><a href="/">${esc(site.name)}</a></header>
<main>
${body}
</main>
<footer>General information to help you talk with your mechanic. It is not a diagnosis of your car. Some links are affiliate links: if you buy through them, we may earn a commission at no extra cost to you.</footer>
</body>
</html>
`;

for (const t of terms) {
  if (!URGENCY[t.urgency]) throw new Error(`${t.slug}: urgency must be now, soon or wait`);
  const others = sorted.filter(o => o !== t).slice(0, 8)
    .map(o => `<li><a href="/${o.slug}">${esc(o.term)}</a></li>`).join('\n');
  fs.writeFileSync(`${t.slug}.html`, page(`${t.term}: What It Means on Your Repair Estimate`, t.short,
`<h1>${esc(t.term)}</h1>
<p><strong>${esc(t.short)}</strong></p>
<h2>In plain English</h2>
<p>${esc(t.plain)}</p>
<h2>Why it's on your estimate</h2>
<p>${esc(t.why)}</p>
<h2>How urgent is it?</h2>
<p><span class="tag ${t.urgency}">${URGENCY[t.urgency]}</span></p>
<p>${esc(t.urgencyNote)}</p>
<h2>Questions to ask the shop</h2>
<ul>
${t.ask.map(q => `<li>${esc(q)}</li>`).join('\n')}
</ul>
<p class="tip">Got a long estimate full of terms? A free browser AI like <a href="https://harpa.ai?fpr=flyjck" rel="sponsored nofollow noopener" target="_blank">HARPA AI</a> can read the page and explain each line in plain English.</p>
<h2>More terms</h2>
<ul class="list">
${others}
</ul>`));
}

fs.writeFileSync('index.html', page(`${site.name}: Car Repair Terms Explained in Plain English`,
  'Confused by your repair estimate? Plain-English explanations of car repair terms: what the part does, why it is on your bill, and how urgent it is.',
`<h1>What did the mechanic just say?</h1>
<p>Look up the word on your repair estimate. Each page tells you what the part does, why a shop recommends the work, how urgent it usually is, and what to ask.</p>
<ul class="list">
${sorted.map(t => `<li><a href="/${t.slug}">${esc(t.term)}</a><span>${esc(t.short)}</span></li>`).join('\n')}
</ul>`));

if (site.url) {
  const urls = ['', ...terms.map(t => t.slug)].map(p => `<url><loc>${site.url}/${p}</loc></url>`).join('\n');
  fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
  fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
}
console.log(`Built ${terms.length} term pages.`);
