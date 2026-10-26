// 갤러리 작전 공개 페이지 생성기 — gallery/index.json → plays[-<lang>].html (갤러리 제목이 있는 언어만)
// 실행: node tools/build-gallery-pages.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BASE = 'https://syninasoft.github.io/rallyboard-web/';
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'gallery', 'index.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const file = (l) => (l === 'en' ? 'plays.html' : `plays-${l}.html`);
const home = { en: './', ko: 'ko.html', ja: 'ja.html', pt: 'pt.html', es: 'es.html' };
const rule = (l) => (l === 'en' ? 'overlap-rule.html' : `overlap-rule-${l}.html`);

const T = {
  en: { htmlLang: 'en', hl: 'en', og: 'en_US', name: 'English', title: 'Volleyball plays and drills: 5-1 serve receive R1–R6, block shifts, free ball and drills', h1: 'Volleyball plays and drills', sub: '5-1 serve receive in all six rotations, read-block shifts, transition and practice drills', desc: 'Free animated volleyball plays and drills you can watch in a browser: 5-1 serve receive for R1–R6 (overlap-legal first frame), read-block shifts, free-ball transition, base defense, butterfly, queen of the court and passing triangle.', lead: 'These plays come from the play gallery in the RallyBoard app. Each one is a short frame-by-frame animation on a half court. Open it in your browser, or import it into RallyBoard and change the players to your own team.', watch: 'Watch the animation', frames: 'frames', sys: 'System', skill: { receive: 'Serve receive', block: 'Block', defense: 'Defense', drill: 'Drill' }, level: { all: 'All levels', youth: 'Youth and beginners' }, groups: [['receive', '5-1 serve receive, R1–R6'], ['block', 'Block'], ['defense', 'Defense and transition'], ['drill', 'Practice drills']], note: 'The first frame of every serve-receive play is a legal receive formation under rule 7.4 of the FIVB 2025–2028 rules.', ruleLink: 'How the overlap rule works', app: 'Make your own plays with RallyBoard — free on iPhone, iPad and Android.', nav: 'Language' },
  ko: { htmlLang: 'ko', hl: 'ko', og: 'ko_KR', name: '한국어', title: '배구 작전·드릴 모음: 5-1 서브 리시브 R1~R6, 블로킹 이동, 프리볼, 훈련 드릴', h1: '배구 작전·드릴 모음', sub: '5-1 서브 리시브 여섯 로테이션, 리드 블로킹, 전환, 연습 드릴', desc: '브라우저에서 바로 보는 무료 배구 작전 애니메이션: 5-1 서브 리시브 R1~R6(첫 컷은 위치 반칙 없는 배치), 리드 블로킹 이동, 프리볼 전환, 기본 수비, 버터플라이, 퀸 오브 더 코트, 3인 패스 삼각형.', lead: '랠리보드 앱의 작전 갤러리에 있는 작전들입니다. 하프 코트 위의 짧은 컷 애니메이션이며, 브라우저에서 보거나 랠리보드로 가져와 우리 팀 선수로 바꿔 쓸 수 있습니다.', watch: '애니메이션 보기', frames: '컷', sys: '시스템', skill: { receive: '서브 리시브', block: '블로킹', defense: '수비', drill: '드릴' }, level: { all: '모든 수준', youth: '유소년·초보' }, groups: [['receive', '5-1 서브 리시브 R1~R6'], ['block', '블로킹'], ['defense', '수비·전환'], ['drill', '연습 드릴']], note: '서브 리시브 작전의 첫 컷은 모두 FIVB 2025~2028 규칙 7.4조 기준 위치 반칙이 없는 리시브 배치입니다.', ruleLink: '오버랩(위치 반칙) 규칙 설명', app: '랠리보드로 우리 팀 작전을 직접 만들어 보세요. 아이폰·아이패드·안드로이드 무료.', nav: '언어' },
  ja: { htmlLang: 'ja', hl: 'ja', og: 'ja_JP', name: '日本語', title: 'バレーボールの作戦・ドリル集：5-1 サーブレシーブ R1〜R6、ブロック移動、フリーボール、練習ドリル', h1: 'バレーボールの作戦・ドリル集', sub: '5-1 サーブレシーブ全6ローテーション、リードブロック、トランジション、練習ドリル', desc: 'ブラウザで見られる無料のバレーボール作戦アニメーション：5-1 サーブレシーブ R1〜R6（最初のコマはポジショナルフォルトなし）、リードブロックの移動、フリーボールからの展開、基本ディフェンス、バタフライ、クイーン・オブ・ザ・コート、3人パスの三角形。', lead: 'RallyBoardアプリの作戦ギャラリーにある作戦です。ハーフコート上の短いコマ送りアニメーションで、ブラウザで見るか、RallyBoardに取り込んで自分のチームの選手に置き換えられます。', watch: 'アニメーションを見る', frames: 'コマ', sys: 'システム', skill: { receive: 'サーブレシーブ', block: 'ブロック', defense: 'ディフェンス', drill: 'ドリル' }, level: { all: '全レベル', youth: 'ジュニア・初心者' }, groups: [['receive', '5-1 サーブレシーブ R1〜R6'], ['block', 'ブロック'], ['defense', 'ディフェンス・トランジション'], ['drill', '練習ドリル']], note: 'サーブレシーブの作戦は、どれも最初のコマがFIVB 2025〜2028年規則7.4に沿った反則のないレシーブ隊形です。', ruleLink: 'オーバーラップ（ポジショナルフォルト）の規則', app: 'RallyBoardで自分のチームの作戦を作れます。iPhone・iPad・Androidで無料。', nav: '言語' },
  pt: { htmlLang: 'pt-BR', hl: 'pt', og: 'pt_BR', name: 'Português', title: 'Jogadas e treinos de vôlei: recepção 5x1 R1–R6, deslocamento de bloqueio, bola de graça e exercícios', h1: 'Jogadas e treinos de vôlei', sub: 'Recepção 5x1 nos seis rodízios, bloqueio de leitura, transição e exercícios', desc: 'Jogadas animadas de vôlei grátis para ver no navegador: recepção 5x1 R1–R6 (primeiro quadro sem falta de posição), deslocamentos do bloqueio, transição de bola de graça, defesa base, borboleta, rainha da quadra e triângulo de passe.', lead: 'Estas jogadas vêm da galeria do app RallyBoard. Cada uma é uma animação curta, quadro a quadro, em meia quadra. Abra no navegador ou importe no RallyBoard e troque pelos jogadores do seu time.', watch: 'Ver a animação', frames: 'quadros', sys: 'Sistema', skill: { receive: 'Recepção', block: 'Bloqueio', defense: 'Defesa', drill: 'Exercício' }, level: { all: 'Todos os níveis', youth: 'Base e iniciantes' }, groups: [['receive', 'Recepção 5x1, R1–R6'], ['block', 'Bloqueio'], ['defense', 'Defesa e transição'], ['drill', 'Exercícios de treino']], note: 'O primeiro quadro de cada jogada de recepção é uma formação legal pela regra 7.4 das Regras Oficiais FIVB 2025–2028.', ruleLink: 'Como funciona a regra de falta de posição', app: 'Crie as jogadas do seu time no RallyBoard — grátis no iPhone, iPad e Android.', nav: 'Idioma' },
  es: { htmlLang: 'es', hl: 'es', og: 'es_LA', name: 'Español', title: 'Jugadas y ejercicios de voleibol: recepción 5-1 R1–R6, desplazamiento del bloqueo, bola libre y ejercicios', h1: 'Jugadas y ejercicios de voleibol', sub: 'Recepción 5-1 en las seis rotaciones, bloqueo de lectura, transición y ejercicios', desc: 'Jugadas animadas de voleibol gratis para ver en el navegador: recepción 5-1 R1–R6 (primer cuadro sin falta de posición), desplazamientos del bloqueo, transición de bola libre, defensa base, mariposa, reina de la cancha y triángulo de pase.', lead: 'Estas jugadas vienen de la galería de la app RallyBoard. Cada una es una animación corta, cuadro a cuadro, en media cancha. Ábrela en el navegador o impórtala en RallyBoard y cambia los jugadores por los de tu equipo.', watch: 'Ver la animación', frames: 'cuadros', sys: 'Sistema', skill: { receive: 'Recepción', block: 'Bloqueo', defense: 'Defensa', drill: 'Ejercicio' }, level: { all: 'Todos los niveles', youth: 'Formativas y principiantes' }, groups: [['receive', 'Recepción 5-1, R1–R6'], ['block', 'Bloqueo'], ['defense', 'Defensa y transición'], ['drill', 'Ejercicios de entrenamiento']], note: 'El primer cuadro de cada jugada de recepción es una formación legal según la regla 7.4 de las Reglas Oficiales FIVB 2025–2028.', ruleLink: 'Cómo funciona la regla de falta de posición', app: 'Crea las jugadas de tu equipo con RallyBoard — gratis en iPhone, iPad y Android.', nav: 'Idioma' },
};
const langs = Object.keys(T).filter((l) => G.items.every((i) => i.title[l]));

