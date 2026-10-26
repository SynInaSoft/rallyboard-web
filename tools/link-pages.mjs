// 전체 연결 — 소개 페이지 언어 메뉴·hreflang 통일, 소개 페이지에 해설·작전 모음 링크, sitemap.xml 재생성
// 실행 순서: node tools/build-rule-pages.mjs; node tools/build-gallery-pages.mjs; node tools/link-pages.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = 'https://syninasoft.github.io/rallyboard-web/';
const ORDER = ['en', 'ko', 'ja', 'zh', 'pt', 'es', 'it', 'de', 'fr', 'pl', 'tr', 'ru', 'sr'];
const HL = { en: 'en', ko: 'ko', ja: 'ja', zh: 'zh-Hans', pt: 'pt', es: 'es', it: 'it', de: 'de', fr: 'fr', pl: 'pl', tr: 'tr', ru: 'ru', sr: 'sr-Latn' };
const LANG = { en: 'en', ko: 'ko', ja: 'ja', zh: 'zh-Hans', pt: 'pt-BR', es: 'es', it: 'it', de: 'de', fr: 'fr', pl: 'pl', tr: 'tr', ru: 'ru', sr: 'sr-Latn' };
const NAME = { en: 'English', ko: '한국어', ja: '日本語', zh: '简体中文', pt: 'Português', es: 'Español', it: 'Italiano', de: 'Deutsch', fr: 'Français', pl: 'Polski', tr: 'Türkçe', ru: 'Русский', sr: 'Srpski' };
const LBL = {
  en: ['Overlap rule 7.4 explained', 'Plays and drills'], ko: ['오버랩(위치 반칙) 규칙 7.4 설명', '작전·드릴 모음'], ja: ['オーバーラップ規則7.4の解説', '作戦・ドリル集'],
  pt: ['Regra 7.4 de falta de posição explicada', 'Jogadas e treinos'], es: ['Regla 7.4 de falta de posición explicada', 'Jugadas y ejercicios'],
};
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const landing = (l) => (l === 'en' ? 'index.html' : `${l}.html`);
const landUrl = (l) => (l === 'en' ? BASE : BASE + `${l}.html`);
const rule = (l) => (l === 'en' ? 'overlap-rule.html' : `overlap-rule-${l}.html`);
const plays = (l) => (l === 'en' ? 'plays.html' : `plays-${l}.html`);

const L = ORDER.filter((l) => exists(landing(l)));
const alts = L.map((l) => `<link rel="alternate" hreflang="${HL[l]}" href="${landUrl(l)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE}">`;

for (const l of L) {
  const f = landing(l);
  let s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  s = s.replace(/(<link rel="alternate" hreflang="[^"]+" href="[^"]+">\n?)+/, alts + '\n');
  const nav = L.map((x) => `      <a href="${x === 'en' ? './' : landing(x)}" hreflang="${HL[x]}" lang="${LANG[x]}"${x === l ? ' aria-current="page"' : ''}>${NAME[x]}</a>`).join('\n');
  s = s.replace(/(<nav class="langs"[^>]*>\n)[\s\S]*?(\n    <\/nav>)/, `$1${nav}$2`);
  if (LBL[l] && !s.includes(`href="${rule(l)}"`)) {
    const links = [exists(rule(l)) && `<li><a href="${rule(l)}">${LBL[l][0]}</a></li>`, exists(plays(l)) && `<li><a href="${plays(l)}">${LBL[l][1]}</a></li>`].filter(Boolean).join('');
    if (links) s = s.replace(/(\n  <\/main>)/, `\n    <section class="sec"><ul class="links">${links}</ul></section>$1`);
  }
  fs.writeFileSync(path.join(ROOT, f), s);
  console.log('연결', f);
}

// sitemap — 소개·해설·작전 모음 세 묶음, 묶음 안에서 hreflang 연결
const day = new Date().toISOString().slice(0, 10);
const group = (fn, xd) => { const ls = ORDER.filter((l) => exists(fn(l))); const u = (l) => (fn === landing ? landUrl(l) : BASE + fn(l)); return ls.map((l) => `  <url>\n    <loc>${u(l)}</loc>\n    <lastmod>${day}</lastmod>\n${ls.map((x) => `    <xhtml:link rel="alternate" hreflang="${HL[x]}" href="${u(x)}"/>`).join('\n')}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${xd}"/>\n  </url>`).join('\n'); };
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${group(landing, BASE)}
${group(rule, BASE + 'overlap-rule.html')}
${group(plays, BASE + 'plays.html')}
  <url>
    <loc>${BASE}support.html</loc>
    <lastmod>2026-10-05</lastmod>
  </url>
  <url>
    <loc>${BASE}privacy.html</loc>
    <lastmod>2026-10-25</lastmod>
  </url>
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log('sitemap URL', (xml.match(/<loc>/g) || []).length);
