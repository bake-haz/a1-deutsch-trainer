// ============================================================================
// Training content — CLEANED (V1 rectification §2).
//
// Only TWO sources are allowed:
//   USER_CONFIRMED : the learner explicitly provided / practised this content.
//   GENERAL_A1     : correct, well-known general A1 German knowledge.
//
// There is NO textbook page, NO textbook unit and NO "PDF_VERIFIED" claim
// anywhere: the provided PDFs are scanned and cannot be mapped reliably, so the
// app does not pretend to know where content sits in them.
// ============================================================================

import type { LearningItem, Provenance } from "../lib/types";

type Seed = Partial<LearningItem> & {
  id: string;
  german: string;
  chinese: string;
};

const DEFAULT_NOTE: Record<Provenance, string> = {
  USER_CONFIRMED: "你在项目开始前明确提供 / 练习过的内容，真实性已确认。",
  GENERAL_A1: "标准 A1 通用知识，用于打地基；并非来自教材，也不标注教材位置。",
};

function mk(s: Seed): LearningItem {
  const src: Provenance = s.sourceType ?? "GENERAL_A1";
  return {
    id: s.id,
    contentKind: s.contentKind ?? "Sentence",
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
    sourceType: src,
    sourceNote: s.sourceNote ?? DEFAULT_NOTE[src],
  };
}

