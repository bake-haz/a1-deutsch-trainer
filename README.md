# A1 Deutsch Trainer

面向**中国成年零基础德语学习者**的 A1 学习系统：  
**A1 德语地基 + A1 考试过关 + 长期记忆训练**。

> 设计理念（产品规格）：可以学得慢，但重要的内容要**真正记住**。  
> 课堂进度 ≠ 掌握进度；地基不能省，高价值拿分项练稳，低价值枝叶允许暂时放弃。

---

## 1. 产品目标与用户

- **目标用户**：39 岁、真正零基础、正在参加线上德语课程、学习速度可以慢、记忆速度相对年轻者较慢，但愿意持续学习的成年人。
- **不做**：Duolingo 复制品、普通 PDF 阅读器、普通词典、选择题网站、游戏化商城、A2/B1（以后再做）。
- **当前范围（V1）**：仅 `A1 Foundation` + `A1 Pass`。

## 2. 学习理念

- **主动回忆（Active Recall）** 高于被动识别（Recognition）。
- 同一知识点**逐步撤掉提示**（Stage 1→5）：完整句 → 填空 → 仅中文 → 仅听问题 → 随机混入。
- 反馈不是「对/错」，而是：**不会 / 想了一会儿 / 秒答**（内部映射 AGAIN / HARD / EASY）。
- 成人慢学习：每天新内容极少（默认 4 个），失败率上升时自动再减少。

## 3. V1 功能范围

| 页面（底部导航） | 内容 |
| --- | --- |
| 今天 | 今日建议时长（20–40 分钟）、今日项目数、开始训练、状态不好（15 分钟保底） |
| 训练 | 6 类训练模式（听读 / 填空 / 中→德 / 德问德答 / 听→答 / 随机回忆）、渐进提示、三档自评 |
| 教材 | 3 本教材 PDF（原始材料层，客户端查看）+ Unit 1–2 结构化层 + Unit/Page 关联 |
| 地基 | A1 知识地图（23 个分类）及真实掌握状态 |
| 进度 | 掌握分布、薄弱项、明日优先复习、课堂进度 vs 真实掌握、最近训练 |
| 设置 | 语速、每日新内容上限、状态不好上限、课堂 Unit、清空数据 |

## 4. 技术栈

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- 无后端、无 Redux、无数据库（V1）
- 持久化：`localStorage`（数据结构便于以后迁移到 Postgres / Supabase / Neon）
- PDF 显示：`pdfjs-dist`（成熟库，复用）
- 德语 TTS：浏览器原生 `SpeechSynthesis`（仅使用 `de-DE` 语音）
- 间隔复习：自研**简单透明**算法（见 §8），未引入 FSRS/SM-2 等重型实现

