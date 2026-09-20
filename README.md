# A1 Deutsch Trainer

面向**中国成年零基础德语学习者**的 A1 训练系统。

> 网站只做一件事：**从 0 开始，打牢 A1 地基，通过 A1。**
> 产品哲学：可以学得慢，但重要的内容要**真正记住**。

---

## 1. 三条铁律（V1 整改后）

1. **内容只有两个来源，且都可核查。**
   - `USER_CONFIRMED` — 用户明确提供 / 练习过的内容。
   - `GENERAL_A1` — 正确、公认的通用 A1 德语知识。
   - 除这两类之外，**不承认任何第三来源**。不存在的 `PDF_VERIFIED` / `UNVERIFIED`、教材页码、教材 Unit 一律删除，代码与数据中不留任何字段。
2. **教材功能暂停。** 用户提供的三本 PDF 是**扫描版**，正文无法可靠解析，因此**不猜教材**、不标注教材页码、不声称内容对应某一课。「教材」入口只保留一句占位说明，等有真实课程进度后再做。
3. **不做扩张。** 不做 OCR、不做 A2/B1、不做账号系统、不做数据库、不做语音识别。V1 只把 A1 地基这件事做扎实。

## 2. 主导航

| 页面 | 作用 |
| --- | --- |
| **今天** | 今日建议时长（约 30 分钟）+ 今日项目统计 + `开始今天训练` + `我今天状态不好（15 分钟保底）` |
| **训练** | 主动回忆主战场：渐进撤提示（Stage 1→5）+ 三档自评（不会 / 想了一会儿 / 秒答） |
| **地基** | 26 个 A1 知识类别的真实掌握状态（不是教材目录，也不是完成百分比） |
| **查词** | 德语词卡：变位、名词冠词与复数、IPA、例句、发音、`加入复习` |
| **进度** | 掌握分布、薄弱项、明日优先复习、按来源统计真实掌握、最近训练 |

`设置` 作为次级入口放在右上角（语速、每日新内容上限、保底上限、清空数据）。

## 3. 技术栈

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**（移动端优先）
- 无后端、无账号、无数据库（V1）
- 持久化：`localStorage`（单个版本化 JSON，便于以后迁移 Postgres / Supabase / Neon）
- 德语发音：浏览器原生 `SpeechSynthesis`，**仅使用 `de-DE` 语音**
- 间隔复习：自研**简单透明**算法（见 §6），未引入 FSRS / SM-2

## 4. 本地运行

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建（必须 0 TypeScript 错误）
npm run start    # 生产服务
```

> 某些受限环境下 `npm` 会被 Win 子系统包装拦截，可直接用 Node 调用：
> `node node_modules/next/dist/bin/next build`

## 5. 目录结构

```
a1-deutsch-trainer/
├── src/
│   ├── app/                # 页面（App Router，均为客户端组件）
│   │   ├── layout.tsx      # 根布局：StoreProvider + TtsProvider
│   │   ├── page.tsx        # 今天
│   │   ├── train/          # 训练引擎
│   │   ├── foundation/     # 地基地图（26 类）
│   │   ├── dict/           # 查词
│   │   ├── progress/       # 进度
│   │   ├── settings/       # 设置
│   │   └── textbook/       # 教材（占位：暂未开放）
│   ├── components/         # AppFrame / BottomNav / TrainingCard / WordCard / ClickableGerman / Store+Tts Provider
│   ├── lib/                # types / review-engine / storage / tts / wiktionary / labels
│   └── data/               # content.ts（训练项）/ dictionary.ts（A1 词库）
```

**内容与 UI 严格分离**：所有德语训练内容在 `src/data/content.ts`，词库在 `src/data/dictionary.ts`，复习算法在 `src/lib/review-engine.ts`，绝不散落在组件里。

## 6. 数据模型（核心）

```ts
Provenance = "USER_CONFIRMED" | "GENERAL_A1"   // 只有两个来源

LearningItem {            // 训练内容（静态）
  id, contentKind, type, priority, skill,
  german, chinese, prompt?, answer?, hint?, grammar?, pronunciation?,
  foundationValue, examValue, difficulty, tags, foundation?,
  sourceType: Provenance, sourceNote?
  // 注意：没有 courseUnit / sourcePage / pageApprox
}

ReviewState {             // 运行时复习状态（持久化）
  itemId, mastery(NEW|LEARNING|WEAK|STABLE|MASTERED),
  lastReviewed, nextReview, reviewCount, successCount, failureCount,
  responseQuality, intervalIndex, stage, createdAt
}

ExamSkill { skill, attempts, recentPerformance, stability, weaknesses }
DailySession { date, mode("today"|"low"|"foundation"|"review"|"dict"),
               items[], completedItems, newItems, reviewItems, durationSec }
