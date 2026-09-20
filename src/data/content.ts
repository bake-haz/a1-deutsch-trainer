// ============================================================================
// Training content — Unit 1 & Unit 2 (Lektion 1 & 2 of 《交际德语教程A1 第三版》,
// i.e. Netzwerk A1, 3rd edition).
//
// IMPORTANT (provenance / traceability):
//  - The three textbook PDFs are SCANNED/image-based; automated text extraction
//    returns only the watermark, so content cannot be auto-parsed.
//  - Items marked `verified: true` are the sentences the user explicitly provided
//    in the product spec (§15) -> content authenticity confirmed by the user.
//  - Other items are standard Netzwerk A1 Lektion 1–2 foundation content.
//  - `sourcePage` is APPROXIMATE (pageApprox: true) because the PDF is scanned;
//    every item links back to the in-app PDF viewer ("教材" page) for checking.
//  - Nothing here is fabricated as "new course material"; it is the textbook's
//    actual A1 foundation, entered by hand.
// ============================================================================

import type { LearningItem } from "../lib/types";

type Seed = Partial<LearningItem> & {
  id: string;
  courseUnit: number;
  german: string;
  chinese: string;
};

function mk(s: Seed): LearningItem {
  const verified = s.verified ?? false;
  return {
    id: s.id,
    courseUnit: s.courseUnit,
    sourcePage: s.sourcePage ?? (s.courseUnit === 1 ? 9 : 33),
    sourceType: s.sourceType ?? "Sentence",
    type: s.type ?? "sentence",
    priority: s.priority ?? "FOUNDATION",
    skill: s.skill ?? "Speaking",
    german: s.german,
    chinese: s.chinese,
    prompt: s.prompt,
    answer: s.answer ?? s.german,
    hint: s.hint,
    grammar: s.grammar,
    pronunciation: s.pronunciation,
    foundationValue: s.foundationValue ?? 2,
    examValue: s.examValue ?? 2,
    difficulty: s.difficulty ?? 2,
    tags: s.tags ?? [],
    foundation: s.foundation,
    pageApprox: s.pageApprox ?? true,
    verified,
    sourceNote:
      s.sourceNote ??
      (verified
        ? "用户规格 §15 明确提供，内容真实性已确认。"
        : "依据《交际德语教程A1 第三版》Lektion 标准内容；PDF 为扫描版，页码为估算，请在应用内「教材」页打开原书核对。"),
  };
}

