// 규칙 7.4 해설 페이지 생성기 — content/overlap-rule.<lang>.json → overlap-rule[-<lang>].html
// 실행: node tools/build-rule-pages.mjs   (있는 언어 파일만 만들고, 언어 메뉴·hreflang은 있는 언어끼리 연결)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = 'https://syninasoft.github.io/rallyboard-web/';
const ORDER = ['en', 'ko', 'ja', 'zh', 'pt', 'es', 'it', 'de', 'fr', 'pl', 'tr', 'ru', 'sr'];
const HREFLANG = { en: 'en', ko: 'ko', ja: 'ja', zh: 'zh-Hans', pt: 'pt', es: 'es', it: 'it', de: 'de', fr: 'fr', pl: 'pl', tr: 'tr', ru: 'ru', sr: 'sr-Latn' };
const file = (l) => (l === 'en' ? 'overlap-rule.html' : `overlap-rule-${l}.html`);
const home = (l) => ({ en: './', ko: 'ko.html', ja: 'ja.html', pt: 'pt.html', es: 'es.html' }[l] || (fs.existsSync(path.join(ROOT, `${l}.html`)) ? `${l}.html` : './'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const langs = ORDER.filter((l) => fs.existsSync(path.join(ROOT, 'content', `overlap-rule.${l}.json`)));
const C = Object.fromEntries(langs.map((l) => [l, JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `overlap-rule.${l}.json`), 'utf8'))]));