const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const STYLE = idx.match(/<style>[\s\S]*?<\/style>/)[0].replace('</style>', `  .play{padding:16px 0;border-top:1px solid var(--rule);max-width:46em}
  .play:first-of-type{border-top:0}
  .meta{font-size:13px;color:var(--sub);margin:0 0 6px}
</style>`);
const ICON = idx.match(/<link rel="icon"[^>]*>/)[0];
const FONTS = idx.match(/<link rel="preconnect"[\s\S]*?display=swap" rel="stylesheet">/)[0];
const LOGO = idx.match(/<div class="brand">[\s\S]*?<\/div>/)[0];

for (const l of langs) {
  const t = T[l];
  const url = BASE + file(l);
  const alts = langs.map((x) => `<link rel="alternate" hreflang="${T[x].hl}" href="${BASE + file(x)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + file('en')}">`;
  const nav = langs.map((x) => `      <a href="${file(x)}" hreflang="${T[x].hl}" lang="${T[x].htmlLang}"${x === l ? ' aria-current="page"' : ''}>${esc(T[x].name)}</a>`).join('\n');
  const sections = t.groups.map(([skill, h]) => {
    const items = G.items.filter((i) => i.tags.skill === skill);
    if (!items.length) return '';
    return `    <section class="sec">\n      <h2>${esc(h)}</h2>\n${items.map((i) => `      <article class="play" id="${esc(i.id)}">
        <h3>${esc(i.title[l])}</h3>
        <p class="meta">${esc(t.skill[i.tags.skill] || i.tags.skill)} · ${esc(t.level[i.tags.level] || i.tags.level)}${i.tags.system && i.tags.system !== '-' ? ` · ${esc(t.sys)} ${esc(i.tags.system)}` : ''} · ${i.frames} ${esc(t.frames)}</p>
        <p>${esc(i.desc[l])}</p>
        <p><a href="play.html#${esc(i.code)}">${esc(t.watch)}</a></p>
      </article>`).join('\n')}\n    </section>`;
  }).join('\n\n');
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: t.title, description: t.desc, inLanguage: t.hl, url, dateModified: '2026-10-26', isPartOf: { '@type': 'WebSite', name: 'RallyBoard', url: BASE }, mainEntity: { '@type': 'ItemList', itemListElement: G.items.map((i, n) => ({ '@type': 'ListItem', position: n + 1, name: i.title[l], description: i.desc[l], url: `${url}#${i.id}` })) } };
  const html = `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
${alts}
<meta name="theme-color" content="#0F3B3E">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RallyBoard">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${t.og}">
${ICON}
${FONTS}
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
${STYLE}
</head>
<body>
<div class="wrap">
  <header class="top">
    <a href="${home[l]}" style="text-decoration:none">${LOGO}</a>
    <nav class="langs" aria-label="${esc(t.nav)}">
${nav}
    </nav>
  </header>

  <main>
    <section class="hero" style="display:block">
      <h1><span class="what" style="margin-top:0;font-size:clamp(28px,2vw + 20px,40px);color:var(--cream);font-weight:700">${esc(t.h1)}</span><span class="what">${esc(t.sub)}</span></h1>
      <p class="lead">${esc(t.lead)}</p>
      <p class="lead" style="font-size:15px">${esc(t.note)} <a href="${rule(l)}">${esc(t.ruleLink)}</a></p>
    </section>

${sections}

    <section class="sec prose">
      <p><a href="${home[l]}">${esc(t.app)}</a></p>
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
  console.log('만듦', file(l), G.items.length + '개');
}