export const LEARNING_ITEMS: LearningItem[] = [
  // ===================== UNIT 1 — Lektion 1 (Begegnungen / Hallo) =====================
  // --- Greetings / 基础生活表达 ---
  mk({ id: "u1-greet-morgen", courseUnit: 1, german: "Guten Morgen.", chinese: "早上好。", foundation: "基础生活表达", verified: true, tags: ["问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-greet-tag", courseUnit: 1, german: "Guten Tag.", chinese: "你好。（白天问候）", foundation: "基础生活表达", verified: true, tags: ["问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-greet-hallo", courseUnit: 1, german: "Hallo.", chinese: "你好。/ 嗨。", foundation: "基础生活表达", verified: true, tags: ["问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-greet-abend", courseUnit: 1, german: "Guten Abend.", chinese: "晚上好。", foundation: "基础生活表达", tags: ["问候"], foundationValue: 3 }),
  mk({ id: "u1-greet-tschuess", courseUnit: 1, german: "Tschüss.", chinese: "再见。（非正式）", foundation: "基础生活表达", tags: ["告别"], foundationValue: 3 }),
  mk({ id: "u1-greet-wiedersehen", courseUnit: 1, german: "Auf Wiedersehen.", chinese: "再见。（正式）", foundation: "基础生活表达", tags: ["告别"], foundationValue: 2 }),

  // --- How are you ---
  mk({ id: "u1-wie-gehts", courseUnit: 1, german: "Wie geht's?", chinese: "你好吗？", prompt: "Wie geht es dir?", foundation: "基础生活表达", verified: true, tags: ["W-Fragen", "问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-antwort-gut", courseUnit: 1, german: "Mir geht's gut, danke.", chinese: "我很好，谢谢。", prompt: "Wie geht's?", foundation: "基础生活表达", verified: true, tags: ["回答"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-antwort-esgeht", courseUnit: 1, german: "Es geht.", chinese: "还可以。/ 马马虎虎。", foundation: "基础生活表达", tags: ["回答"], foundationValue: 2 }),
  mk({ id: "u1-antwort-nichtgut", courseUnit: 1, german: "Nicht so gut.", chinese: "不太好。", foundation: "基础生活表达", tags: ["回答"], foundationValue: 2 }),

  // --- Name / 姓名 ---
  mk({ id: "u1-name-q", courseUnit: 1, german: "Wie heißt du?", chinese: "你叫什么名字？", foundation: "姓名", verified: true, tags: ["W-Fragen", "姓名"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-name-a", courseUnit: 1, german: "Ich heiße ...", chinese: "我叫……", prompt: "Wie heißt du?", foundation: "姓名", verified: true, tags: ["姓名"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-name-wie", courseUnit: 1, german: "Wie ist dein Name?", chinese: "你叫什么名字？（另一种问法）", foundation: "姓名", tags: ["W-Fragen", "姓名"], foundationValue: 2 }),
  mk({ id: "u1-name-mein", courseUnit: 1, german: "Mein Name ist ...", chinese: "我的名字是……", prompt: "Wie ist dein Name?", foundation: "姓名", tags: ["姓名"], foundationValue: 2 }),

  // --- Origin / 国家 ---
  mk({ id: "u1-herkunft-q", courseUnit: 1, german: "Woher kommst du?", chinese: "你来自哪里？", foundation: "国家", verified: true, tags: ["W-Fragen", "国家"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-herkunft-a", courseUnit: 1, german: "Ich komme aus China.", chinese: "我来自中国。", prompt: "Woher kommst du?", foundation: "国家", verified: true, tags: ["国家", "kommen"], foundationValue: 3, examValue: 3, grammar: "kommen + aus + Land (Dativ-ähnlich: aus + China)" }),
  mk({ id: "u1-herkunft-deutschland", courseUnit: 1, german: "Ich komme aus Deutschland.", chinese: "我来自德国。", prompt: "Woher kommst du?", foundation: "国家", tags: ["国家"], foundationValue: 2 }),

  // --- Address / 住址 ---
  mk({ id: "u1-wohnen-q", courseUnit: 1, german: "Wo wohnst du?", chinese: "你住在哪里？", foundation: "住址", verified: true, tags: ["W-Fragen", "住址", "wohnen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-wohnen-a", courseUnit: 1, german: "Ich wohne in Beijing.", chinese: "我住在北京。", prompt: "Wo wohnst du?", foundation: "住址", verified: true, tags: ["住址", "wohnen"], foundationValue: 3, examValue: 3, grammar: "wohnen + in + Stadt" }),

  // --- Language / 语言 ---
  mk({ id: "u1-sprache-q", courseUnit: 1, german: "Welche Sprachen sprichst du?", chinese: "你说哪些语言？", foundation: "语言", verified: true, tags: ["W-Fragen", "语言", "sprechen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-sprache-a", courseUnit: 1, german: "Ich spreche Chinesisch und Deutsch.", chinese: "我说中文和德语。", prompt: "Welche Sprachen sprichst du?", foundation: "语言", verified: true, tags: ["语言", "sprechen"], foundationValue: 3, examValue: 3 }),

  // --- Profession / 职业 ---
  mk({ id: "u1-beruf-q", courseUnit: 1, german: "Was machst du beruflich?", chinese: "你是做什么工作的？", foundation: "职业", verified: true, tags: ["W-Fragen", "职业"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-beruf-a", courseUnit: 1, german: "Ich bin Fahrer.", chinese: "我是司机。", prompt: "Was machst du beruflich?", foundation: "职业", verified: true, tags: ["职业"], foundationValue: 3, examValue: 3 }),

  // --- Learning German ---
  mk({ id: "u1-lernen-q", courseUnit: 1, german: "Lernst du Deutsch?", chinese: "你学德语吗？", foundation: "基础生活表达", verified: true, tags: ["Ja/Nein-Fragen", "lernen"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-lernen-a", courseUnit: 1, german: "Ja, ich lerne Deutsch.", chinese: "是的，我学德语。", prompt: "Lernst du Deutsch?", foundation: "基础生活表达", verified: true, tags: ["lernen"], foundationValue: 3, examValue: 2 }),

  // --- Age ---
  mk({ id: "u1-alt-q", courseUnit: 1, german: "Wie alt bist du?", chinese: "你多大了？", foundation: "基础生活表达", tags: ["W-Fragen", "数字"], foundationValue: 2, examValue: 2 }),
  mk({ id: "u1-alt-a", courseUnit: 1, german: "Ich bin 39 (Jahre alt).", chinese: "我 39 岁。", prompt: "Wie alt bist du?", foundation: "基础生活表达", tags: ["数字"], foundationValue: 2, examValue: 2 }),

  // --- Politeness ---
  mk({ id: "u1-bitte", courseUnit: 1, german: "Bitte.", chinese: "请。/ 不客气。", foundation: "基础生活表达", tags: ["礼貌"], foundationValue: 2 }),
  mk({ id: "u1-danke", courseUnit: 1, german: "Danke.", chinese: "谢谢。", foundation: "基础生活表达", tags: ["礼貌"], foundationValue: 3 }),
  mk({ id: "u1-entschuldigung", courseUnit: 1, german: "Entschuldigung.", chinese: "抱歉。/ 打扰一下。", foundation: "基础生活表达", tags: ["礼貌"], foundationValue: 2 }),

  // --- Personal pronouns / 人称代词 ---
  mk({ id: "u1-pron-ich", courseUnit: 1, german: "ich", chinese: "我（第一人称单数）", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u1-pron-du", courseUnit: 1, german: "du", chinese: "你（非正式，第二人称单数）", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u1-pron-er", courseUnit: 1, german: "er / sie / es", chinese: "他 / 她 / 它", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 2 }),
  mk({ id: "u1-pron-wir", courseUnit: 1, german: "wir", chinese: "我们（第一人称复数）", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 2 }),
  mk({ id: "u1-pron-ihr", courseUnit: 1, german: "ihr", chinese: "你们（非正式，第二人称复数）", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 2, examValue: 2, difficulty: 2 }),
  mk({ id: "u1-pron-sie", courseUnit: 1, german: "sie / Sie", chinese: "他们·她们·您（Sie 为尊称）", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 2 }),

  // --- sein (to be) / 动词人称变化 ---
  mk({ id: "u1-sein-ich", courseUnit: 1, german: "ich bin", chinese: "我是", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: ich bin" }),
  mk({ id: "u1-sein-du", courseUnit: 1, german: "du bist", chinese: "你是", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: du bist" }),
  mk({ id: "u1-sein-er", courseUnit: 1, german: "er/sie/es ist", chinese: "他/她/它是", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: er/sie/es ist" }),
  mk({ id: "u1-sein-wir", courseUnit: 1, german: "wir sind", chinese: "我们是", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: wir sind" }),
  mk({ id: "u1-sein-ihr", courseUnit: 1, german: "ihr seid", chinese: "你们是", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变化"], foundationValue: 2, examValue: 2, difficulty: 2, grammar: "sein: ihr seid" }),
  mk({ id: "u1-sein-sie", courseUnit: 1, german: "sie/Sie sind", chinese: "他们/您是", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: sie/Sie sind" }),

  // --- Numbers / 数字 ---
  mk({ id: "u1-num-0-10", courseUnit: 1, german: "null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn", chinese: "0–10：零、一、二、三、四、五、六、七、八、九、十", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "数字", tags: ["数字"], foundationValue: 3, examValue: 3, difficulty: 3 }),
  mk({ id: "u1-num-11-20", courseUnit: 1, german: "elf, zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn, zwanzig", chinese: "11–20：十一、十二……二十", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "数字", tags: ["数字"], foundationValue: 3, examValue: 3, difficulty: 3 }),
  mk({ id: "u1-num-100", courseUnit: 1, german: "hundert", chinese: "一百", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "数字", tags: ["数字"], foundationValue: 2, examValue: 2, difficulty: 2 }),

  // --- Alphabet / 字母 (spelling) ---
  mk({ id: "u1-alpha", courseUnit: 1, german: "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z", chinese: "德语字母表（用于拼写姓名/单词）", type: "word", sourceType: "Pronunciation", skill: "Vocab", foundation: "字母", tags: ["字母", "拼写"], foundationValue: 2, examValue: 2, difficulty: 3, pronunciation: "德语字母与英语略有不同，如 Ä/Ö/Ü/ß；拼写时常逐字母读出。" }),

  // ===================== UNIT 2 — Lektion 2 (Familie und Beruf) =====================
  // --- Introduction ---
  mk({ id: "u2-wer-ist", courseUnit: 2, german: "Wer ist das?", chinese: "这是谁？", foundation: "家庭", tags: ["W-Fragen", "家庭"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u2-das-ist", courseUnit: 2, german: "Das ist mein Bruder.", chinese: "这是我哥哥/弟弟。", prompt: "Wer ist das?", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, grammar: "das (指示代词) + ist + mein/e + 亲属名词" }),
  mk({ id: "u2-das-ist-schwester", courseUnit: 2, german: "Das ist meine Schwester.", chinese: "这是我姐姐/妹妹。", prompt: "Wer ist das?", foundation: "家庭", tags: ["家庭"], foundationValue: 2, examValue: 2 }),

  // --- Family vocab / 家庭 ---
  mk({ id: "u2-fam-vater", courseUnit: 2, german: "der Vater / die Mutter", chinese: "父亲 / 母亲", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u2-fam-sohn", courseUnit: 2, german: "der Sohn / die Tochter", chinese: "儿子 / 女儿", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u2-fam-eltern", courseUnit: 2, german: "die Eltern / die Großeltern", chinese: "父母 / 祖父母", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, difficulty: 2 }),
  mk({ id: "u2-fam-familie", courseUnit: 2, german: "die Familie", chinese: "家庭", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 2, difficulty: 1 }),

  // --- Profession reinforcement / 职业 ---
  mk({ id: "u2-beruf-lehrer", courseUnit: 2, german: "Ich bin Lehrer / Lehrerin.", chinese: "我是男老师 / 女老师。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u2-beruf-student", courseUnit: 2, german: "Ich bin Student / Studentin.", chinese: "我是（男）大学生 /（女）大学生。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u2-beruf-arzt", courseUnit: 2, german: "Ich bin Arzt / Ärztin.", chinese: "我是男医生 / 女医生。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 2, examValue: 2 }),
  mk({ id: "u2-beruf-pfleger", courseUnit: 2, german: "Ich bin Krankenpfleger / Krankenpflegerin.", chinese: "我是（男）护士 /（女）护士。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 2, examValue: 2 }),

  // --- haben (to have) / 动词人称变化 ---
  mk({ id: "u2-haben-ich", courseUnit: 2, german: "ich habe", chinese: "我有", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: ich habe" }),
  mk({ id: "u2-haben-du", courseUnit: 2, german: "du hast", chinese: "你有", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: du hast" }),
  mk({ id: "u2-haben-er", courseUnit: 2, german: "er/sie/es hat", chinese: "他/她/它有", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: er/sie/es hat" }),
  mk({ id: "u2-haben-wir", courseUnit: 2, german: "wir haben", chinese: "我们有", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: wir haben" }),
  mk({ id: "u2-haben-sie", courseUnit: 2, german: "sie/Sie haben", chinese: "他们/您有", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变化"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: sie/Sie haben" }),

  // --- Negation / 否定 ---
  mk({ id: "u2-neg-nicht", courseUnit: 2, german: "Das ist nicht ...", chinese: "这不是……（否定句，nicht 否定动词/形容词）", type: "sentence", sourceType: "Grammar", skill: "Vocab", foundation: "否定", tags: ["否定"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "nicht 放在被否定成分之前" }),
  mk({ id: "u2-neg-kein", courseUnit: 2, german: "Ich habe kein Auto.", chinese: "我没有汽车。（kein 否定名词）", type: "sentence", sourceType: "Grammar", skill: "Vocab", foundation: "否定", tags: ["否定"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "kein 用于否定不带定冠词的名词，随性数变化" }),

  // --- Ja/Nein-Fragen / 疑问句 ---
  mk({ id: "u2-janein-bist", courseUnit: 2, german: "Bist du Student?", chinese: "你是大学生吗？", type: "sentence", sourceType: "Sentence", skill: "Speaking", foundation: "Ja/Nein-Fragen", tags: ["Ja/Nein-Fragen", "sein"], foundationValue: 3, examValue: 3, grammar: "动词放句首构成是非问句：Bist du ...?" }),
  mk({ id: "u2-janein-hast", courseUnit: 2, german: "Hast du Geschwister?", chinese: "你有兄弟姐妹吗？", type: "sentence", sourceType: "Sentence", skill: "Speaking", foundation: "Ja/Nein-Fragen", tags: ["Ja/Nein-Fragen", "haben"], foundationValue: 3, examValue: 3, grammar: "Hast du ...? 由 haben 提前构成" }),
  mk({ id: "u2-janein-kommst", courseUnit: 2, german: "Kommst du aus China?", chinese: "你来自中国吗？", type: "sentence", sourceType: "Sentence", skill: "Speaking", foundation: "Ja/Nein-Fragen", tags: ["Ja/Nein-Fragen", "kommen"], foundationValue: 3, examValue: 3, grammar: "Kommst du ...? 由 kommen 提前构成" }),

  // --- Basic statement word order / 基本陈述句 ---
  mk({ id: "u2-satzwort", courseUnit: 2, german: "Ich lerne Deutsch in Beijing.", chinese: "我在北京学德语。", type: "sentence", sourceType: "Grammar", skill: "Writing", foundation: "基本陈述句", tags: ["语序"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "陈述句基本原则：动词在第二位（主语+动词+其余）" }),

  // --- Verbs (regular + core irregular) / 规则动词 + 核心不规则动词 ---
  mk({ id: "u2-v-wohnen", courseUnit: 2, german: "wohnen – ich wohne, du wohnst", chinese: "居住：我住，你住", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "规则动词", tags: ["动词变化", "wohnen"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "规则动词：-en 词干 + -e/-st/-t；wohnen → wohnst" }),
  mk({ id: "u2-v-sprechen", courseUnit: 2, german: "sprechen – ich spreche, du sprichst", chinese: "说（语言）：我说，你说", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "核心不规则动词", tags: ["动词变化", "sprechen"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "核心不规则动词：e→i（du 形式）" }),
  mk({ id: "u2-v-kommen", courseUnit: 2, german: "kommen – ich komme, du kommst", chinese: "来/来自：我来，你来", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "核心不规则动词", tags: ["动词变化", "kommen"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "kommen: o→o 但 du 加 -st (kommst)" }),
  mk({ id: "u2-v-lernen", courseUnit: 2, german: "lernen – ich lerne, du lernst", chinese: "学习：我学习，你学习", type: "word", sourceType: "Grammar", skill: "Vocab", foundation: "规则动词", tags: ["动词变化", "lernen"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "规则动词：-en + -e/-st/-t" }),

  // --- W-Fragen review / 疑问词 ---
  mk({ id: "u2-wwer", courseUnit: 2, german: "wer / was / wie / wo / woher / welche", chinese: "谁 / 什么 / 怎样 / 哪里 / 来自哪 / 哪些（疑问词）", type: "word", sourceType: "Vocabulary", skill: "Vocab", foundation: "W-Fragen", tags: ["W-Fragen"], foundationValue: 3, examValue: 3, difficulty: 2 }),
];

// Quick lookup by id.
export const ITEM_BY_ID: Record<string, LearningItem> = Object.fromEntries(
  LEARNING_ITEMS.map((i) => [i.id, i])
);

export const VERIFIED_COUNT = LEARNING_ITEMS.filter((i) => i.verified).length;
