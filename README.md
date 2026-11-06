# NEP89 saddle-search lab — 389 rounds explained · 389 轮全解读

**Explorer / 网页:** [English](https://jiaaowang-ut.github.io/nep89-saddle-search-rounds/) · [中文](https://jiaaowang-ut.github.io/nep89-saddle-search-rounds/zh.html) ·
**Downloads / 下载:** [release v1.0](https://github.com/JiaaoWANG-ut/nep89-saddle-search-rounds/releases/tag/v1.0) (offline single-file page, round records, ranking, all structures)

[English](#english) · [中文](#中文)

## English

A bilingual explorer of 389 numbered rounds (379 run, 10 numbers unused) of
transition-state (saddle-point) search algorithm development on the NEP89 machine-learned potential, for
surface and zeolite reactions started from the initial state only. For every round the explorer explains the
idea in plain words, lists the test systems, and gives the measured efficiency and the verdict. Its structure
browser shows the 563 test structures in 3D (419 with initial, transition and final
states) and the 421 saddles the default method found in the sealed grand final GF8.

### Final ranking: sealed grand final GF8

GF8 (round 385) used 54 initial states that no earlier round had run (36 metal and alloy surfaces,
18 zeolites). Every method ran twice per state with different seeds, every NEP89 call was charged, and one
exact-Hessian validator judged all methods. U is the number of distinct certified saddles; brackets are 95 %
confidence intervals from a bootstrap over initial states.

| # | Method | What it does | U / 1,000 ionic steps | U / 1,000 force calls | Saddles U | Rounds |
|---:|---|---|---|---|---:|---|
| 1 | `long-lowbarrier-auto-81` † | Low-barrier window (≤ 1.5 eV) + two-witness local energy-cap memory | 1.686 [1.415, 2.013] | 0.583 [0.481, 0.711] | 404 (≤ 1.5 eV) | r299 / r355 / r383 |
| 2 | `long-lowbarrier-auto-80` † | v0.80 low-barrier window | 1.660 [1.388, 1.992] | 0.568 [0.470, 0.696] | 405 (≤ 1.5 eV) | r245 / r261 |
| 3 | `long-best-auto-81` (conservative candidate) | v0.80 + SAFE4: non-metal bent-endpoint recovery, walk step limit, guarded one-sided validation, Sella stall cutoff | 1.528 [1.373, 1.719] | 0.670 [0.590, 0.773] | 809 | r303 / r363 / r383 |
| 4 | `long-best-auto-81-fullstack-optin` (opt-in full stack) | Conservative candidate + zeolite TGW stack (Lanczos recurrence gate, Sella tail to 3N = 2000) + model-based rotation | 1.526 [1.385, 1.716] | 0.721 [0.648, 0.816] | 833 | r300 / r316 / r303 / r348 / r383 |
| 5 | `long-best-auto-80` (CLI default) | Bond-coordinate relaxed scan → Sella on metals, dimer elsewhere → exact-Hessian certificate + two-sided downhill validation | 1.402 [1.234, 1.616] | 0.630 [0.546, 0.737] | 792 | r261 / r262 |
| 6 | `long-more-auto-81` | --more + SAFE4 (not confirmed separately) | 1.402 [1.266, 1.585] | 0.628 [0.559, 0.721] | 1,013 | r303 / r383 |
| 7 | `long-more-auto-80` (--more) | Default + gradient-extremum starts, site hopping, re-walk with the other engine; finds more saddles | 1.323 [1.185, 1.513] | 0.609 [0.540, 0.703] | 976 | r152 / r156 / r163 / r260 |
| 8 | Sella FAIR-PLUS (baseline) | Plain Sella with random multi-start + dedup, same validator and accounting | 1.190 [1.003, 1.411] | 0.426 [0.344, 0.529] | 105 | r256 |
| 9 | `long-best` | Bond-coordinate scan + dimer, no Sella | 1.018 [0.935, 1.110] | 0.495 [0.450, 0.547] | 785 | r39–r261 |
| 10 | EON-style global search (baseline) | Random local Gaussian displacement + ASE dimer (fair implementation from r337, ≤ 16,000 calls per IS) | 0.487 [0.419, 0.557] | 0.127 [0.106, 0.148] | 219 | r337 |

† Low-barrier presets count only saddles with barriers ≤ 1.5 eV, so their U is not comparable with the full
searches.

### Key findings

* **4.97× more certified saddles per force call** than an EON-style global search (random displacement + dimer), and 2.88× per ionic step, on the sealed GF8 set: 54 never-run initial states × 2 seeds.
* Against the strongest fair baseline, **Sella FAIR-PLUS** (random multi-start Sella + dedup, same validator): 1.48× [1.22, 1.83] per call; per ionic step 1.18× [0.98, 1.44], not significant.
* Most efficient per force call: the opt-in full stack `long-best-auto-81-fullstack-optin`, 1.144× the default (zeolites 1.242×). Highest saddles per ionic step: `long-lowbarrier-auto-81` (saddles ≤ 1.5 eV only).
* The CLI default stays `long-best-auto-80`: bond-coordinate relaxed scan → Sella on metals, dimer elsewhere → exact-Hessian certificate + two-sided downhill validation. v0.81 presets are opt-in.
* Honest limits: all numbers are on the NEP89 surface. The real Quantum ESPRESSO demo (r325) has not yet shown NEP→DFT savings, and on 85 development states the default's two-seed union covers about 490 of 1,296 strict saddles found by an exhaustive census. The search is efficient, not exhaustive.
* Method: each round pre-registers its test, screens on development sets and confirms once on a held-out pool; sealed sets open only at grand finals. Negative results are kept: in campaign 4, 38 of 100 rounds were negative and 8 more inconclusive.

### Notes

* All energies and structures are on the NEP89 potential, except the two round-325 DFT channels.
* Test sets built from the initial state only (as a real user would start) have no reference transition
  state. For the 54 GF8 states the explorer shows the saddles found by the default method instead.
* The `gh-pages` branch holds the static site: `index.html` (English), `zh.html` (Chinese), `assets/` and
  `data/`. The release has a single-file copy that works offline. This repository holds the explorer and its
  data only, not the search code.

## 中文

NEP89 机器学习势上过渡态（鞍点）搜索算法研发的双语全解读，共 389 个轮次编号（实际运行 379 轮，10 个编号未使用），对象是只给初态的表面与分子筛反应。网页逐轮用大白话解释思路，列出测试体系、实测效率和判定；结构浏览器以 3D 展示 563 个测试结构（其中 419 个有初态、过渡态、终态），以及密封总决赛 GF8 中默认方法找到的 421 个鞍点。

### 最终排名：密封总决赛 GF8

GF8（第 385 轮）使用 54 个此前任何一轮都没跑过的初态（36 个金属与合金表面、18 个分子筛）。每种方法在每个初态上用不同种子各跑 2 次，所有 NEP89 力调用都计费，所有方法用同一个精确 Hessian 验证器判定。U 为不同认证鞍点数；方括号为 95 % 置信区间（按初态自助法）。

| # | 方法 | 做了什么 | U / 1,000 离子步 | U / 1,000 次力调用 | 鞍点数 U | 轮次 |
|---:|---|---|---|---|---:|---|
| 1 | `long-lowbarrier-auto-81` † | 低能垒窗口（≤ 1.5 eV）+ 两见证的局部能量上限记忆 | 1.686 [1.415, 2.013] | 0.583 [0.481, 0.711] | 404 (≤ 1.5 eV) | r299 / r355 / r383 |
| 2 | `long-lowbarrier-auto-80` † | v0.80 低能垒窗口 | 1.660 [1.388, 1.992] | 0.568 [0.470, 0.696] | 405 (≤ 1.5 eV) | r245 / r261 |
| 3 | `long-best-auto-81` (保守候选) | v0.80 + SAFE4：非金属弯曲端点恢复、行走限幅、带护栏单侧判定、Sella 停滞截断 | 1.528 [1.373, 1.719] | 0.670 [0.590, 0.773] | 809 | r303 / r363 / r383 |
| 4 | `long-best-auto-81-fullstack-optin` (可选全栈) | 保守候选 + 分子筛 TGW 栈（Lanczos 复发闸、Sella 尾段到 3N = 2000）+ 模型化转动 | 1.526 [1.385, 1.716] | 0.721 [0.648, 0.816] | 833 | r300 / r316 / r303 / r348 / r383 |
| 5 | `long-best-auto-80` (现默认) | 键坐标松弛扫描 → 金属 Sella、其余 dimer → 精确 Hessian 认证 + 双侧下坡验证 | 1.402 [1.234, 1.616] | 0.630 [0.546, 0.737] | 792 | r261 / r262 |
| 6 | `long-more-auto-81` | --more + SAFE4（未单独确认） | 1.402 [1.266, 1.585] | 0.628 [0.559, 0.721] | 1,013 | r303 / r383 |
| 7 | `long-more-auto-80` (--more) | 默认 + 梯度极值起点、位点跳跃、另一引擎重走，多找鞍点 | 1.323 [1.185, 1.513] | 0.609 [0.540, 0.703] | 976 | r152 / r156 / r163 / r260 |
| 8 | Sella FAIR-PLUS (基线) | 原版 Sella 随机多起点 + 去重，同一验证器与计费 | 1.190 [1.003, 1.411] | 0.426 [0.344, 0.529] | 105 | r256 |
| 9 | `long-best` | 键坐标扫描 + dimer，不用 Sella | 1.018 [0.935, 1.110] | 0.495 [0.450, 0.547] | 785 | r39–r261 |
| 10 | EON-style global search (基线) | 随机局部高斯位移 + ASE dimer（第 337 轮公平实现，每初态至多 16,000 次调用） | 0.487 [0.419, 0.557] | 0.127 [0.106, 0.148] | 219 | r337 |

† 低能垒预设只计能垒 ≤ 1.5 eV 的鞍点，其 U 不能与完整搜索直接比较。

### 主要结论

* 在密封 GF8 集（54 个从未运行过的初态 × 2 个种子）上，比 EON 式全局搜索（随机位移 + dimer）每次力调用多找 **4.97 倍**认证鞍点，每离子步 2.88 倍。
* 对最强公平基线 **Sella FAIR-PLUS**（随机多起点 Sella + 去重，同一验证器）：每次调用 1.48 倍 [1.22, 1.83]；每离子步 1.18 倍 [0.98, 1.44]，不显著。
* 每次力调用效率最高：可选全栈 `long-best-auto-81-fullstack-optin`，为默认的 1.144 倍（分子筛 1.242 倍）。每离子步鞍点最多：`long-lowbarrier-auto-81`（只计 ≤ 1.5 eV）。
* CLI 默认保持 `long-best-auto-80`：键坐标松弛扫描 → 金属用 Sella、其余用 dimer → 精确 Hessian 认证 + 双侧下坡验证。v0.81 预设为可选项。
* 诚实的局限：所有数字都在 NEP89 势能面上。真实 QE 演示（r325）尚未证明 NEP→DFT 的节省；在 85 个开发初态上，穷举普查找到 1,296 个严格鞍点，默认两种子并集只覆盖约 490 个。搜索是高效的，但不是穷举的。
* 方法学：每轮预注册检验、在开发集上筛选、在留出池上只确认一次；密封集只在总决赛打开。阴性结果全部保留：第四阶段 100 轮中 38 轮阴性，另有 8 轮不确定。

### 说明

* 除第 325 轮的两个 DFT 通道外，所有能量和结构都在 NEP89 势能面上。
* 只从初态出发构建的测试集（与真实用户一样）没有参考过渡态；对 54 个 GF8 初态，网页展示默认方法找到的鞍点。
* `gh-pages` 分支是静态网页：`index.html`（英文）、`zh.html`（中文）、`assets/` 和 `data/`。Release 中有可离线打开的单文件版。本仓库只包含网页及其数据，不含搜索代码。
