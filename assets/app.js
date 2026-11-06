/* NEP89 saddle-search lab: bilingual rounds explorer. Plain JavaScript, no dependencies. */
(() => {
  'use strict';

  const EMBED = window.EMBED || null;
  const REPO = 'https://github.com/JiaaoWANG-ut/nep89-saddle-search-rounds';
  const TABS = ['overview', 'ranking', 'rounds', 'structures', 'glossary'];
  let LANG = /^zh/i.test(document.documentElement.lang) ? 'zh' : 'en';

  const EVENTS = {
    reactant_chemical: { en: 'carbon-bond chemistry', zh: '含碳键的化学变化' },
    reactant_proton_transfer: { en: 'H transfer (N/O/P/S–H)', zh: '氢/质子转移（N/O/P/S–H）' },
    proton_or_framework: { en: 'acid-site proton or framework change', zh: '酸位质子或骨架变化' },
    reorientation_or_transport: { en: 'rotation or diffusion', zh: '转动或扩散' },
  };

  const UI = {
    en: {
      brand: 'NEP89 saddle-search lab',
      nav: { overview: 'Overview', ranking: 'Ranking', rounds: 'All rounds', structures: 'Structures', glossary: 'Glossary' },
      loadError: 'Could not load data',
      heroTitle: '389 rounds of saddle-search research, explained',
      heroLead: 'Goal: start from nothing but the initial state of a surface or zeolite reaction and find its transition states (saddles) with as few force calls and ionic steps as possible, with one easy command. This page explains every round in plain words, shows every test structure in 3-D (initial, transition and final states) and gives one honest final ranking.',
      stats: { rounds: 'rounds', unused: (k) => `${k} numbers unused`, finals: 'grand finals (sealed comparisons)', cases: 'test structures', withTS: 'with a reference TS', gf8: 'saddles the default found in GF8' },
      keyFindings: 'Key findings',
      pipeTitle: 'How the default method finds a saddle, in pictures',
      pipe: [
        ['Start in the valley', 'The initial state (IS): an adsorbate on a metal surface or a molecule in a zeolite pore.'],
        ['Pull a rope', 'Bond-coordinate relaxed scan: stretch or squeeze one bond step by step; where the energy turns over, a ridge is near.'],
        ['Climb to the pass', 'Sella, a climber that carries a Hessian map, on metal surfaces; the two-footed dimer everywhere else.'],
        ['Certify the pass', 'Exact Hessian: exactly one negative curvature means a true mountain pass, not a shoulder.'],
        ['Walk down both sides', 'One side must lead back to the IS and the other to a new valley, the final state (FS).'],
        ['Count', 'Distinct certified saddles U per force call, per ionic step and per DFT-equivalent call.'],
      ],
      timeline: 'Five campaigns',
      eraStats: (n, pos, opt, neg) => `${n} rounds · ${pos} confirmed gains · ${opt} opt-in gains · ${neg} negative`,
      finalsIn: 'grand finals',
      showRounds: 'Show these rounds',
      verdictLegend: 'Verdict colours',
      rankTitle: 'Final ranking: sealed grand final GF8',
      rankIntro: 'Grand final GF8 (round 385) used 54 initial states that no earlier round had ever run: 36 metal and alloy surfaces and 18 zeolites. Every method ran twice per state with different seeds, every NEP89 call was charged, and the same exact-Hessian validator judged all methods. Efficiency = distinct certified saddles (U) per 1,000 ionic steps, force calls or DFT-equivalent calls. Whiskers show the 95 % confidence interval (bootstrap over initial states).',
      metric: 'Rank by',
      metrics: { ionic: 'U per 1,000 ionic steps', call: 'U per 1,000 force calls', dft: 'U per 1,000 DFT-equivalent calls' },
      what: 'What it does',
      roundsLabel: 'Rounds',
      lowTag: 'barriers ≤ 1.5 eV only',
      lowNote: 'Low-barrier presets count only saddles with a barrier of at most 1.5 eV. They answer a narrower question, so they are not directly comparable with the other rows.',
      pairedTitle: 'Head-to-head on the same states and seeds (ratio [95 % CI])',
      pairedCols: ['Comparison', 'Per force call', 'Per ionic step', 'Per DFT-eq. call', 'U per search', 'By host family'],
      decisionTitle: 'Why the command-line default is still long-best-auto-80',
      decision: 'Two v0.81 candidates beat the default per force call on GF8 (conservative +6 %, full stack +14 %). The pre-registered switch rule also requires a cross-pool audit. The conservative candidate reached only 1.031× there, below the 1.05 gate. The full stack passed both gates, but it is slower on AST-type zeolite frameworks (0.88–0.96×) and costs about 24 % more CPU time per saddle. Both ship in v0.81 as opt-in presets.',
      roundsTitle: 'All 389 rounds',
      roundsIntro: 'One line per round; click to open the idea in pictures, the test systems (the chips open the structures) and the measured result. Ratios are candidate / reference unless stated; numbers are NEP89 force-call accounting.',
      search: 'Search words, method names or a round number…',
      allEras: 'All campaigns', allVerdicts: 'All verdicts', allSets: 'All test sets',
      adoptedOnly: 'Shipped only', expandAll: 'Expand all', collapseAll: 'Collapse all',
      showing: (n, total) => `${n} / ${total} rounds`,
      idea: 'The idea, in pictures', systems: 'Test systems', result: 'Result',
      shipped: 'shipped', adopted: 'Entered a default or a shipped preset', notShipped: 'not shipped',
      confidence: 'record confidence', conf: { high: 'high', medium: 'medium', low: 'low' },
      keyRatio: 'headline ratio', link: 'link',
      noRounds: 'No rounds match these filters.',
      structTitle: 'Test structures: initial, transition and final states',
      structIntro: 'Pick a test set and a case. IS = initial state, TS = transition state (saddle), FS = final state. TS-first sets show the reference saddle each case was built from; IS-first and early sets publish only the IS, because finding the saddles is the search\'s job. For the 54 sealed GF8 cases (split S5) you can also browse every distinct certified saddle that the command-line default found.',
      filterCases: 'Filter: id, material, reaction…',
      onlyTS: 'with a reference TS only', onlyS5: 'sealed GF8 cases (S5) only',
      casesN: (n, total) => `${n} / ${total} cases`,
      frameNames: { IS: 'initial state', TS: 'transition state', FS: 'final state' },
      play: '▶ Play', pause: '❚❚ Pause', local: 'Local view', localTip: 'Show only atoms within 6.5 Å of the reacting atoms (periodic images included)',
      cell: 'Cell', arrows: 'Arrows', arrowsTip: 'Arrows show how atoms moved away from the IS', reset: 'Reset view',
      hint: 'drag: rotate · wheel/pinch: zoom · double-click: reset',
      saddles: 'Saddles of this case',
      reference: 'reference', referenceTip: 'Reference saddle the case was built from (TS-first)',
      dftTip: 'Saddle certified with Quantum ESPRESSO (PBE)',
      found: 'found in GF8', seeds: 'seeds',
      cols: { k: '#', b: 'Barrier', dE: 'ΔE', type: 'Type', seeds: 'Seeds' },
      noTS: 'Only the initial state is published for this case: its saddles are what a search has to find.',
      energy: 'Energy profile (eV)',
      download: 'Download extxyz', dlNote: 'Rounded to 0.01 Å; full-precision files are in the release.',
      meta: { material: 'Material', host: 'Host', reaction: 'Target reaction', kind: 'Bond change', split: 'Split', stratum: 'Built', geometry: 'Geometry', atoms: 'Atoms', formula: 'Formula', guest: 'Adsorbate', barrier: 'Barrier', dE: 'Reaction energy', rev: 'Reverse barrier', source: 'Source', citation: 'Reference', event: 'Event type' },
      hosts: { metal: 'metal surface', zeolite: 'zeolite' },
      kinds: { break: 'bond breaking', form: 'bond formation', hop: 'site hop' },
      splits: { dev: 'development', sealed: 'sealed (grand finals)', P2: 'confirmation pool P2', P3: 'confirmation pool P3', S5: 'sealed GF8 set S5' },
      strata: { tsfirst: 'TS-first', isfirst: 'IS-first' },
      noStructures: 'no structures published',
      selectCase: 'Pick a case from the list.',
      glossTitle: 'Glossary',
      footer: `Summary of a 389-round study on the NEP89 potential; energies are NEP89 values in eV unless marked DFT. Downloads (rounds.json, ranking.json, all structures as extxyz, an offline single-file page): <a href="${REPO}/releases">GitHub release</a> · <a href="${REPO}">repository</a>.`,
    },
    zh: {
      brand: 'NEP89 鞍点搜索实验室',
      nav: { overview: '总览', ranking: '排名', rounds: '全部轮次', structures: '结构浏览', glossary: '术语' },
      loadError: '数据加载失败',
      heroTitle: '389 轮鞍点搜索研究全解读',
      heroLead: '目标：只给表面或分子筛反应的初态，用尽量少的力调用和离子步、用一条简单命令找到它的过渡态（鞍点）。本页用大白话解释每一轮做了什么，用 3D 展示每个测试结构（初态、过渡态、终态），并给出一份诚实的最终排名。',
      stats: { rounds: '轮', unused: (k) => `其中 ${k} 个编号未使用`, finals: '次总决赛（密封比较）', cases: '个测试结构', withTS: '个带参考过渡态', gf8: '个 GF8 中默认方法找到的鞍点' },
      keyFindings: '主要结论',
      pipeTitle: '默认方法怎样找鞍点（形象版）',
      pipe: [
        ['从山谷出发', '初态（IS）：金属表面上的吸附物，或分子筛孔道里的分子。'],
        ['拉一根绳子', '键坐标松弛扫描：一步步拉长或压缩某根键；能量由升转降的地方，附近就有山脊。'],
        ['冲顶到山口', '金属表面用 Sella（带 Hessian 地图的登山者），其余用“两只脚”的 dimer。'],
        ['认证山口', '精确 Hessian：恰好一个负曲率，才是真正的山口而不是山肩。'],
        ['两边下山', '一边必须回到初态，另一边到达新的山谷，即终态（FS）。'],
        ['计数', '统计不同的认证鞍点数 U，分别除以力调用、离子步和 DFT 当量调用。'],
      ],
      timeline: '五个阶段',
      eraStats: (n, pos, opt, neg) => `${n} 轮 · 确认有效 ${pos} · 可选有效 ${opt} · 阴性 ${neg}`,
      finalsIn: '总决赛',
      showRounds: '查看这些轮次',
      verdictLegend: '结论颜色',
      rankTitle: '最终排名：密封总决赛 GF8',
      rankIntro: '总决赛 GF8（第 385 轮）使用 54 个此前任何一轮都没跑过的初态：36 个金属与合金表面、18 个分子筛。每种方法在每个初态上用不同种子各跑 2 次，所有 NEP89 力调用都计费，所有方法用同一个精确 Hessian 验证器判定。效率 = 每 1,000 个离子步、力调用或 DFT 当量调用找到的不同认证鞍点数（U）。误差线为 95 % 置信区间（按初态自助法）。',
      metric: '排名指标',
      metrics: { ionic: 'U / 1,000 离子步', call: 'U / 1,000 次力调用', dft: 'U / 1,000 次 DFT 当量调用' },
      what: '做法',
      roundsLabel: '相关轮次',
      lowTag: '只计 ≤ 1.5 eV',
      lowNote: '低能垒预设只统计能垒不超过 1.5 eV 的鞍点，回答的是更窄的问题，不能与其他行直接比较。',
      pairedTitle: '同初态、同种子的一对一比较（比值 [95 % 置信区间]）',
      pairedCols: ['比较', '每次力调用', '每离子步', '每 DFT 当量调用', '每次搜索 U', '按宿主类别'],
      decisionTitle: '为什么命令行默认仍是 long-best-auto-80',
      decision: '两个 v0.81 候选在 GF8 上每次力调用都胜过默认（保守版 +6 %，全栈 +14 %）。但预注册的切换规则还要求跨池审计：保守候选在那里只有 1.031 倍，低于 1.05 门槛；全栈两道门槛都通过了，但在 AST 型分子筛骨架上更慢（0.88–0.96 倍），且每个鞍点多花约 24 % 的 CPU 时间。两者都以可选预设的形式随 v0.81 发布。',
      roundsTitle: '全部 389 轮',
      roundsIntro: '每轮一行，点开可看：形象化的思路、测试体系（标签可跳转到结构）和实测结果。比值除特别说明外均为“候选 / 参照”；数字按 NEP89 力调用计费。',
      search: '搜索关键词、方法名或轮次编号…',
      allEras: '全部阶段', allVerdicts: '全部结论', allSets: '全部测试集',
      adoptedOnly: '只看已发布', expandAll: '全部展开', collapseAll: '全部收起',
      showing: (n, total) => `${n} / ${total} 轮`,
      idea: '思路（形象版）', systems: '测试体系', result: '结果',
      shipped: '已发布', adopted: '进入了默认方法或发布的预设', notShipped: '未发布',
      confidence: '记录可信度', conf: { high: '高', medium: '中', low: '低' },
      keyRatio: '核心比值', link: '链接',
      noRounds: '没有符合筛选条件的轮次。',
      structTitle: '测试结构：初态、过渡态、终态',
      structIntro: '选择测试集和案例。IS = 初态，TS = 过渡态（鞍点），FS = 终态。“先过渡态”测试集给出构建该案例时用的参考鞍点；“先初态”和早期测试集只公开初态，因为找鞍点正是搜索要做的事。对 54 个密封 GF8 案例（S5），还可以浏览命令行默认方法找到的每一个不同认证鞍点。',
      filterCases: '筛选：编号、材料、反应…',
      onlyTS: '只看带参考过渡态的', onlyS5: '只看 GF8 密封案例（S5）',
      casesN: (n, total) => `${n} / ${total} 个案例`,
      frameNames: { IS: '初态', TS: '过渡态', FS: '终态' },
      play: '▶ 播放', pause: '❚❚ 暂停', local: '局部视图', localTip: '只显示反应原子周围 6.5 Å 内的原子（含周期镜像）',
      cell: '晶胞', arrows: '箭头', arrowsTip: '箭头表示原子相对初态的移动', reset: '重置视角',
      hint: '拖动旋转 · 滚轮/双指缩放 · 双击重置',
      saddles: '本案例的鞍点',
      reference: '参考', referenceTip: '构建该案例时使用的参考鞍点（先过渡态）',
      dftTip: '用 Quantum ESPRESSO（PBE）认证的鞍点',
      found: 'GF8 中找到', seeds: '种子',
      cols: { k: '#', b: '能垒', dE: 'ΔE', type: '类型', seeds: '种子' },
      noTS: '本案例只公开初态：它的鞍点正是搜索需要去找的。',
      energy: '能量剖面（eV）',
      download: '下载 extxyz', dlNote: '坐标保留到 0.01 Å；全精度文件见 Release。',
      meta: { material: '材料', host: '宿主', reaction: '目标反应', kind: '键变化', split: '划分', stratum: '构建方式', geometry: '几何', atoms: '原子数', formula: '化学式', guest: '吸附物', barrier: '能垒', dE: '反应能', rev: '逆向能垒', source: '来源', citation: '文献', event: '事件类型' },
      hosts: { metal: '金属表面', zeolite: '分子筛' },
      kinds: { break: '断键', form: '成键', hop: '位点跳迁' },
      splits: { dev: '开发集', sealed: '密封（总决赛）', P2: '确认池 P2', P3: '确认池 P3', S5: 'GF8 密封集 S5' },
      strata: { tsfirst: '先过渡态', isfirst: '先初态' },
      noStructures: '未公开结构',
      selectCase: '请在左侧列表中选择一个案例。',
      glossTitle: '术语',
      footer: `NEP89 势上 389 轮研究的总结；能量除标注 DFT 外均为 NEP89 计算值（eV）。下载（rounds.json、ranking.json、全部结构 extxyz、离线单文件网页）：<a href="${REPO}/releases">GitHub Release</a> · <a href="${REPO}">仓库</a>。`,
    },
  };

  // ------------------------------------------------------------------ helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
  const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  const T = () => UI[LANG];
  const tr = (obj, key) => (obj && (obj[`${key}_${LANG}`] || obj[`${key}_en`])) || '';
  const isNum = (x) => x !== null && x !== undefined && x !== '' && Number.isFinite(Number(x));
  const fixed = (x, d = 2) => (isNum(x) ? Number(x).toFixed(d) : '—');
  const signed = (x, d = 2) => (isNum(x) ? `${Number(x) < 0 ? '−' : '+'}${Math.abs(Number(x)).toFixed(d)}` : '—');
  const label = (dict, key) => (dict && dict[key]) || key || '';
  const countBy = (items, key) => items.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc; }, {});

  const store = {};
  async function load(name) {
    if (store[name]) return store[name];
    let value;
    if (EMBED) {
      if (!(name in EMBED)) throw new Error(`missing ${name}`);
      value = EMBED[name];
    } else {
      const res = await fetch(`data/${name}.json`);
      if (!res.ok) throw new Error(`data/${name}.json: HTTP ${res.status}`);
      value = await res.json();
    }
    store[name] = value;
    return value;
  }

  // ------------------------------------------------------------------ state & routing
  const state = {
    tab: 'overview', metric: 'ionic',
    f: { q: '', era: '', verdict: '', set: '', adopted: false },
    st: { set: 'F1', id: null, q: '', onlyTS: false, onlyS5: false },
  };
  let site = null; let rounds = null; let sets = null; let viewer = null;

  function parseHash() {
    const raw = location.hash.replace(/^#/, '');
    const parts = raw.split('/').map((p) => { try { return decodeURIComponent(p); } catch (e) { return p; } });
    const tab = TABS.includes(parts[0]) ? parts[0] : 'overview';
    return { tab, a: parts[1] || '', b: parts.slice(2).join('/') };
  }

  function updateLangLink() {
    const link = $('#lang-switch');
    if (!link) return;
    if (EMBED) {
      link.textContent = LANG === 'en' ? '中文' : 'English';
      link.href = location.hash || '#overview';
    } else {
      link.href = (LANG === 'en' ? 'zh.html' : 'index.html') + location.hash;
    }
  }

  function setHash(hash) {
    history.replaceState(null, '', hash);
    updateLangLink();
  }

  function renderChrome() {
    const t = T();
    $('#nav').innerHTML = TABS.map((k) => `<a href="#${k}"${state.tab === k ? ' class="active" aria-current="page"' : ''}>${esc(t.nav[k])}</a>`).join('');
    $('#brand-text').textContent = t.brand;
    $('#foot').innerHTML = t.footer;
    const titles = site && site.titles && site.titles[LANG];
    if (titles) document.title = titles.title;
    updateLangLink();
  }

  async function route() {
    const { tab, a, b } = parseHash();
    const changedTab = tab !== state.tab;
    state.tab = tab;
    renderChrome();
    if (viewer) { viewer.destroy(); viewer = null; }
    const app = $('#app');
    try {
      if (tab === 'overview') renderOverview(app);
      else if (tab === 'ranking') renderRanking(app);
      else if (tab === 'rounds') renderRounds(app, a);
      else if (tab === 'structures') await renderStructures(app, a, b);
      else renderGlossary(app);
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="error">${esc(T().loadError)}: ${esc(err.message)}</div>`;
    }
    if (changedTab && !(tab === 'rounds' && a)) window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ overview
  function verdictBar(list) {
    const counts = countBy(list, 'verdict');
    return Object.keys(site.verdicts).filter((v) => counts[v]).map((v) => {
      const info = site.verdicts[v];
      return `<span style="width:${(100 * counts[v] / list.length).toFixed(3)}%;background:${info.color}" title="${esc(info[LANG])}: ${counts[v]}"></span>`;
    }).join('');
  }

  function legendHTML() {
    return `<div class="legend">${Object.values(site.verdicts).map((v) => `<span><i style="background:${v.color}"></i>${esc(v[LANG])}</span>`).join('')}</div>`;
  }

  function renderOverview(app) {
    const t = T();
    const c = site.counts;
    const eras = site.eras.map((era) => {
      const list = rounds.filter((r) => r.era === era.key);
      const counts = countBy(list, 'verdict');
      const finals = list.filter((r) => r.verdict === 'grand-final').map((r) => `<a href="#rounds/${r.n}">r${r.n}</a>`).join(', ');
      return `<div class="panel era"><h3>${esc(tr(era, 'name'))}</h3><p>${esc(tr(era, 'desc'))}</p>
        <div class="vbar">${verdictBar(list)}</div>
        <div class="small muted">${esc(t.eraStats(list.length, counts.positive || 0, counts['positive-optional'] || 0, counts.negative || 0))}${finals ? ` · ${esc(t.finalsIn)}: ${finals}` : ''}</div>
        <div><a class="btn" href="#rounds" data-era="${esc(era.key)}">${esc(t.showRounds)} →</a></div></div>`;
    }).join('');
    app.innerHTML = `
      <section class="hero"><h1>${esc(t.heroTitle)}</h1><p class="lead">${esc(t.heroLead)}</p>
        <div class="stats">
          <div class="stat"><b>${c.rounds}</b><span>${esc(t.stats.rounds)}${c.unused ? ` <span class="small">(${esc(t.stats.unused(c.unused))})</span>` : ''}</span></div>
          <div class="stat"><b>8</b><span>${esc(t.stats.finals)}</span></div>
          <div class="stat"><b>${c.cases}</b><span>${esc(t.stats.cases)}</span></div>
          <div class="stat"><b>${c.with_ts}</b><span>${esc(t.stats.withTS)}</span></div>
          <div class="stat"><b>${c.gf8_saddles}</b><span>${esc(t.stats.gf8)}</span></div>
        </div></section>
      <h2>${esc(t.keyFindings)}</h2>
      <ul class="points">${site.key_points.map((p) => `<li>${p[LANG] || p.en}</li>`).join('')}</ul>
      <h2>${esc(t.pipeTitle)}</h2>
      <div class="pipeline">${t.pipe.map(([title, text], i) => `<div class="step"><h3><span class="num">${i + 1}</span>${esc(title)}</h3><p>${esc(text)}</p></div>`).join('')}</div>
      <h2>${esc(t.timeline)}</h2>
      <div class="eras">${eras}</div>
      <h3 style="margin-top:1rem">${esc(t.verdictLegend)}</h3>${legendHTML()}`;
    $$('a[data-era]', app).forEach((a) => a.addEventListener('click', () => {
      state.f = { q: '', era: a.dataset.era, verdict: '', set: '', adopted: false };
    }));
  }

  // ------------------------------------------------------------------ ranking
  function renderRanking(app) {
    const t = T();
    const m = state.metric;
    const rows = site.ranking.slice().sort((x, y) => y[m][0] - x[m][0]);
    const max = Math.max(...site.ranking.map((r) => r[m][2])) * 1.04;
    const pct = (v) => (100 * v / max).toFixed(2);
    const cards = rows.map((r, i) => {
      const [v, lo, hi] = r[m];
      const baseline = /Sella|EON/.test(r.method);
      const tag = tr(r, 'tag');
      return `<div class="panel rank-card${i < 3 ? ' top' : ''}">
        <div class="rank-no">${i + 1}</div>
        <div class="rank-head"><code>${esc(r.method)}</code>${tag ? `<span class="tag${r.method === site.gf8_profile ? ' def' : ''}">${esc(tag)}</span>` : ''}${r.lowbarrier ? `<span class="tag warn" title="${esc(t.lowNote)}">${esc(t.lowTag)} *</span>` : ''}</div>
        <div class="barline"><div class="track" role="img" aria-label="${v} [${lo}, ${hi}]"><div class="fill${r.lowbarrier ? ' low' : baseline ? ' base' : ''}" style="width:${pct(v)}%"></div><div class="ci" style="left:${pct(lo)}%;width:${(pct(hi) - pct(lo)).toFixed(2)}%"></div></div>
          <div class="val"><b>${v.toFixed(3)}</b> <span class="muted">[${lo.toFixed(3)}, ${hi.toFixed(3)}]</span></div></div>
        <div class="rank-text"><p><b>${esc(t.what)}:</b> ${esc(tr(r, 'desc'))}</p><p class="vivid">${esc(tr(r, 'vivid'))}</p></div>
        <div class="rank-meta">U = ${esc(r.U)} · ${esc(t.roundsLabel)}: ${esc(r.rounds)}</div></div>`;
    }).join('');
    const paired = site.paired.map((p) => `<tr><td>${esc(p[LANG] || p.en)}</td><td class="num">${esc(p.call)}</td><td class="num">${esc(p.ionic)}</td><td class="num">${esc(p.dft)}</td><td class="num">${esc(tr(p, 'search'))}</td><td>${esc(tr(p, 'family'))}</td></tr>`).join('');
    app.innerHTML = `<h1>${esc(t.rankTitle)}</h1><p class="rank-intro muted">${esc(t.rankIntro)}</p>
      <div class="metric-bar"><span class="muted">${esc(t.metric)}:</span><div class="seg" role="group">${Object.entries(t.metrics).map(([k, name]) => `<button type="button" data-metric="${k}" class="${k === m ? 'on' : ''}">${esc(name)}</button>`).join('')}</div></div>
      <div class="rank-list">${cards}</div>
      <p class="note">* ${esc(t.lowNote)}</p>
      <h2>${esc(t.pairedTitle)}</h2>
      <div class="scroll-x"><table class="grid"><thead><tr>${t.pairedCols.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${paired}</tbody></table></div>
      <h2>${esc(t.decisionTitle)}</h2><div class="panel"><p style="margin:0">${esc(t.decision)}</p></div>`;
    $$('button[data-metric]', app).forEach((b) => b.addEventListener('click', () => { state.metric = b.dataset.metric; renderRanking(app); }));
  }

  // ------------------------------------------------------------------ rounds
  function setName(key) {
    const text = (site.set_text && site.set_text[key]) || (sets && sets[key]);
    return text ? tr(text, 'name') : key;
  }

  function matches(r) {
    const f = state.f;
    if (f.era && r.era !== f.era) return false;
    if (f.verdict && r.verdict !== f.verdict) return false;
    if (f.set && !r.sets.includes(f.set)) return false;
    if (f.adopted && r.adopted !== true) return false;
    const q = f.q.trim().toLowerCase();
    if (!q) return true;
    if (/^r?\d+$/.test(q)) return String(r.n) === q.replace(/^r/, '');
    const hay = [r.name_en, r.name_zh, r.idea_en, r.idea_zh, r.systems_en, r.systems_zh, r.result_en, r.result_zh].join(' ').toLowerCase();
    return q.split(/\s+/).every((w) => hay.includes(w));
  }

  function roundHTML(r) {
    const t = T();
    const v = site.verdicts[r.verdict] || { en: r.verdict, zh: r.verdict, color: '#667085' };
    const chips = r.sets.map((s) => (sets[s]
      ? `<a class="chip" href="#structures/${encodeURIComponent(s)}">${esc(setName(s))}</a>`
      : `<span class="chip" title="${esc(t.noStructures)}">${esc(setName(s))}</span>`)).join('');
    const ratio = isNum(r.key_ratio) ? `<span class="ratio" title="${esc(t.keyRatio)}">${Number(r.key_ratio).toFixed(3)}×</span>` : '';
    const star = r.adopted === true ? `<span class="star" title="${esc(t.adopted)}">★ ${esc(t.shipped)}</span>` : '';
    const adopted = r.adopted === true ? t.adopted : r.adopted === false ? t.notShipped : '';
    return `<details class="round" id="r${r.n}"><summary><span class="rn">r${r.n}</span><span class="badge" style="--c:${v.color}">${esc(v[LANG])}</span><span class="rname">${md(tr(r, 'name'))}</span>${ratio}${star}</summary>
      <div class="round-body">
        <div><h4>${esc(t.idea)}</h4><p>${md(tr(r, 'idea'))}</p></div>
        <div><h4>${esc(t.systems)}</h4><p>${md(tr(r, 'systems'))}</p>${chips ? `<div class="chips" style="margin-top:.35rem">${chips}</div>` : ''}</div>
        <div><h4>${esc(t.result)}</h4><p>${md(tr(r, 'result'))}</p></div>
        <div class="small muted">${adopted ? `${esc(adopted)} · ` : ''}${esc(t.confidence)}: ${esc(label(t.conf, r.confidence))} · <a href="#rounds/${r.n}">#r${r.n}</a></div>
      </div></details>`;
  }

  function drawRounds() {
    const t = T();
    const list = rounds.filter(matches);
    $('#f-count').textContent = t.showing(list.length, rounds.length);
    if (!list.length) { $('#round-list').innerHTML = `<p class="empty">${esc(t.noRounds)}</p>`; return; }
    let html = ''; let era = null;
    for (const r of list) {
      if (r.era !== era) {
        era = r.era;
        const info = site.eras.find((e) => e.key === era);
        html += `<div class="era-head"><h3>${esc(tr(info, 'name'))}</h3><span class="muted small">${esc(tr(info, 'desc'))}</span></div>`;
      }
      html += roundHTML(r);
    }
    $('#round-list').innerHTML = html;
  }

  function renderRounds(app, focus) {
    const t = T();
    const n = Number(String(focus).replace(/^r/, ''));
    const target = focus ? rounds.find((r) => r.n === n) : null;
    if (target && !matches(target)) state.f = { q: '', era: '', verdict: '', set: '', adopted: false };
    const opt = (value, text, current) => `<option value="${esc(value)}"${value === current ? ' selected' : ''}>${esc(text)}</option>`;
    const setKeys = Object.keys(site.set_text || {});
    app.innerHTML = `<h1>${esc(t.roundsTitle)}</h1><p class="muted">${esc(t.roundsIntro)}</p>
      <div class="filters">
        <input type="search" id="f-q" placeholder="${esc(t.search)}" value="${esc(state.f.q)}" aria-label="${esc(t.search)}">
        <select id="f-era" aria-label="${esc(t.allEras)}">${opt('', t.allEras, state.f.era)}${site.eras.map((e) => opt(e.key, tr(e, 'name'), state.f.era)).join('')}</select>
        <select id="f-verdict" aria-label="${esc(t.allVerdicts)}">${opt('', t.allVerdicts, state.f.verdict)}${Object.entries(site.verdicts).map(([k, v]) => opt(k, v[LANG], state.f.verdict)).join('')}</select>
        <select id="f-set" aria-label="${esc(t.allSets)}">${opt('', t.allSets, state.f.set)}${setKeys.map((k) => opt(k, setName(k), state.f.set)).join('')}</select>
        <label><input type="checkbox" id="f-adopted"${state.f.adopted ? ' checked' : ''}> ${esc(t.adoptedOnly)}</label>
        <button type="button" class="btn" id="f-open">${esc(t.expandAll)}</button>
        <button type="button" class="btn" id="f-close">${esc(t.collapseAll)}</button>
        <span class="count" id="f-count"></span>
      </div>
      ${legendHTML()}
      <div id="round-list"></div>`;
    const bind = (id, key, prop = 'value') => $(id).addEventListener(prop === 'checked' ? 'change' : 'input', (e) => { state.f[key] = e.target[prop]; drawRounds(); });
    bind('#f-q', 'q'); bind('#f-era', 'era'); bind('#f-verdict', 'verdict'); bind('#f-set', 'set'); bind('#f-adopted', 'adopted', 'checked');
    $('#f-open').addEventListener('click', () => $$('details.round', app).forEach((d) => { d.open = true; }));
    $('#f-close').addEventListener('click', () => $$('details.round', app).forEach((d) => { d.open = false; }));
    drawRounds();
    if (target) {
      const el = document.getElementById(`r${target.n}`);
      if (el) {
        el.open = true;
        // land below the sticky top bar and filter bar
        requestAnimationFrame(() => {
          const bar = $('.filters', app);
          const head = $('.topbar');
          const sticky = bar && getComputedStyle(bar).position === 'sticky';
          const off = (head ? head.offsetHeight : 52) + (sticky ? bar.offsetHeight : 0) + 8;
          window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
        });
      }
    }
  }

  // ------------------------------------------------------------------ glossary
  function renderGlossary(app) {
    const t = T();
    app.innerHTML = `<h1>${esc(t.glossTitle)}</h1><div class="gloss">${site.glossary.map((g) => `<div class="panel"><h3>${esc(tr(g, 'term'))}</h3><p>${esc(tr(g, 'def'))}</p></div>`).join('')}</div>`;
  }

  // ------------------------------------------------------------------ structures: data
  function decodeCase(c) {
    const symbols = [];
    for (const [symbol, count] of c.species) for (let k = 0; k < count; k += 1) symbols.push(symbol);
    const n = symbols.length;
    const is = new Float64Array(3 * n);
    for (let i = 0; i < 3 * n; i += 1) is[i] = c.is[i] / 100;
    const fixedMask = new Uint8Array(n);
    for (const [a, b] of c.fixed || []) for (let i = a; i <= b; i += 1) fixedMask[i] = 1;
    const ads = new Uint8Array(n);
    for (const i of c.ads || []) ads[i] = 1;
    return { n, symbols, is, fixed: fixedMask, ads, cell: c.cell, pbc: c.pbc, host: c.host, pairs: c.pairs || [] };
  }

  function applyDelta(base, delta) {
    if (!delta) return null;
    const out = base.slice();
    for (let k = 0; k < delta.length; k += 4) {
      const i = delta[k];
      out[3 * i] = delta[k + 1] / 100; out[3 * i + 1] = delta[k + 2] / 100; out[3 * i + 2] = delta[k + 3] / 100;
    }
    return out;
  }

  function channelsOf(c) {
    const out = [];
    if (c.ts) {
      out.push({ ref: true, dft: c.id.startsWith('r325-'), b: c.barrier, dE: c.dE, rev: c.rev, type: c.event || '', ts: c.ts, fs: c.fs || null });
    }
    (c.found || []).forEach((f, k) => out.push({ ref: false, k: k + 1, b: f.b, dE: f.dE, rev: f.rev, type: f.type, seeds: f.seeds, ts: f.ts, fs: f.fs }));
    return out;
  }

  function extxyz(sys, pos, comment) {
    const lattice = sys.cell.flat().map((v) => Number(v).toFixed(4)).join(' ');
    const lines = [String(sys.n), `Lattice="${lattice}" Properties=species:S:1:pos:R:3:move_mask:L:1 pbc="${sys.pbc.map((p) => (p ? 'T' : 'F')).join(' ')}" comment="${comment.replace(/"/g, "'")}"`];
    for (let i = 0; i < sys.n; i += 1) {
      const xyz = [0, 1, 2].map((k) => pos[3 * i + k].toFixed(2).padStart(10)).join(' ');
      lines.push(`${sys.symbols[i].padEnd(3)} ${xyz} ${sys.fixed[i] ? 'F' : 'T'}`);
    }
    return `${lines.join('\n')}\n`;
  }

  function saveText(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  // ------------------------------------------------------------------ structures: viewer
  const COV = { H: 0.31, B: 0.84, C: 0.76, N: 0.71, O: 0.66, F: 0.57, Na: 1.66, Mg: 1.41, Al: 1.21, Si: 1.11, P: 1.07, S: 1.05, Cl: 1.02, K: 2.03, Ca: 1.76, Sc: 1.7, Ti: 1.6, V: 1.53, Cr: 1.39, Mn: 1.39, Fe: 1.32, Co: 1.26, Ni: 1.24, Cu: 1.32, Zn: 1.22, Ga: 1.22, Ge: 1.2, Se: 1.2, Zr: 1.75, Nb: 1.64, Mo: 1.54, Ru: 1.46, Rh: 1.42, Pd: 1.39, Ag: 1.45, Cd: 1.44, In: 1.42, Sn: 1.39, Sb: 1.39, Te: 1.38, Ce: 2.04, Hf: 1.75, Ta: 1.7, W: 1.62, Re: 1.51, Os: 1.44, Ir: 1.41, Pt: 1.36, Au: 1.36, Pb: 1.46, Bi: 1.48 };
  const COLOR = { H: '#f4f6f8', B: '#ffb5b5', C: '#5b6168', N: '#3a5ce8', O: '#e3342f', F: '#90e050', Na: '#ab5cf2', Mg: '#8aff00', Al: '#c79797', Si: '#e8c39e', P: '#ff8000', S: '#e6c619', Cl: '#1ff01f', K: '#8f40d4', Ca: '#3dff00', Ti: '#bfc2c7', V: '#a6a6ab', Cr: '#8a99c7', Mn: '#9c7ac7', Fe: '#e06633', Co: '#f090a0', Ni: '#50d050', Cu: '#c88033', Zn: '#7d80b0', Ga: '#c28f8f', Ge: '#668f8f', Zr: '#94e0e0', Nb: '#73c2c9', Mo: '#54b5b5', Ru: '#248f8f', Rh: '#0a7d8c', Pd: '#006985', Ag: '#b8bcc2', Cd: '#ffd98f', In: '#a67573', Sn: '#668080', Sb: '#9e63b5', Ce: '#ffffc7', Hf: '#4dc2ff', Ta: '#4da6ff', W: '#2194d6', Re: '#267dab', Os: '#266696', Ir: '#175487', Pt: '#c9cbd6', Au: '#f5c518', Pb: '#575961', Bi: '#9e4fb5' };
  const NONMETAL = new Set(['H', 'B', 'C', 'N', 'O', 'F', 'Si', 'P', 'S', 'Cl', 'Se', 'Br', 'I', 'Al']);
  const LOCAL_RADIUS = 6.5;
  const SLAB_RADIUS = 7.5;

  function shade(hex, amount) {
    const v = parseInt(hex.slice(1), 16);
    const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((x) => Math.round(amount >= 0 ? x + (255 - x) * amount : x * (1 + amount)));
    return `rgb(${ch[0]},${ch[1]},${ch[2]})`;
  }
  const PALETTE = {};
  function palette(symbol) {
    if (!PALETTE[symbol]) {
      const base = COLOR[symbol] || '#ff69b4';
      PALETTE[symbol] = { base, light: shade(base, 0.6), dark: shade(base, -0.45) };
    }
    return PALETTE[symbol];
  }
  const ballRadius = (s) => (NONMETAL.has(s) ? 0.42 * (COV[s] || 1) + 0.12 : 0.82 * (COV[s] || 1.4));

  function invert3(m) {
    const [a, b, c] = m;
    const det = a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
    return [
      [(b[1] * c[2] - b[2] * c[1]) / det, (a[2] * c[1] - a[1] * c[2]) / det, (a[1] * b[2] - a[2] * b[1]) / det],
      [(b[2] * c[0] - b[0] * c[2]) / det, (a[0] * c[2] - a[2] * c[0]) / det, (a[2] * b[0] - a[0] * b[2]) / det],
      [(b[0] * c[1] - b[1] * c[0]) / det, (a[1] * c[0] - a[0] * c[1]) / det, (a[0] * b[1] - a[1] * b[0]) / det],
    ];
  }
  const mul3 = (A, B) => {
    const out = new Array(9).fill(0);
    for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) for (let k = 0; k < 3; k += 1) out[3 * i + j] += A[3 * i + k] * B[3 * k + j];
    return out;
  };
  // Elevation of the line of sight above the xy plane: steeper for slabs so the surface is seen from above.
  function initialRotation(slab) {
    const a = ((slab ? 55 : 35) * Math.PI) / 180;
    return [1, 0, 0, 0, Math.sin(a), Math.cos(a), 0, -Math.cos(a), Math.sin(a)];
  }

  class Viewer {
    constructor(box, onFrame) {
      this.box = box;
      this.canvas = $('canvas', box);
      this.ctx = this.canvas.getContext('2d');
      this.overlay = $('.overlay', box);
      this.onFrame = onFrame;
      this.R = initialRotation(false);
      this.zoom = 1;
      this.opts = { local: false, cell: true, arrows: true };
      this.t = 0; this.tmax = 0; this.playing = false; this.raf = 0; this.dir = 1;
      this.pointers = new Map();
      this.sys = null;
      this.handlers = [];
      const on = (target, type, fn, options) => { target.addEventListener(type, fn, options); this.handlers.push([target, type, fn, options]); };
      on(this.canvas, 'pointerdown', (e) => { this.canvas.setPointerCapture(e.pointerId); this.pointers.set(e.pointerId, [e.clientX, e.clientY]); });
      on(this.canvas, 'pointermove', (e) => this.pointerMove(e));
      const release = (e) => this.pointers.delete(e.pointerId);
      on(this.canvas, 'pointerup', release);
      on(this.canvas, 'pointercancel', release);
      on(this.canvas, 'wheel', (e) => { e.preventDefault(); this.setZoom(this.zoom * Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
      on(this.canvas, 'dblclick', () => this.resetView());
      this.resize = () => this.fit();
      on(window, 'resize', this.resize);
      if (window.ResizeObserver) { this.observer = new ResizeObserver(this.resize); this.observer.observe(this.canvas); }
    }

    destroy() {
      this.stop();
      for (const [target, type, fn, options] of this.handlers) target.removeEventListener(type, fn, options);
      if (this.observer) this.observer.disconnect();
    }

    pointerMove(e) {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      if (this.pointers.size === 1) {
        this.rotate((e.clientY - prev[1]) * 0.01, (e.clientX - prev[0]) * 0.01);
      } else if (this.pointers.size === 2) {
        const other = [...this.pointers.entries()].find(([id]) => id !== e.pointerId)[1];
        const before = Math.hypot(prev[0] - other[0], prev[1] - other[1]);
        const after = Math.hypot(e.clientX - other[0], e.clientY - other[1]);
        if (before > 0) this.setZoom(this.zoom * (after / before));
      }
      this.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      this.draw();
    }

    rotate(ax, ay) {
      const cx = Math.cos(ax); const sx = Math.sin(ax); const cy = Math.cos(ay); const sy = Math.sin(ay);
      const Rx = [1, 0, 0, 0, cx, -sx, 0, sx, cx];
      const Ry = [cy, 0, sy, 0, 1, 0, -sy, 0, cy];
      this.R = mul3(Rx, mul3(Ry, this.R));
    }

    setZoom(z) { this.zoom = Math.min(10, Math.max(0.25, z)); this.draw(); }
    resetView() { this.R = initialRotation(this.slab); this.zoom = 1; this.draw(); }

    setSystem(sys) {
      this.stop();
      this.sys = sys;
      this.zeo = sys.host === 'zeolite';
      this.slab = !this.zeo && Boolean(sys.pbc[0] && sys.pbc[1]);
      this.opts.local = this.zeo;
      this.opts.cell = !this.opts.local;
      this.R = initialRotation(this.slab); this.zoom = 1;
      const n = sys.n;
      let focus = [];
      for (let i = 0; i < n; i += 1) if (sys.ads[i]) focus.push(i);
      if (!focus.length) for (const [i, j] of sys.pairs) focus.push(i, j);
      if (!focus.length) for (let i = 0; i < n; i += 1) if (!sys.fixed[i]) focus.push(i);
      if (!focus.length) focus = [...Array(n).keys()];
      this.focus = focus;
      const inv = invert3(sys.cell);
      const frac = (x, y, z) => [0, 1, 2].map((j) => x * inv[0][j] + y * inv[1][j] + z * inv[2][j]);
      const P = sys.is;
      const anchor = focus[0];
      const fa = frac(P[3 * anchor], P[3 * anchor + 1], P[3 * anchor + 2]);
      // Unwrap the adsorbate around one of its atoms, then wrap everything around the adsorbate centre.
      const wrapDims = [0, 1, 2].filter((j) => sys.pbc[j] && (sys.host === 'zeolite' || j < 2));
      const fracShift = (i, center) => {
        const f = frac(P[3 * i], P[3 * i + 1], P[3 * i + 2]);
        return [0, 1, 2].map((j) => (wrapDims.includes(j) ? -Math.round(f[j] - center[j]) : 0));
      };
      const cen = [0, 0, 0];
      for (const i of focus) {
        const s = fracShift(i, fa);
        const f = frac(P[3 * i], P[3 * i + 1], P[3 * i + 2]);
        for (let j = 0; j < 3; j += 1) cen[j] += (f[j] + s[j]) / focus.length;
      }
      this.shift = new Float64Array(3 * n);
      for (let i = 0; i < n; i += 1) {
        const s = fracShift(i, cen);
        for (let k = 0; k < 3; k += 1) this.shift[3 * i + k] = s[0] * sys.cell[0][k] + s[1] * sys.cell[1][k] + s[2] * sys.cell[2][k];
      }
      this.cellOrigin = [0, 1, 2].map((k) => wrapDims.reduce((acc, j) => acc + (cen[j] - 0.5) * sys.cell[j][k], 0));
      this.radii = sys.symbols.map((s) => ballRadius(s));
      this.cov = sys.symbols.map((s) => COV[s] || 1.4);
      this.metal = sys.symbols.map((s) => !NONMETAL.has(s));
      this.pairAtoms = new Set(sys.pairs.flat());
      // Display list: every atom once (wrapped), then periodic images of host atoms near the adsorbate:
      // an in-plane disk for slabs, a sphere around the guest for the local view of porous hosts.
      const W0 = new Float64Array(3 * n);
      for (let k = 0; k < 3 * n; k += 1) W0[k] = P[k] + this.shift[k];
      const fc = [0, 0, 0];
      for (const i of focus) for (let k = 0; k < 3; k += 1) fc[k] += W0[3 * i + k] / focus.length;
      let guest = 0;
      for (const i of focus) guest = Math.max(guest, Math.hypot(W0[3 * i] - fc[0], W0[3 * i + 1] - fc[1], W0[3 * i + 2] - fc[2]));
      this.fc = fc;
      const src = [...Array(n).keys()];
      const off = Array.from(this.shift);
      const reach = this.slab ? SLAB_RADIUS : LOCAL_RADIUS + guest + 3;
      const imageDims = this.slab ? [0, 1] : wrapDims;
      let shifts = [[0, 0, 0]];
      for (const j of imageDims) {
        const span = Math.ceil(reach * Math.hypot(inv[0][j], inv[1][j], inv[2][j])) + 1;
        const next = [];
        for (const s of shifts) for (let m = -span; m <= span; m += 1) { const t = s.slice(); t[j] = m; next.push(t); }
        shifts = next;
      }
      for (const s of shifts) {
        if (!s[0] && !s[1] && !s[2]) continue;
        const v = [0, 1, 2].map((k) => s[0] * sys.cell[0][k] + s[1] * sys.cell[1][k] + s[2] * sys.cell[2][k]);
        for (let i = 0; i < n; i += 1) {
          if (sys.ads[i]) continue;
          const x = W0[3 * i] + v[0] - fc[0]; const y = W0[3 * i + 1] + v[1] - fc[1]; const z = W0[3 * i + 2] + v[2] - fc[2];
          if ((this.slab ? Math.hypot(x, y) : Math.hypot(x, y, z)) > reach) continue;
          src.push(i);
          off.push(this.shift[3 * i] + v[0], this.shift[3 * i + 1] + v[1], this.shift[3 * i + 2] + v[2]);
        }
      }
      this.dsrc = Int32Array.from(src);
      this.doff = Float64Array.from(off);
      this.m = src.length;
      this.setFrames({ IS: sys.is });
    }

    setFrames(frames) {
      this.stop();
      this.frames = frames;
      this.tmax = frames.FS ? 2 : frames.TS ? 1 : 0;
      this.t = Math.min(this.t, this.tmax);
      this.select();
      this.fit();
    }

    // Positions of the display list (display index k < n is atom k itself).
    displayFrame(P) {
      const m = this.m; const src = this.dsrc; const off = this.doff;
      const out = new Float64Array(3 * m);
      for (let k = 0; k < m; k += 1) {
        const i = 3 * src[k];
        out[3 * k] = P[i] + off[3 * k]; out[3 * k + 1] = P[i + 1] + off[3 * k + 1]; out[3 * k + 2] = P[i + 2] + off[3 * k + 2];
      }
      return out;
    }

    select() {
      const sys = this.sys;
      const n = sys.n; const m = this.m;
      const IS = this.displayFrame(sys.is);
      const core = new Set([...this.focus, ...this.pairAtoms]);
      // Reacting atoms: large displacements only; frameworks relax by ~0.1-0.3 Å everywhere.
      for (const name of ['TS', 'FS']) {
        const F = this.frames[name];
        if (!F) continue;
        const d = new Float64Array(n);
        for (let i = 0; i < n; i += 1) d[i] = Math.hypot(F[3 * i] - sys.is[3 * i], F[3 * i + 1] - sys.is[3 * i + 1], F[3 * i + 2] - sys.is[3 * i + 2]);
        const cut = Math.max(0.35, 0.3 * Math.max(...d));
        for (let i = 0; i < n; i += 1) if (d[i] > cut) core.add(i);
      }
      const coreList = [...core];
      let keep = [];
      if (this.opts.local) {
        const r2 = LOCAL_RADIUS * LOCAL_RADIUS;
        for (let k = 0; k < m; k += 1) {
          if (k < n && core.has(k)) { keep.push(k); continue; }
          const x = IS[3 * k]; const y = IS[3 * k + 1]; const z = IS[3 * k + 2];
          if (coreList.some((j) => (x - IS[3 * j]) ** 2 + (y - IS[3 * j + 1]) ** 2 + (z - IS[3 * j + 2]) ** 2 < r2)) keep.push(k);
        }
      } else if (this.slab) {
        const fc = this.fc;
        for (let k = 0; k < m; k += 1) {
          if ((k < n && core.has(k)) || Math.hypot(IS[3 * k] - fc[0], IS[3 * k + 1] - fc[1]) <= SLAB_RADIUS) keep.push(k);
        }
      } else {
        keep = [...Array(n).keys()];
      }
      this.keep = keep;
      const lo = [Infinity, Infinity, Infinity]; const hi = [-Infinity, -Infinity, -Infinity];
      for (const i of keep) for (let k = 0; k < 3; k += 1) { lo[k] = Math.min(lo[k], IS[3 * i + k]); hi[k] = Math.max(hi[k], IS[3 * i + k]); }
      this.center = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2);
      let r = 0;
      for (const i of keep) r = Math.max(r, Math.hypot(IS[3 * i] - this.center[0], IS[3 * i + 1] - this.center[1], IS[3 * i + 2] - this.center[2]) + this.radii[this.dsrc[i]]);
      this.extent = Math.max(r, 3);
    }

    fit() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const w = Math.max(1, Math.round(rect.width * dpr)); const h = Math.max(1, Math.round(rect.height * dpr));
      if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
      this.dpr = dpr;
      this.draw();
    }

    positions() {
      const { IS, TS, FS } = this.frames;
      const t = this.t;
      if (t <= 0 || !TS) return IS;
      if (t >= 2 && FS) return FS;
      if (t === 1) return TS;
      const [A, B, u] = t < 1 ? [IS, TS, t] : [TS, FS, t - 1];
      const e = 0.5 - 0.5 * Math.cos(Math.PI * u);
      const out = new Float64Array(A.length);
      for (let i = 0; i < A.length; i += 1) out[i] = A[i] + (B[i] - A[i]) * e;
      return out;
    }

    frameName() {
      if (this.t === 0) return 'IS';
      if (this.t === 1) return 'TS';
      if (this.t === 2) return 'FS';
      return null;
    }

    show(name) {
      this.stop();
      this.t = name === 'IS' ? 0 : name === 'TS' ? 1 : 2;
      this.t = Math.min(this.t, this.tmax);
      this.draw();
      this.onFrame();
    }

    play() {
      if (this.tmax === 0) return;
      this.playing = true;
      if (this.t >= this.tmax) this.dir = -1;
      if (this.t <= 0) this.dir = 1;
      let last = performance.now();
      const step = (now) => {
        if (!this.playing) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        this.t += this.dir * dt * 0.8;
        if (this.t >= this.tmax) { this.t = this.tmax; this.dir = -1; }
        if (this.t <= 0) { this.t = 0; this.dir = 1; }
        this.draw();
        this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
      this.onFrame();
    }

    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      const was = this.playing;
      this.playing = false;
      if (was) {
        this.t = this.t < 0.5 ? 0 : this.t < 1.5 || !this.frames.FS ? Math.min(1, this.tmax) : 2;
        if (this.onFrame) this.onFrame();
      }
    }

    draw() {
      if (!this.sys || !this.frames) return;
      const ctx = this.ctx;
      const W = this.canvas.width; const H = this.canvas.height; const dpr = this.dpr || 1;
      ctx.clearRect(0, 0, W, H);
      const raw = this.positions();
      const P = this.displayFrame(raw);
      const IS = this.displayFrame(this.frames.IS);
      const R = this.R; const c = this.center;
      const scale = (Math.min(W, H) / (2.15 * this.extent)) * this.zoom;
      const n = this.sys.n; const m = this.m; const src = this.dsrc;
      const X = new Float64Array(m); const Y = new Float64Array(m); const Z = new Float64Array(m);
      const project = (x, y, z) => {
        const dx = x - c[0]; const dy = y - c[1]; const dz = z - c[2];
        return [W / 2 + scale * (R[0] * dx + R[1] * dy + R[2] * dz), H / 2 - scale * (R[3] * dx + R[4] * dy + R[5] * dz), R[6] * dx + R[7] * dy + R[8] * dz];
      };
      for (const i of this.keep) [X[i], Y[i], Z[i]] = project(P[3 * i], P[3 * i + 1], P[3 * i + 2]);
      const css = getComputedStyle(document.documentElement);
      const ink = css.getPropertyValue('--ink').trim() || '#1d2939';

      if (this.opts.cell) {
        const o = this.cellOrigin; const cell = this.sys.cell;
        const corner = (a, b, d) => project(...[0, 1, 2].map((k) => o[k] + a * cell[0][k] + b * cell[1][k] + d * cell[2][k]));
        ctx.save();
        ctx.strokeStyle = 'rgba(102,112,133,.55)'; ctx.lineWidth = dpr; ctx.setLineDash([4 * dpr, 4 * dpr]);
        ctx.beginPath();
        for (const [a, b, d, e, f, g] of [[0, 0, 0, 1, 0, 0], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1], [0, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 0], [1, 0, 0, 1, 1, 0], [0, 0, 1, 0, 1, 1], [1, 0, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 1], [0, 1, 0, 0, 1, 1], [1, 1, 0, 1, 1, 1]]) {
          const p = corner(a, b, d); const q = corner(e, f, g);
          ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
        }
        ctx.stroke(); ctx.restore();
      }

      // bonds (no metal-metal bonds); indices are display indices, src[] maps them to atoms
      const keep = this.keep;
      const bonds = keep.map(() => []);
      const where = new Int32Array(m).fill(-1);
      keep.forEach((i, k) => { where[i] = k; });
      for (let a = 0; a < keep.length; a += 1) {
        const i = keep[a]; const si = src[i];
        for (let b = a + 1; b < keep.length; b += 1) {
          const j = keep[b]; const sj = src[j];
          if (this.metal[si] && this.metal[sj]) continue;
          const cut = this.sys.symbols[si] === 'H' && this.sys.symbols[sj] === 'H' ? 0.9 : 1.15 * (this.cov[si] + this.cov[sj]);
          const dx = P[3 * i] - P[3 * j]; const dy = P[3 * i + 1] - P[3 * j + 1]; const dz = P[3 * i + 2] - P[3 * j + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < cut * cut && d2 > 0.16) { bonds[a].push(j); bonds[b].push(i); }
        }
      }
      let zmin = Infinity; let zmax = -Infinity;
      for (const i of keep) { zmin = Math.min(zmin, Z[i]); zmax = Math.max(zmax, Z[i]); }
      const zspan = Math.max(1e-6, zmax - zmin);
      const order = keep.slice().sort((a, b) => Z[a] - Z[b]);
      const bondWidth = Math.max(1.2 * dpr, 0.2 * scale);
      ctx.lineCap = 'round';
      for (const i of order) {
        const s = src[i];
        const ads = this.sys.ads[s];
        const pal = palette(this.sys.symbols[s]);
        // porous frameworks are drawn thin so the guest stands out
        const thin = this.zeo && !ads ? 0.55 : 1;
        const fog = ads ? 1 : 0.55 + 0.45 * ((Z[i] - zmin) / zspan);
        ctx.globalAlpha = (this.sys.fixed[s] ? 0.6 : 1) * fog;
        for (const j of bonds[where[i]]) {
          const mx = (X[i] + X[j]) / 2; const my = (Y[i] + Y[j]) / 2;
          ctx.strokeStyle = 'rgba(30,35,45,.55)'; ctx.lineWidth = bondWidth * thin + 1.6 * dpr;
          ctx.beginPath(); ctx.moveTo(X[i], Y[i]); ctx.lineTo(mx, my); ctx.stroke();
          ctx.strokeStyle = pal.base; ctx.lineWidth = bondWidth * thin;
          ctx.beginPath(); ctx.moveTo(X[i], Y[i]); ctx.lineTo(mx, my); ctx.stroke();
        }
        const r = this.radii[s] * scale * (ads ? 1.05 : thin);
        if (r < 0.3) continue;
        const g = ctx.createRadialGradient(X[i] - 0.35 * r, Y[i] - 0.35 * r, 0.1 * r, X[i], Y[i], r);
        g.addColorStop(0, pal.light); g.addColorStop(0.55, pal.base); g.addColorStop(1, pal.dark);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(X[i], Y[i], r, 0, 2 * Math.PI); ctx.fill();
        if (ads) { ctx.strokeStyle = 'rgba(20,24,32,.7)'; ctx.lineWidth = dpr; ctx.stroke(); }
        if (i < n && this.pairAtoms.has(i)) { ctx.strokeStyle = '#f79009'; ctx.lineWidth = 2.2 * dpr; ctx.beginPath(); ctx.arc(X[i], Y[i], r + 2.5 * dpr, 0, 2 * Math.PI); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;

      if (this.opts.arrows && this.t > 0.02) {
        ctx.strokeStyle = '#e8590c'; ctx.fillStyle = '#e8590c'; ctx.lineWidth = 2 * dpr;
        for (const i of keep) {
          if (i >= n) continue;
          const d = Math.hypot(raw[3 * i] - this.frames.IS[3 * i], raw[3 * i + 1] - this.frames.IS[3 * i + 1], raw[3 * i + 2] - this.frames.IS[3 * i + 2]);
          if (d < 0.3) continue;
          const [x0, y0] = project(IS[3 * i], IS[3 * i + 1], IS[3 * i + 2]);
          const len = Math.hypot(X[i] - x0, Y[i] - y0);
          if (len < 6 * dpr) continue;
          const ux = (X[i] - x0) / len; const uy = (Y[i] - y0) / len; const head = Math.min(9 * dpr, len * 0.5);
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(X[i] - ux * head * 0.6, Y[i] - uy * head * 0.6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(X[i], Y[i]);
          ctx.lineTo(X[i] - ux * head - uy * head * 0.5, Y[i] - uy * head + ux * head * 0.5);
          ctx.lineTo(X[i] - ux * head + uy * head * 0.5, Y[i] - uy * head - ux * head * 0.5);
          ctx.closePath(); ctx.fill();
        }
      }

      const visible = new Set(keep);
      ctx.font = `${12 * dpr}px system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const [i, j] of this.sys.pairs) {
        if (!visible.has(i) || !visible.has(j)) continue;
        const d = Math.hypot(P[3 * i] - P[3 * j], P[3 * i + 1] - P[3 * j + 1], P[3 * i + 2] - P[3 * j + 2]);
        ctx.save();
        ctx.strokeStyle = '#f79009'; ctx.lineWidth = 2 * dpr; ctx.setLineDash([5 * dpr, 4 * dpr]);
        ctx.beginPath(); ctx.moveTo(X[i], Y[i]); ctx.lineTo(X[j], Y[j]); ctx.stroke();
        ctx.restore();
        const text = `${d.toFixed(2)} Å`;
        const mx = (X[i] + X[j]) / 2; const my = (Y[i] + Y[j]) / 2;
        const tw = ctx.measureText(text).width + 8 * dpr;
        ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(mx - tw / 2, my - 9 * dpr, tw, 18 * dpr);
        ctx.fillStyle = '#b54708'; ctx.fillText(text, mx, my);
      }

      const names = T().frameNames;
      let caption;
      if (this.t === 0) caption = `IS · ${names.IS}`;
      else if (this.t === 1) caption = `TS · ${names.TS}`;
      else if (this.t === 2) caption = `FS · ${names.FS}`;
      else caption = this.t < 1 ? `IS → TS ${Math.round(100 * this.t)} %` : `TS → FS ${Math.round(100 * (this.t - 1))} %`;
      this.overlay.textContent = caption;
      this.overlay.style.color = ink;
    }
  }

  // ------------------------------------------------------------------ structures: page
  function caseTitle(c) {
    const head = [c.material, c.reaction || c.guest].filter(Boolean).join(' · ');
    return head || c.id;
  }

  function sourceLink(src) {
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return `<a href="${esc(src)}" target="_blank" rel="noopener">${esc(src)}</a>`;
    if (/^10\.\d{4,}\//.test(src)) return `<a href="https://doi.org/${esc(src)}" target="_blank" rel="noopener">${esc(src)}</a>`;
    return esc(src);
  }

  function energySVG(ch, frame) {
    const E = [0, ch.b, isNum(ch.dE) ? ch.dE : (isNum(ch.b) && isNum(ch.rev) ? ch.b - ch.rev : null)];
    const known = E.filter(isNum).map(Number);
    const lo = Math.min(0, ...known); const hi = Math.max(0, ...known);
    const span = hi - lo || 1;
    const W = 380; const H = 180; const top = 30; const bottom = 36;
    const y = (e) => top + (H - top - bottom) * (1 - (e - lo) / span);
    const xs = [60, 190, 320];
    const names = ['IS', 'TS', 'FS'];
    let path = '';
    if (isNum(E[1])) {
      path = `M ${xs[0] + 34} ${y(0)} C ${xs[0] + 80} ${y(0)}, ${xs[1] - 50} ${y(E[1])}, ${xs[1]} ${y(E[1])}`;
      if (isNum(E[2])) path += ` S ${xs[2] - 80} ${y(E[2])}, ${xs[2] - 34} ${y(E[2])}`;
    }
    const levels = names.map((name, k) => {
      if (!isNum(E[k])) return '';
      const yy = y(E[k]);
      const on = name === frame;
      const value = k === 0 ? '0.00' : signed(E[k]);
      return `<g data-frame="${name}" style="cursor:pointer"><line class="lvl" x1="${xs[k] - 34}" x2="${xs[k] + 34}" y1="${yy}" y2="${yy}" stroke="${on ? '#f79009' : 'currentColor'}"/>
        <rect x="${xs[k] - 40}" y="${yy - 22}" width="80" height="44" fill="transparent"/>
        <text x="${xs[k]}" y="${yy - 10}" text-anchor="middle" font-weight="${on ? 700 : 400}">${name}</text>
        <text x="${xs[k]}" y="${yy + 17}" text-anchor="middle">${value}</text></g>`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="energy profile" style="color:var(--ink)"><path class="path" d="${path}"/>${levels}</svg>`;
  }

  async function renderStructures(app, setKey, caseId) {
    const t = T();
    if (!sets[setKey]) setKey = sets[state.st.set] ? state.st.set : 'F1';
    if (setKey !== state.st.set) { state.st.q = ''; state.st.onlyS5 = false; state.st.onlyTS = false; }
    state.st.set = setKey;
    const index = sets[setKey];
    app.innerHTML = `<h1>${esc(t.structTitle)}</h1><p class="muted">${esc(t.structIntro)}</p><p class="loading">…</p>`;
    const data = await load(`sets/${setKey}`);
    if (state.tab !== 'structures') return;
    const setChips = Object.keys(sets).map((k) => `<a class="chip${k === setKey ? ' on' : ''}" href="#structures/${encodeURIComponent(k)}" title="${esc(tr(sets[k], 'name'))}">${esc(k)} · ${sets[k].count}</a>`).join('');
    const hasS5 = index.cases.some((c) => c.gf8 !== undefined);
    app.innerHTML = `<h1>${esc(t.structTitle)}</h1><p class="muted">${esc(t.structIntro)}</p>
      <div class="struct-layout">
        <aside class="side">
          <div class="chips">${setChips}</div>
          <div><b>${esc(tr(index, 'name'))}</b><p class="set-desc">${esc(tr(index, 'desc'))}</p></div>
          <div class="side-filters">
            <input type="search" id="c-q" placeholder="${esc(t.filterCases)}" value="${esc(state.st.q)}" aria-label="${esc(t.filterCases)}">
            ${index.withTS && index.withTS < index.count ? `<label><input type="checkbox" id="c-ts"${state.st.onlyTS ? ' checked' : ''}> ${esc(t.onlyTS)}</label>` : ''}
            ${hasS5 ? `<label><input type="checkbox" id="c-s5"${state.st.onlyS5 ? ' checked' : ''}> ${esc(t.onlyS5)}</label>` : ''}
            <span class="small muted" id="c-count"></span>
          </div>
          <div class="case-list" id="case-list"></div>
        </aside>
        <section class="viewer-wrap" id="case-view"><p class="muted">${esc(t.selectCase)}</p></section>
      </div>`;
    const visibleCases = () => {
      const q = state.st.q.trim().toLowerCase();
      return index.cases.filter((c) => (!state.st.onlyTS || c.hasTS) && (!state.st.onlyS5 || c.gf8 !== undefined)
        && (!q || [c.id, c.material, c.reaction, c.guest, c.split, c.host].join(' ').toLowerCase().includes(q)));
    };
    const drawList = () => {
      const list = visibleCases();
      $('#c-count').textContent = t.casesN(list.length, index.count);
      $('#case-list').innerHTML = list.map((c) => {
        const meta = [label(t.splits, c.split), `${c.atoms} ${LANG === 'zh' ? '原子' : 'atoms'}`,
          isNum(c.barrier) ? `Eb ${fixed(c.barrier)} eV` : '', c.hasTS ? 'TS' : '', c.gf8 !== undefined ? `GF8: ${c.gf8}` : ''].filter(Boolean).join(' · ');
        return `<button type="button" class="case-item${c.id === state.st.id ? ' on' : ''}" data-id="${esc(c.id)}"><span class="ctitle">${esc(caseTitle(c))}</span><span class="cid">${esc(c.id)}</span><span class="cmeta">${esc(meta)}</span></button>`;
      }).join('') || `<p class="empty">—</p>`;
      $$('.case-item', app).forEach((b) => b.addEventListener('click', () => selectCase(b.dataset.id)));
    };
    const selectCase = (id) => {
      state.st.id = id;
      $$('.case-item', app).forEach((b) => b.classList.toggle('on', b.dataset.id === id));
      setHash(`#structures/${encodeURIComponent(setKey)}/${encodeURIComponent(id)}`);
      showCase(data.cases[id]);
    };
    $('#c-q').addEventListener('input', (e) => { state.st.q = e.target.value; drawList(); });
    if ($('#c-ts')) $('#c-ts').addEventListener('change', (e) => { state.st.onlyTS = e.target.checked; drawList(); });
    if ($('#c-s5')) $('#c-s5').addEventListener('change', (e) => { state.st.onlyS5 = e.target.checked; drawList(); });
    let start = caseId && data.cases[caseId] ? caseId : null;
    if (!start && state.st.id && data.cases[state.st.id]) start = state.st.id;
    if (!start) start = (index.cases.find((c) => c.hasTS) || index.cases[0] || {}).id;
    state.st.id = start;
    drawList();
    if (start) {
      selectCase(start);
      const active = $('.case-item.on', app);
      if (active) active.scrollIntoView({ block: 'nearest' });
    }
  }

  function showCase(c) {
    const t = T();
    const view = $('#case-view');
    if (!c) { view.innerHTML = `<p class="muted">${esc(t.selectCase)}</p>`; return; }
    const sys = decodeCase(c);
    const channels = channelsOf(c);
    const chips = [label(t.hosts, c.host), label(t.splits, c.split), label(t.strata, c.stratum), label(t.kinds, c.kind)].filter(Boolean)
      .map((x) => `<span class="chip">${esc(x)}</span>`).join('');
    const metaRows = [
      ['material', esc(c.material)], ['reaction', esc(c.reaction)], ['guest', esc(c.guest)], ['formula', esc(c.formula)],
      ['atoms', String(c.atoms)], ['geometry', esc(c.geometry)],
      ['barrier', isNum(c.barrier) ? `${fixed(c.barrier, 3)} eV` : ''], ['dE', isNum(c.dE) ? `${signed(c.dE, 3)} eV` : ''],
      ['rev', isNum(c.rev) ? `${fixed(c.rev, 3)} eV` : ''], ['event', c.event ? esc(label(EVENTS[c.event] && EVENTS[c.event], LANG) || c.event) : ''],
      ['source', sourceLink(c.source)], ['citation', esc(c.citation)],
    ].filter(([, v]) => v).map(([k, v]) => `<dt>${esc(t.meta[k])}</dt><dd>${v}</dd>`).join('');
    view.innerHTML = `
      <div class="case-head"><h2>${esc(caseTitle(c))}</h2><div class="small muted"><code>${esc(c.id)}</code></div><div class="chips">${chips}</div></div>
      <div class="toolbar">
        <div class="seg" role="group" id="v-frames">${['IS', 'TS', 'FS'].map((f) => `<button type="button" data-frame="${f}" title="${esc(t.frameNames[f])}">${f}</button>`).join('')}</div>
        <button type="button" class="btn" id="v-play">${esc(t.play)}</button>
        <button type="button" class="btn" id="v-local" title="${esc(t.localTip)}">${esc(t.local)}</button>
        <button type="button" class="btn" id="v-cell">${esc(t.cell)}</button>
        <button type="button" class="btn" id="v-arrows" title="${esc(t.arrowsTip)}">${esc(t.arrows)}</button>
        <button type="button" class="btn" id="v-reset">${esc(t.reset)}</button>
      </div>
      <div class="canvas-box" id="v-box"><canvas aria-label="3-D structure"></canvas><div class="overlay"></div>
        <div class="zoom"><button type="button" data-zoom="1.25" aria-label="zoom in">+</button><button type="button" data-zoom="0.8" aria-label="zoom out">−</button></div>
        <div class="hint">${esc(t.hint)}</div></div>
      <div class="two">
        <div class="panel">${channels.length ? `<h3>${esc(t.saddles)}</h3><div class="found scroll-x"><table class="grid"><thead><tr><th>${esc(t.cols.k)}</th><th>${esc(t.cols.b)}</th><th>${esc(t.cols.dE)}</th><th>${esc(t.cols.type)}</th><th>${esc(t.cols.seeds)}</th></tr></thead><tbody>${channels.map((ch, k) => `<tr data-ch="${k}"><td>${ch.ref ? `<span title="${esc(ch.dft ? t.dftTip : t.referenceTip)}">${ch.dft ? 'DFT' : esc(t.reference)}</span>` : `#${ch.k}`}</td><td class="num">${fixed(ch.b, 3)}</td><td class="num">${signed(ch.dE, 3)}</td><td>${esc(ch.type ? (EVENTS[ch.type] ? EVENTS[ch.type][LANG] : ch.type) : (ch.ref ? label(t.kinds, c.kind) : ''))}</td><td class="num">${ch.ref ? '—' : ch.seeds}</td></tr>`).join('')}</tbody></table></div>${c.found ? `<p class="small muted" style="margin:.4rem 0 0">#: ${esc(t.found)} (${c.found.length}); ${esc(t.cols.seeds)} = 1–2</p>` : ''}` : `<p class="muted" style="margin:0">${esc(t.noTS)}</p>`}</div>
        <div class="panel energy" id="v-energy">${channels.length ? '' : `<dl class="meta">${metaRows}</dl>`}</div>
      </div>
      ${channels.length ? `<div class="panel"><dl class="meta">${metaRows}</dl></div>` : ''}
      <div class="panel"><div class="dl"><b style="margin-right:.4rem">${esc(t.download)}:</b><span id="v-dl"></span></div><p class="small muted" style="margin:.3rem 0 0">${esc(t.dlNote)}</p></div>`;

    const box = $('#v-box');
    let current = 0;
    const update = () => {
      const fname = viewer.frameName();
      $$('#v-frames button').forEach((b) => {
        const f = b.dataset.frame;
        b.disabled = !viewer.frames[f];
        b.classList.toggle('on', !viewer.playing && f === fname);
      });
      $('#v-play').disabled = viewer.tmax === 0;
      $('#v-play').textContent = viewer.playing ? t.pause : t.play;
      $('#v-local').classList.toggle('on', viewer.opts.local);
      $('#v-cell').classList.toggle('on', viewer.opts.cell);
      $('#v-arrows').classList.toggle('on', viewer.opts.arrows);
      if (channels.length) {
        $('#v-energy').innerHTML = `<h3>${esc(t.energy)}</h3>${energySVG(channels[current], viewer.playing ? null : fname)}`;
        $$('#v-energy g[data-frame]').forEach((g) => g.addEventListener('click', () => { if (viewer.frames[g.dataset.frame]) viewer.show(g.dataset.frame); }));
      }
      const ch = channels[current];
      const base = String(c.id).replace(/[^\w.-]+/g, '_') + (ch && !ch.ref ? `_GF8-saddle${String(ch.k).padStart(2, '0')}` : '');
      $('#v-dl').innerHTML = ['IS', 'TS', 'FS'].map((f) => `<button type="button" class="btn" data-dl="${f}"${viewer.frames[f] ? '' : ' disabled'}>${f}</button>`).join(' ');
      $$('#v-dl button').forEach((b) => b.addEventListener('click', () => {
        const f = b.dataset.dl;
        saveText(`${base}_${f}.extxyz`, extxyz(sys, viewer.frames[f], `${c.id} ${f}${ch && !ch.ref ? ` GF8 saddle ${ch.k}` : ''} (NEP89 lab explorer, 0.01 A)`));
      }));
    };
    if (viewer) viewer.destroy();
    viewer = new Viewer(box, () => update());
    viewer.setSystem(sys);
    const useChannel = (k) => {
      current = k;
      const ch = channels[k];
      viewer.setFrames(ch ? { IS: sys.is, TS: applyDelta(sys.is, ch.ts), FS: applyDelta(sys.is, ch.fs) } : { IS: sys.is });
      $$('tr[data-ch]').forEach((row) => row.classList.toggle('on', Number(row.dataset.ch) === k));
      viewer.show(ch ? 'TS' : 'IS');
    };
    $$('#v-frames button').forEach((b) => b.addEventListener('click', () => viewer.show(b.dataset.frame)));
    $('#v-play').addEventListener('click', () => { if (viewer.playing) viewer.stop(); else viewer.play(); update(); });
    $('#v-local').addEventListener('click', () => { viewer.opts.local = !viewer.opts.local; viewer.opts.cell = !viewer.opts.local; viewer.select(); viewer.draw(); update(); });
    $('#v-cell').addEventListener('click', () => { viewer.opts.cell = !viewer.opts.cell; viewer.draw(); update(); });
    $('#v-arrows').addEventListener('click', () => { viewer.opts.arrows = !viewer.opts.arrows; viewer.draw(); update(); });
    $('#v-reset').addEventListener('click', () => viewer.resetView());
    $$('.zoom button', box).forEach((b) => b.addEventListener('click', () => viewer.setZoom(viewer.zoom * Number(b.dataset.zoom))));
    $$('tr[data-ch]').forEach((row) => row.addEventListener('click', () => useChannel(Number(row.dataset.ch))));
    useChannel(channels.length ? 0 : -1);
  }

  // ------------------------------------------------------------------ boot
  async function boot() {
    try {
      [site, rounds, sets] = await Promise.all([load('site'), load('rounds'), load('sets')]);
    } catch (err) {
      console.error(err);
      $('#app').innerHTML = `<div class="error">${esc(T().loadError)}: ${esc(err.message)}</div>`;
      return;
    }
    if (EMBED) {
      $('#lang-switch').addEventListener('click', (e) => {
        e.preventDefault();
        LANG = LANG === 'en' ? 'zh' : 'en';
        document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
        route();
      });
    }
    window.addEventListener('hashchange', route);
    route();
  }

  boot();
})();
