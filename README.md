# Mechanic Speak

Static glossary of car repair terms in plain English. No build step on the host.

## Add a term
1. Add an entry to `terms.json`: slug, term, short, plain, why, urgency (`now`, `soon` or `wait`), urgencyNote, ask (2-3 questions).
2. Run `node build.js`.
3. Commit everything and push to `main`. Netlify publishes automatically.

Set `site.url` in `terms.json` to the live address to generate `sitemap.xml` and `robots.txt`.