Store { version, reviewStates, examSkills, dailySessions, settings, customItems }
```

持久化统一写入 `a1dt:store:v1`；未来迁移数据库只改 `lib/storage.ts`。

## 7. 复习算法（简单、透明）

映射（产品规格 §11/§12）：

- **不会 (AGAIN)** → **当天再次出现**（`nextReview = now`、`intervalIndex = 0`、`mastery = WEAK`、`stage = 1`）
- **想了一会儿 (HARD)** → 短期复习（**次日**，`mastery → STABLE / WEAK`）
- **秒答 (EASY)** → 渐进间隔：**1 → 3 → 7 → 14 → 30 天**（`intervalIndex` 递增）

`mastery` 由 `intervalIndex` 推导：`>=5` 已掌握、`>=3` 稳定、`>=1` 学习、否则薄弱。
记忆阶段 `stage`（1–5）随掌握度提高而**逐步撤掉提示**：完整句 → 首词+空格 → 仅中文回忆 → 仅听问题。

## 8. 内容现状

| 来源 | 数量 | 说明 |
| --- | --- | --- |
| `USER_CONFIRMED` | 30 | 你明确提供 / 练习过的问候、姓名、来源、住址、语言、职业、学德语，以及 13 条对话（Anna/Marek、Leon/Hiromi/Keigo） |
| `GENERAL_A1` | 57 | 通用 A1 地基：人称代词、sein/haben 变位、数字、字母与发音、家庭、职业、否定、疑问句、语序等 |
| 合计 | **87** | 质量优先于数量；宁可少，也不编造教材内容 |

词库 `dictionary.ts` 收录 85 条常用 A1 词（含动词六人称变位、名词冠词与复数、标准 IPA）。

## 9. TTS

- 使用浏览器 `window.speechSynthesis`，只选取 `lang` 以 `de` 开头的语音，utterance 固定 `lang = "de-DE"`。
- **若设备没有德语语音**：明确提示用户去安装德语语音包，**绝不回退到英语语音冒充德语**（此时不发起朗读调用）。

## 10. 数据保存方式

- `localStorage`，键 `a1dt:store:v1`。刷新不丢、关闭重开不丢（同一浏览器同一设备）。
- **不会**跨设备同步（无账号、无后端）。
- 提供「清空全部学习数据」。

## 11. 当前限制（V1）

- 内容量为 87 条训练项 + 85 条词库，属于起步规模；后续按「来源可核查」的原则继续补充。
- 教材功能暂停；真实课程进度录入后再开放。
- 口语训练为「听 → 自己说 → 自评」，未接入语音识别（避免不稳定阻塞 V1）。
- 无后端、无账号、无云端同步。

## 12. 未来扩展位置

- 云端数据库（Postgres / Supabase / Neon）迁移（仅改 `lib/storage.ts`）。
- 真实模拟考试、分项成绩、错题本（架构已预留 `ExamSkill`）。
- 母语者真人音频替换 TTS；实验性德语语音识别。
- 教材功能在**拿到可核对的真实课程进度之后**再重启。

---

## REUSED OPEN SOURCE（复用清单）

| 项目 / 库 | 地址 | License | 复用了什么 | 为什么选它 |
| --- | --- | --- | --- | --- |
| **Next.js** | https://github.com/vercel/next.js | MIT | 应用框架 / 路由 / 构建 | 规格指定优先；App Router 静态导出足够，无需后端 |
| **React** | https://github.com/facebook/react | MIT | UI 框架 | 生态成熟，组件化清晰 |
| **Tailwind CSS** | https://github.com/tailwindlabs/tailwindcss | MIT | 样式系统 | 移动端优先、克制配色，符合成人安静可靠的设计 |
| **浏览器 SpeechSynthesis** | Web 标准 | — | 德语 TTS | 原生能力，零依赖、零成本；只用 de-DE 语音 |
| **TypeScript** | https://github.com/microsoft/TypeScript | Apache-2.0 | 类型安全 | 数据模型复杂，类型即文档 |

> 评估过但未引入：`ts-fsrs` / SM-2 —— 规格要求 V1 用简单透明算法，引入 FSRS 属过度工程。
> 评估过但未引入：`pdfjs-dist` —— 仅服务于已暂停的教材功能，为保持「不做扩张」已从依赖中移除。
> 评估过但未直接 Fork 的完整项目：Linguardian / Baustein / Netzwerk A1 / sehen-sah-gesehen
> （各自携带 OAuth/Mongo/Supabase/游戏化/不同教材等不匹配基建，改造比自建聚焦应用更复杂）。

## CUSTOM BUILT（自研清单）

| 功能 | 为什么必须自研 |
| --- | --- |
| `lib/review-engine.ts` 简单间隔算法 | 规格明确要求 V1 用透明、可解释的 1/3/7/14/30 天阶梯，而非黑盒 FSRS |
| `src/data/content.ts` 双来源训练内容 | 教材为扫描 PDF 无法自动解析，因此只保留「用户确认」与「通用 A1」两类可核查来源 |
| 渐进撤提示 + 三档自评训练引擎 | 产品核心交互（主动回忆、撤提示），无现成库直接匹配 |
| `src/data/dictionary.ts` A1 词库与变位识别 | 需要「输入 wohnst 反查 wohnen 的 du 变位」这类面向中文零基础学习者的特定行为 |
| `lib/storage.ts` 版本化 localStorage 封装 | 需要便于未来迁移云端的统一读写层 |

CUSTOM BUILT 保持最小，仅覆盖现成方案无法直接满足的产品核心逻辑。