export const LEARNING_ITEMS: LearningItem[] = [
  // ==========================================================================
  // 你的课程内容 (USER_CONFIRMED) — 问候 / 姓名 / 来源 / 住址 / 语言 / 职业 / 学德语
  // ==========================================================================
  mk({ id: "u1-greet-morgen", german: "Guten Morgen.", chinese: "早上好。", foundation: "基础生活表达", sourceType: "USER_CONFIRMED", tags: ["问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-greet-tag", german: "Guten Tag.", chinese: "你好。（白天问候）", foundation: "基础生活表达", sourceType: "USER_CONFIRMED", tags: ["问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-greet-hallo", german: "Hallo.", chinese: "你好。/ 嗨。", foundation: "基础生活表达", sourceType: "USER_CONFIRMED", tags: ["问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-wie-gehts", german: "Wie geht's?", chinese: "你好吗？", prompt: "Wie geht es dir?", foundation: "基础生活表达", sourceType: "USER_CONFIRMED", tags: ["W-Fragen", "问候"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-antwort-gut", german: "Mir geht's gut, danke.", chinese: "我很好，谢谢。", prompt: "Wie geht's?", foundation: "基础生活表达", sourceType: "USER_CONFIRMED", tags: ["回答"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-name-q", german: "Wie heißt du?", chinese: "你叫什么名字？", foundation: "heißen", sourceType: "USER_CONFIRMED", tags: ["W-Fragen", "姓名", "heißen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-name-a", german: "Ich heiße ...", chinese: "我叫……", prompt: "Wie heißt du?", foundation: "heißen", sourceType: "USER_CONFIRMED", tags: ["姓名", "heißen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-herkunft-q", german: "Woher kommst du?", chinese: "你来自哪里？", foundation: "kommen", sourceType: "USER_CONFIRMED", tags: ["W-Fragen", "国家", "kommen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-herkunft-a", german: "Ich komme aus China.", chinese: "我来自中国。", prompt: "Woher kommst du?", foundation: "kommen", sourceType: "USER_CONFIRMED", tags: ["国家", "kommen"], foundationValue: 3, examValue: 3, grammar: "kommen + aus + Land" }),
  mk({ id: "u1-wohnen-q", german: "Wo wohnst du?", chinese: "你住在哪里？", foundation: "wohnen", sourceType: "USER_CONFIRMED", tags: ["W-Fragen", "住址", "wohnen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-wohnen-a", german: "Ich wohne in ...", chinese: "我住在……", prompt: "Wo wohnst du?", foundation: "wohnen", sourceType: "USER_CONFIRMED", tags: ["住址", "wohnen"], foundationValue: 3, examValue: 3, grammar: "wohnen + in + Stadt" }),
  mk({ id: "u1-sprache-q", german: "Welche Sprachen sprichst du?", chinese: "你说哪些语言？", foundation: "sprechen", sourceType: "USER_CONFIRMED", tags: ["W-Fragen", "语言", "sprechen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-sprache-a", german: "Ich spreche Chinesisch und ...", chinese: "我说中文和……", prompt: "Welche Sprachen sprichst du?", foundation: "sprechen", sourceType: "USER_CONFIRMED", tags: ["语言", "sprechen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-beruf-q", german: "Was machst du beruflich?", chinese: "你是做什么工作的？", foundation: "machen", sourceType: "USER_CONFIRMED", tags: ["W-Fragen", "职业", "machen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-beruf-a", german: "Ich bin Fahrer.", chinese: "我是司机。", prompt: "Was machst du beruflich?", foundation: "职业", sourceType: "USER_CONFIRMED", tags: ["职业"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u1-lernen-q", german: "Lernst du Deutsch?", chinese: "你学德语吗？", foundation: "lernen", sourceType: "USER_CONFIRMED", tags: ["Ja/Nein-Fragen", "lernen"], foundationValue: 3, examValue: 2 }),
  mk({ id: "u1-lernen-a", german: "Ja, ich lerne Deutsch.", chinese: "是的，我学德语。", prompt: "Lernst du Deutsch?", foundation: "lernen", sourceType: "USER_CONFIRMED", tags: ["lernen"], foundationValue: 3, examValue: 2 }),

  // 你明确提供过的教材对话 (USER_CONFIRMED)
  mk({ id: "dlg1-1", german: "Guten Tag. Ich bin Anna. Und wer bist du?", chinese: "你好。我是 Anna。你是谁？", type: "dialogue", contentKind: "Dialogue", foundation: "姓名", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 3, examValue: 3 }),
  mk({ id: "dlg1-2", german: "Hallo, Anna. Ich heiße Marek.", chinese: "你好，Anna。我叫 Marek。", type: "dialogue", contentKind: "Dialogue", foundation: "heißen", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 3, examValue: 3 }),
  mk({ id: "dlg1-3", german: "Ich komme aus Gdańsk.", chinese: "我来自 Gdańsk（格但斯克）。", type: "dialogue", contentKind: "Dialogue", foundation: "kommen", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 2, examValue: 2 }),
  mk({ id: "dlg1-4", german: "Das ist in Polen.", chinese: "那在波兰。", type: "dialogue", contentKind: "Dialogue", foundation: "国家", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 2, examValue: 2 }),
  mk({ id: "dlg1-5", german: "Oh, aus Gdańsk.", chinese: "哦，来自 Gdańsk。", type: "dialogue", contentKind: "Dialogue", foundation: "国家", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 1, examValue: 1 }),
  mk({ id: "dlg1-6", german: "Ja, ich bin im Deutschkurs.", chinese: "是的，我在德语课上。", type: "dialogue", contentKind: "Dialogue", foundation: "基础生活表达", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 3, examValue: 2 }),
  mk({ id: "dlg1-7", german: "Lernst du auch Deutsch?", chinese: "你也学德语吗？", type: "dialogue", contentKind: "Dialogue", foundation: "lernen", sourceType: "USER_CONFIRMED", tags: ["对话", "Anna-Marek"], foundationValue: 3, examValue: 2 }),
  mk({ id: "dlg2-1", german: "Hallo, ich bin Leon.", chinese: "你好，我是 Leon。", type: "dialogue", contentKind: "Dialogue", foundation: "姓名", sourceType: "USER_CONFIRMED", tags: ["对话", "Leon-Hiromi"], foundationValue: 3, examValue: 3 }),
  mk({ id: "dlg2-2", german: "Hallo, Leon. Ich bin Hiromi und das ist Keigo.", chinese: "你好，Leon。我是 Hiromi，这位是 Keigo。", type: "dialogue", contentKind: "Dialogue", foundation: "姓名", sourceType: "USER_CONFIRMED", tags: ["对话", "Leon-Hiromi"], foundationValue: 3, examValue: 3 }),
  mk({ id: "dlg2-3", german: "Kommt ihr aus Japan?", chinese: "你们来自日本吗？", type: "dialogue", contentKind: "Dialogue", foundation: "kommen", sourceType: "USER_CONFIRMED", tags: ["对话", "Leon-Hiromi", "Ja/Nein-Fragen"], foundationValue: 3, examValue: 3 }),
  mk({ id: "dlg2-4", german: "Nein, aus den USA.", chinese: "不，来自美国。", type: "dialogue", contentKind: "Dialogue", foundation: "国家", sourceType: "USER_CONFIRMED", tags: ["对话", "Leon-Hiromi"], foundationValue: 3, examValue: 3 }),
  mk({ id: "dlg2-5", german: "Aha, aus den USA.", chinese: "啊，来自美国。", type: "dialogue", contentKind: "Dialogue", foundation: "国家", sourceType: "USER_CONFIRMED", tags: ["对话", "Leon-Hiromi"], foundationValue: 1, examValue: 1 }),
  mk({ id: "dlg2-6", german: "Welche Sprachen sprecht ihr?", chinese: "你们说哪些语言？", type: "dialogue", contentKind: "Dialogue", foundation: "sprechen", sourceType: "USER_CONFIRMED", tags: ["对话", "Leon-Hiromi", "W-Fragen"], foundationValue: 3, examValue: 3 }),

  // ==========================================================================
  // 通用 A1 地基 (GENERAL_A1)
  // ==========================================================================
  mk({ id: "u1-greet-abend", german: "Guten Abend.", chinese: "晚上好。", foundation: "基础生活表达", tags: ["问候"], foundationValue: 3 }),
  mk({ id: "u1-greet-tschuess", german: "Tschüss.", chinese: "再见。（非正式）", foundation: "基础生活表达", tags: ["告别"], foundationValue: 3 }),
  mk({ id: "u1-greet-wiedersehen", german: "Auf Wiedersehen.", chinese: "再见。（正式）", foundation: "基础生活表达", tags: ["告别"], foundationValue: 2 }),
  mk({ id: "u1-antwort-esgeht", german: "Es geht.", chinese: "还可以。/ 马马虎虎。", foundation: "基础生活表达", tags: ["回答"], foundationValue: 2 }),
  mk({ id: "u1-antwort-nichtgut", german: "Nicht so gut.", chinese: "不太好。", foundation: "基础生活表达", tags: ["回答"], foundationValue: 2 }),
  mk({ id: "u1-name-wie", german: "Wie ist dein Name?", chinese: "你叫什么名字？（另一种问法）", foundation: "姓名", tags: ["W-Fragen", "姓名"], foundationValue: 2 }),
  mk({ id: "u1-name-mein", german: "Mein Name ist ...", chinese: "我的名字是……", prompt: "Wie ist dein Name?", foundation: "姓名", tags: ["姓名"], foundationValue: 2 }),
  mk({ id: "u1-herkunft-deutschland", german: "Ich komme aus Deutschland.", chinese: "我来自德国。", prompt: "Woher kommst du?", foundation: "kommen", tags: ["国家", "kommen"], foundationValue: 2 }),
  mk({ id: "u1-alt-q", german: "Wie alt bist du?", chinese: "你多大了？", foundation: "数字", tags: ["W-Fragen", "数字"], foundationValue: 2, examValue: 2 }),
  mk({ id: "u1-alt-a", german: "Ich bin 39 (Jahre alt).", chinese: "我 39 岁。", prompt: "Wie alt bist du?", foundation: "数字", tags: ["数字"], foundationValue: 2, examValue: 2 }),
  mk({ id: "u1-bitte", german: "Bitte.", chinese: "请。/ 不客气。", foundation: "基础生活表达", tags: ["礼貌"], foundationValue: 2 }),
  mk({ id: "u1-danke", german: "Danke.", chinese: "谢谢。", foundation: "基础生活表达", tags: ["礼貌"], foundationValue: 3 }),
  mk({ id: "u1-entschuldigung", german: "Entschuldigung.", chinese: "抱歉。/ 打扰一下。", foundation: "基础生活表达", tags: ["礼貌"], foundationValue: 2 }),

  // 人称代词
  mk({ id: "u1-pron-ich", german: "ich", chinese: "我（第一人称单数）", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u1-pron-du", german: "du", chinese: "你（非正式，第二人称单数）", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u1-pron-er", german: "er / sie / es", chinese: "他 / 她 / 它", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 2 }),
  mk({ id: "u1-pron-wir", german: "wir", chinese: "我们（第一人称复数）", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 2 }),
  mk({ id: "u1-pron-ihr", german: "ihr", chinese: "你们（非正式，第二人称复数）", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 2, examValue: 2, difficulty: 2 }),
  mk({ id: "u1-pron-sie", german: "sie / Sie", chinese: "他们·她们·您（Sie 为尊称）", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "人称代词", tags: ["代词"], foundationValue: 3, examValue: 3, difficulty: 2 }),

  // sein
  mk({ id: "u1-sein-ich", german: "ich bin", chinese: "我是", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: ich bin" }),
  mk({ id: "u1-sein-du", german: "du bist", chinese: "你是", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: du bist" }),
  mk({ id: "u1-sein-er", german: "er/sie/es ist", chinese: "他/她/它是", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: er/sie/es ist" }),
  mk({ id: "u1-sein-wir", german: "wir sind", chinese: "我们是", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: wir sind" }),
  mk({ id: "u1-sein-ihr", german: "ihr seid", chinese: "你们是", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变位"], foundationValue: 2, examValue: 2, difficulty: 2, grammar: "sein: ihr seid" }),
  mk({ id: "u1-sein-sie", german: "sie/Sie sind", chinese: "他们/您是", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sein", tags: ["sein", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "sein: sie/Sie sind" }),

  // 数字 / 字母
  mk({ id: "u1-num-0-10", german: "null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn", chinese: "0–10：零、一、二、三、四、五、六、七、八、九、十", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "数字", tags: ["数字"], foundationValue: 3, examValue: 3, difficulty: 3 }),
  mk({ id: "u1-num-11-20", german: "elf, zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn, zwanzig", chinese: "11–20：十一、十二……二十", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "数字", tags: ["数字"], foundationValue: 3, examValue: 3, difficulty: 3 }),
  mk({ id: "u1-num-100", german: "hundert", chinese: "一百", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "数字", tags: ["数字"], foundationValue: 2, examValue: 2, difficulty: 2 }),
  mk({ id: "u1-alpha", german: "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z", chinese: "德语字母表（用于拼写姓名/单词）", type: "word", contentKind: "Pronunciation", skill: "Vocab", foundation: "字母", tags: ["字母", "拼写"], foundationValue: 2, examValue: 2, difficulty: 3, pronunciation: "德语字母与英语略有不同，如 Ä/Ö/Ü/ß；拼写时常逐字母读出。" }),
  mk({ id: "u1-sound-aeoeue", german: "ä / ö / ü / ß", chinese: "德语特殊字母与基本发音：ä、ö、ü、ß", type: "word", contentKind: "Pronunciation", skill: "Vocab", foundation: "发音规则", tags: ["发音", "字母"], foundationValue: 3, examValue: 2, difficulty: 2, pronunciation: "ä≈[ɛ]、ö≈[ø]、ü≈[y]、ß=[s]（长音）。" }),

  // 家庭 / 职业
  mk({ id: "u2-wer-ist", german: "Wer ist das?", chinese: "这是谁？", foundation: "家庭", tags: ["W-Fragen", "家庭"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u2-das-ist", german: "Das ist mein Bruder.", chinese: "这是我哥哥/弟弟。", prompt: "Wer ist das?", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, grammar: "das (指示代词) + ist + mein/e + 亲属名词" }),
  mk({ id: "u2-das-ist-schwester", german: "Das ist meine Schwester.", chinese: "这是我姐姐/妹妹。", prompt: "Wer ist das?", foundation: "家庭", tags: ["家庭"], foundationValue: 2, examValue: 2 }),
  mk({ id: "u2-fam-vater", german: "der Vater / die Mutter", chinese: "父亲 / 母亲", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u2-fam-sohn", german: "der Sohn / die Tochter", chinese: "儿子 / 女儿", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, difficulty: 1 }),
  mk({ id: "u2-fam-eltern", german: "die Eltern / die Großeltern", chinese: "父母 / 祖父母", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 3, difficulty: 2 }),
  mk({ id: "u2-fam-familie", german: "die Familie", chinese: "家庭", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "家庭", tags: ["家庭"], foundationValue: 3, examValue: 2, difficulty: 1 }),

  mk({ id: "u2-beruf-lehrer", german: "Ich bin Lehrer / Lehrerin.", chinese: "我是男老师 / 女老师。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u2-beruf-student", german: "Ich bin Student / Studentin.", chinese: "我是（男）大学生 /（女）大学生。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 3, examValue: 3 }),
  mk({ id: "u2-beruf-arzt", german: "Ich bin Arzt / Ärztin.", chinese: "我是男医生 / 女医生。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 2, examValue: 2 }),
  mk({ id: "u2-beruf-pfleger", german: "Ich bin Krankenpfleger / Krankenpflegerin.", chinese: "我是（男）护士 /（女）护士。", prompt: "Was machst du beruflich?", foundation: "职业", tags: ["职业"], foundationValue: 2, examValue: 2 }),

  // haben
  mk({ id: "u2-haben-ich", german: "ich habe", chinese: "我有", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: ich habe" }),
  mk({ id: "u2-haben-du", german: "du hast", chinese: "你有", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: du hast" }),
  mk({ id: "u2-haben-er", german: "er/sie/es hat", chinese: "他/她/它有", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: er/sie/es hat" }),
  mk({ id: "u2-haben-wir", german: "wir haben", chinese: "我们有", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: wir haben" }),
  mk({ id: "u2-haben-sie", german: "sie/Sie haben", chinese: "他们/您有", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "haben", tags: ["haben", "动词变位"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "haben: sie/Sie haben" }),

  // 否定
  mk({ id: "u2-neg-nicht", german: "Das ist nicht ...", chinese: "这不是……（否定句，nicht 否定动词/形容词）", type: "sentence", contentKind: "Grammar", skill: "Vocab", foundation: "否定", tags: ["否定"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "nicht 放在被否定成分之前" }),
  mk({ id: "u2-neg-kein", german: "Ich habe kein Auto.", chinese: "我没有汽车。（kein 否定名词）", type: "sentence", contentKind: "Grammar", skill: "Vocab", foundation: "否定", tags: ["否定"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "kein 用于否定不带定冠词的名词，随性数变化" }),

  // Ja/Nein-Fragen
  mk({ id: "u2-janein-bist", german: "Bist du Student?", chinese: "你是大学生吗？", type: "sentence", contentKind: "Sentence", skill: "Speaking", foundation: "Ja/Nein-Fragen", tags: ["Ja/Nein-Fragen", "sein"], foundationValue: 3, examValue: 3, grammar: "动词放句首构成是非问句：Bist du ...?" }),
  mk({ id: "u2-janein-hast", german: "Hast du Geschwister?", chinese: "你有兄弟姐妹吗？", type: "sentence", contentKind: "Sentence", skill: "Speaking", foundation: "Ja/Nein-Fragen", tags: ["Ja/Nein-Fragen", "haben"], foundationValue: 3, examValue: 3, grammar: "Hast du ...? 由 haben 提前构成" }),
  mk({ id: "u2-janein-kommst", german: "Kommst du aus China?", chinese: "你来自中国吗？", type: "sentence", contentKind: "Sentence", skill: "Speaking", foundation: "kommen", tags: ["Ja/Nein-Fragen", "kommen"], foundationValue: 3, examValue: 3, grammar: "Kommst du ...? 由 kommen 提前构成" }),

  // 陈述句语序 / 动词
  mk({ id: "u2-satzwort", german: "Ich lerne Deutsch in Beijing.", chinese: "我在北京学德语。", type: "sentence", contentKind: "Grammar", skill: "Writing", foundation: "陈述句语序", tags: ["语序"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "陈述句基本原则：动词在第二位（主语+动词+其余）" }),
  mk({ id: "u2-v-wohnen", german: "wohnen – ich wohne, du wohnst", chinese: "居住：我住，你住", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "wohnen", tags: ["动词变位", "wohnen"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "规则动词：词干 + -e/-st/-t；wohnen → wohnst" }),
  mk({ id: "u2-v-sprechen", german: "sprechen – ich spreche, du sprichst", chinese: "说（语言）：我说，你说", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "sprechen", tags: ["动词变位", "sprechen"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "e→i 换音（du sprichst）" }),
  mk({ id: "u2-v-kommen", german: "kommen – ich komme, du kommst", chinese: "来/来自：我来，你来", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "kommen", tags: ["动词变位", "kommen"], foundationValue: 3, examValue: 3, difficulty: 3, grammar: "kommen: 词干 + -st（kommst）" }),
  mk({ id: "u2-v-lernen", german: "lernen – ich lerne, du lernst", chinese: "学习：我学习，你学习", type: "word", contentKind: "Grammar", skill: "Vocab", foundation: "lernen", tags: ["动词变位", "lernen"], foundationValue: 3, examValue: 3, difficulty: 2, grammar: "规则动词：-en + -e/-st/-t" }),

  // W-Fragen
  mk({ id: "u2-wwer", german: "wer / was / wie / wo / woher / welche", chinese: "谁 / 什么 / 怎样 / 哪里 / 来自哪 / 哪些（疑问词）", type: "word", contentKind: "Vocabulary", skill: "Vocab", foundation: "W-Fragen", tags: ["W-Fragen"], foundationValue: 3, examValue: 3, difficulty: 2 }),
];

// Quick lookup by id.
export const ITEM_BY_ID: Record<string, LearningItem> = Object.fromEntries(
  LEARNING_ITEMS.map((i) => [i.id, i])
);

// Source audit counters (exactly two sources).
export const PROVENANCE_COUNTS = LEARNING_ITEMS.reduce(
  (acc, i) => {
    acc[i.sourceType] = (acc[i.sourceType] ?? 0) + 1;
    return acc;
  },
  { USER_CONFIRMED: 0, GENERAL_A1: 0 } as Record<Provenance, number>
);