## 5. 本地运行

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建（需 0 TypeScript 错误）
npm run start    # 生产服务
```

> 注意：项目内的 `npm` 在某些环境下会触发 Win 子系统包装，请用 Node 自带的
> `node node_modules/npm/bin/npm-cli.js install` 或正常 `npm install` 均可。

## 6. 目录结构

```
a1-deutsch-trainer/
├── src/
│   ├── app/                # 页面（App Router，均为客户端组件）
│   │   ├── layout.tsx      # 根布局：StoreProvider + TtsProvider
│   │   ├── page.tsx        # 今天
│   │   ├── train/          # 训练引擎
│   │   ├── textbook/       # 教材（PDF 查看 + 结构化）
│   │   ├── foundation/     # 地基地图
│   │   ├── progress/       # 进度
│   │   └── settings/       # 设置
│   ├── components/         # BottomNav / AppFrame / TrainingCard / PdfViewer / Store+Tts Provider
│   ├── lib/                # types / review-engine / storage / tts（与 UI 解耦）
│   └── data/               # content.ts（训练项）/ units.ts（教材结构）
├── public/pdf.worker.min.mjs   # pdf.js worker（postinstall 自动复制）
└── scripts/copy-pdf-worker.mjs
```

**内容与 UI 严格分离**：所有德语训练内容在 `src/data/content.ts`，复习算法在 `src/lib/review-engine.ts`，绝不散落在组件里。

## 7. 数据模型（核心）

```ts
LearningItem {            // 训练内容（静态，来自教材）
  id, courseUnit, sourcePage, sourceType, type, priority, skill,
  german, chinese, prompt, answer, hint, grammar, pronunciation,
  foundationValue, examValue, difficulty, tags, foundation?
  // 溯源：pageApprox / verified / sourceNote
}
ReviewState {             // 运行时复习状态（持久化）
  itemId, mastery(NEW|LEARNING|WEAK|STABLE|MASTERED),
  lastReviewed, nextReview, reviewCount, successCount, failureCount,
  responseQuality, intervalIndex, stage, createdAt
}
CourseProgress { currentClassUnit, currentBookPage, lastStudyDate }
ExamSkill { skill, attempts, recentPerformance, stability, weaknesses }
DailySession { date, mode, items[], completedItems, newItems, reviewItems, durationSec }
```

持久化统一写入单个版本化 JSON（`a1dt:store:v1`），未来迁移数据库只改读写层。

## 8. 复习算法（简单、透明）

映射（产品规格 §11/§12）：

- **不会 (AGAIN)** → 当天再次出现（`nextReview = now`，`mastery = WEAK`，`stage=1`）
- **想了一会儿 (HARD)** → 短期复习（次日，`mastery → STABLE/WEAK`）
- **秒答 (EASY)** → 渐进间隔：**1 → 3 → 7 → 14 → 30 天**（`intervalIndex` 递增）

`mastery` 由 `intervalIndex` 推导：`>=5` 已掌握、`>=3` 稳定、`>=1` 学习、否则薄弱。  
记忆阶段 `stage(1–5)` 随掌握度提高而减少提示——实现「逐步撤掉提示」。

## 9. 教材导入方式

三本教材 PDF（学生用书 312 页 / 词汇手册 92 页 / 测试手册 72 页）均为**扫描版**：

- **原始材料层**：在「教材」页选择本地 PDF 文件，使用 `pdfjs-dist` 在**客户端**渲染原书页（不上传、不随源码提交）。
- **结构化层**：Unit 1–2（Lektion 1–2）已手工程序化整理为训练项，每个项可溯源到 `courseUnit / sourcePage`，并链接回原书页与训练。
- **关联**：教材页的知识点可一键「强化训练」→ 进入对应 Unit 的训练。
- **待结构化**：Unit 3–16 仅建立结构占位并指向原书 PDF，未编造内容。

## 10. TTS 实现

- 使用浏览器 `window.speechSynthesis`，仅选取 `lang` 以 `de` 开头的语音。
- 若无德语语音：**明确提示用户**，绝不回退到英语语音冒充德语。

## 11. 数据保存方式

- `localStorage`，键 `a1dt:store:v1`。刷新不丢、关闭重开不丢、换设备重进（同浏览器）不丢。
- 提供「清空全部学习数据」开关。

## 12. 当前限制（V1）

- Unit 1–2 已结构化；Unit 3–16 仅占位。
- 因教材为扫描 PDF，正文无法自动解析；Unit 1–2 内容为依据教材标准大纲手工程序化录入，`sourcePage` 为估算值（标注 `待核对`）。
- 测试手册仅建立考试能力入口，未逐题导入。
- 口语训练为「听→自己说→自评」，未强制接入语音识别（避免不稳定阻塞 V1）。
- 无后端、无账号、无云端同步（V1 目标）。

## 13. 未来扩展位置

- A2/B1 阶段；Unit 3–16 结构化；教材 OCR 批量导入。
- 云端数据库（Postgres/Supabase/Neon）迁移（仅改 `lib/storage.ts`）。
- 真实模拟考试、分项成绩、错题本（架构已预留 `ExamSkill`）。
- 母语者真人音频替换 TTS；实验性德语语音识别。

---

## REUSED OPEN SOURCE（复用清单）

| 项目 / 库 | 地址 | License | 复用了什么 | 为什么选它 |
| --- | --- | --- | --- | --- |
| **Next.js** | https://github.com/vercel/next.js | MIT | 应用框架 / 路由 / 构建 | 产品规格指定优先；App Router 客户端渲染足够，无需后端 |
| **React** | https://github.com/facebook/react | MIT | UI 框架 | 生态成熟，组件化清晰 |
| **Tailwind CSS** | https://github.com/tailwindlabs/tailwindcss | MIT | 样式系统 | 移动端优先、克制配色，符合成人安静可靠的设计 |
| **pdfjs-dist (PDF.js)** | https://github.com/mozilla/pdf.js | Apache-2.0 | PDF 客户端渲染 | 成熟 PDF 显示方案，不自己造 PDF renderer |
| **浏览器 SpeechSynthesis** | Web 标准 | — | 德语 TTS | 原生能力，零依赖、零成本；仅用 de-DE 语音 |
| **TypeScript** | https://github.com/microsoft/TypeScript | Apache-2.0 | 类型安全 | 数据模型复杂，类型即文档 |

> 评估过但未引入：`ts-fsrs` / SM-2（产品规格要求 V1 用简单透明算法，引入 FSRS 属过度工程）；
> 评估过但未直接 Fork 的完整项目：Linguardian / Baustein / Netzwerk A1 / sehen-sah-gesehen
> （各自携带 OAuth/Mongo/Supabase/游戏化/不同教材等不匹配基建，改造比自建聚焦应用更复杂，违反「复用是为减复杂度」原则）。

## CUSTOM BUILT（自研清单）

| 功能 | 为什么必须自研 |
| --- | --- |
| `lib/review-engine.ts` 简单间隔算法 | 产品规格明确要求 V1 用透明、可解释的 1/3/7/14/30 天阶梯，而非黑盒 FSRS |
| `src/data/content.ts` Unit 1–2 训练内容 | 教材为扫描 PDF 无法自动解析，需依据标准大纲手工程序化录入并保留溯源 |
| 渐进提示 / 三档自评训练引擎 | 产品核心交互（主动回忆、撤提示），无现成库直接匹配 |
| `lib/storage.ts` 版本化 localStorage 封装 | 需要便于未来迁移云端的统一读写层 |
| 「教材」页 Unit/Page 关联与结构化层 | 把原始 PDF 与训练系统打通的特定产品逻辑 |

CUSTOM BUILT 保持最小，仅覆盖现成方案无法直接满足的产品核心逻辑；用户体验未因此妥协。