// 스타일·로고·배지는 영어 소개 페이지와 같게(한 곳에서 관리)
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const STYLE = idx.match(/<style>[\s\S]*?<\/style>/)[0].replace('</style>', `  blockquote{margin:0 0 14px;padding:14px 18px;border-left:3px solid var(--accent);background:rgba(11,46,49,.55);border-radius:0 12px 12px 0;color:var(--body);max-width:46em}
  blockquote cite{display:block;margin-top:8px;font-size:13px;font-style:normal;color:var(--sub)}
  html:lang(zh) body{font-family:'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC',system-ui,sans-serif}
  .upd{font-size:13px;color:var(--sub);margin:0 0 18px}
  .pairs svg{display:block;width:100%;max-width:360px;height:auto;margin:6px 0 14px}
</style>`);
const ICON = idx.match(/<link rel="icon"[^>]*>/)[0];
const FONTS = idx.match(/<link rel="preconnect"[\s\S]*?display=swap" rel="stylesheet">/)[0];
const LOGO = idx.match(/<div class="brand">[\s\S]*?<\/div>/)[0];
const APPLE = idx.match(/<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M16\.4[\s\S]*?<\/svg>/)[0];
const PLAY = idx.match(/<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M4\.4[\s\S]*?<\/svg>/)[0];

const svg = (c) => `<svg viewBox="0 0 360 300" role="img" aria-labelledby="pairs-t" xmlns="http://www.w3.org/2000/svg">
      <title id="pairs-t">${esc(c.svgTitle)}</title>
      <rect width="360" height="300" rx="18" fill="#0B2E31"/>
      <rect x="20" y="40" width="320" height="240" fill="#D96F35"/>
      <path d="M20 40V280H340V40" fill="none" stroke="#F6F1E7" stroke-width="3"/>
      <path d="M20 40H340" stroke="#F6F1E7" stroke-width="5"/>
      <text x="180" y="28" fill="#F6F1E7" font-size="13" font-weight="700" text-anchor="middle" font-family="IBM Plex Mono,monospace">${esc(c.svgNet)}</text>
      <path d="M20 120H340" stroke="#F6F1E7" stroke-width="2" stroke-opacity=".5" stroke-dasharray="6 6"/>
      <g stroke="#FCD34D" stroke-width="3" stroke-linecap="round">
        <path d="M73 112V188M180 112V188M287 112V188"/>
        <path d="M100 90H153M207 90H260M100 210H153M207 210H260"/>
      </g>
      <g font-family="IBM Plex Mono,monospace" font-weight="700" font-size="20" text-anchor="middle">
        ${[[73, 90, 4], [180, 90, 3], [287, 90, 2], [73, 210, 5], [180, 210, 6], [287, 210, 1]].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="22" fill="#F6F1E7"/><text x="${x}" y="${y + 7}" fill="#2A1608">${n}</text>`).join('\n        ')}
      </g>
    </svg>`;

for (const l of langs) {
  const c = C[l];
  const url = BASE + file(l);
  const alts = langs.map((x) => `<link rel="alternate" hreflang="${HREFLANG[x]}" href="${BASE + file(x)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + file('en')}">`;
  const nav = langs.map((x) => `      <a href="${file(x)}" hreflang="${HREFLANG[x]}" lang="${C[x].htmlLang}"${x === l ? ' aria-current="page"' : ''}>${esc(C[x].langName)}</a>`).join('\n');
  const ios = `https://apps.apple.com/app/apple-store/id6797665874?pt=129007220&ct=web_rule_${l}&mt=8`;
  const play = `https://play.google.com/store/apps/details?id=com.uninane.rallyboard&referrer=utm_source%3Dweb_rule_${l}`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: c.title, description: c.description, inLanguage: HREFLANG[l], dateModified: '2026-10-26', datePublished: '2026-10-26', url, author: { '@type': 'Organization', name: 'synina', alternateName: ['SynIna Soft', 'Ena Yoon'], email: 'syninasoft@gmail.com' }, about: { '@type': 'SoftwareApplication', name: 'RallyBoard', alternateName: ['Volleyball Rotation & Tactics', 'Volleyball Rotation + Tactics'], applicationCategory: 'SportsApplication', operatingSystem: 'iOS, iPadOS, Android', sameAs: ['https://apps.apple.com/app/id6797665874', 'https://play.google.com/store/apps/details?id=com.uninane.rallyboard'], url: BASE }, citation: c.sources.map((s) => s.url) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: HREFLANG[l], mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  const html = `<!doctype html>
<html lang="${c.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}">
<link rel="canonical" href="${url}">
${alts}
<meta name="theme-color" content="#0F3B3E">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="article">
<meta property="og:site_name" content="RallyBoard">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${c.ogLocale}">
${ICON}
${FONTS}
${ld.map((o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join('\n')}
${STYLE}
</head>
<body>
<div class="wrap">
  <header class="top">
    <a href="${home(l)}" style="text-decoration:none">${LOGO}</a>
    <nav class="langs" aria-label="${esc(c.langNavLabel)}">
${nav}
    </nav>
  </header>

  <main>
    <section class="hero" style="display:block">
      <h1><span class="what" style="margin-top:0;font-size:clamp(28px,2vw + 20px,40px);color:var(--cream);font-weight:700">${esc(c.h1)}</span><span class="what">${esc(c.h1sub)}</span></h1>
      <p class="upd">${esc(c.updated)}</p>
      <p class="lead">${esc(c.lead)}</p>
    </section>

    <section class="sec prose">
      <h2>${esc(c.ruleH2)}</h2>
      <blockquote>${esc(c.ruleQuote)}<cite>${esc(c.ruleCite)}</cite></blockquote>
      ${c.ruleParas.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </section>

    <section class="sec">
      <h2>${esc(c.changeH2)}</h2>
      <table class="tbl"><colgroup><col class="v"><col><col></colgroup>
        <thead><tr>${c.changeCols.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${c.changeRows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody>
      </table>
      <p class="prose">${esc(c.changeNote)}</p>
    </section>

    <section class="sec prose pairs">
      <h2>${esc(c.pairsH2)}</h2>
      <p>${esc(c.pairsIntro)}</p>
      ${svg(c)}
      <ul><li>${esc(c.pairsFront)}</li><li>${esc(c.pairsSide)}</li></ul>
      <p style="margin-top:12px">${esc(c.pairsNote)}</p>
    </section>

    <section class="sec prose">
      <h2>${esc(c.appH2)}</h2>
      ${c.appParas.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
      <div class="get" style="margin-top:18px">
        <a class="badge" href="${ios}" aria-label="RallyBoard — App Store">${APPLE}<span><small>Download on the</small><b>App Store</b></span></a>
        <a class="badge" href="${play}" aria-label="RallyBoard — Google Play">${PLAY}<span><small>Get it on</small><b>Google Play</b></span></a>
        <p>${esc(c.storeText)} <a href="${home(l)}">${esc(c.appLinkLabel)}</a></p>
      </div>
    </section>

    <section class="sec">
      <h2>${esc(c.faqH2)}</h2>
      ${c.faq.map((f) => `<div class="qa"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('\n      ')}
    </section>

    <section class="sec prose">
      <h2>${esc(c.sourcesH2)}</h2>
      <ul>${c.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
    </section>
  </main>

  <footer>
    <p>RallyBoard · synina</p>
    <p>Apple, iPhone, iPad and App Store are trademarks of Apple Inc. Google Play and Android are trademarks of Google LLC.</p>
  </footer>
</div>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, file(l)), html);
  for (const o of ld) JSON.parse(JSON.stringify(o));
  console.log('만듦', file(l));
}
