// ============================================================================
// A1 German dictionary (curated, offline, no API key required for V1).
//
// Reuse strategy: the primary, reliable lookup is this curated A1 lexicon. For
// words NOT in the lexicon we attempt a BEST-EFFORT Wiktionary lookup at runtime
// (see lib/wiktionary.ts) and degrade gracefully if offline / blocked.
//
// IPA policy (spec §8): only include IPA we are confident in (standard German
// pronunciation). Where unsure, omit it rather than show a wrong value.
//
// `forms` lists every surface form (incl. lemma) so inflected input such as
// "wohnst" / "sprichst" resolves to its lemma and is recognised as a conjugation.
// `conjugation` gives the basic person forms shown on the word card.
// ============================================================================

export interface DictExample {
  de: string;
  zh: string;
}

export interface Conjugation {
  p: string; // pronoun
  f: string; // form
}

export interface DictEntry {
  lemma: string;
  forms: string[];
  pos: "动词" | "名词" | "代词" | "形容词" | "副词" | "介词" | "冠词" | "数词" | "疑问词" | "连词" | "其他";
  ipa?: string;
  zh: string;
  article?: "der" | "die" | "das";
  plural?: string;
  conjugation?: Conjugation[];
  examples?: DictExample[];
}

export const DICTIONARY: DictEntry[] = [
  // ---- Verbs (核心动词) ----
  { lemma: "sein", forms: ["sein", "bin", "bist", "ist", "sind", "seid"], pos: "动词", ipa: "zaɪ̯n", zh: "是；在",
    conjugation: [{ p: "ich", f: "bin" }, { p: "du", f: "bist" }, { p: "er/sie/es", f: "ist" }, { p: "wir", f: "sind" }, { p: "ihr", f: "seid" }, { p: "sie/Sie", f: "sind" }],
    examples: [{ de: "Ich bin 39.", zh: "我 39 岁。" }, { de: "Wie heißt du? – Ich bin ...", zh: "你叫什么？——我叫……" }] },
  { lemma: "haben", forms: ["haben", "habe", "hast", "hat", "habt"], pos: "动词", ipa: "ˈhaːbn̩", zh: "有",
    conjugation: [{ p: "ich", f: "habe" }, { p: "du", f: "hast" }, { p: "er/sie/es", f: "hat" }, { p: "wir", f: "haben" }, { p: "ihr", f: "habt" }, { p: "sie/Sie", f: "haben" }],
    examples: [{ de: "Ich habe ein Auto.", zh: "我有一辆汽车。" }] },
  { lemma: "kommen", forms: ["kommen", "komme", "kommst", "kommt"], pos: "动词", ipa: "ˈkɔmn̩", zh: "来；来自",
    conjugation: [{ p: "ich", f: "komme" }, { p: "du", f: "kommst" }, { p: "er/sie/es", f: "kommt" }, { p: "wir", f: "kommen" }, { p: "ihr", f: "kommt" }, { p: "sie/Sie", f: "kommen" }],
    examples: [{ de: "Woher kommst du?", zh: "你来自哪里？" }, { de: "Ich komme aus China.", zh: "我来自中国。" }] },
  { lemma: "wohnen", forms: ["wohnen", "wohne", "wohnst", "wohnt"], pos: "动词", ipa: "ˈvoːnən", zh: "居住；住",
    conjugation: [{ p: "ich", f: "wohne" }, { p: "du", f: "wohnst" }, { p: "er/sie/es", f: "wohnt" }, { p: "wir", f: "wohnen" }, { p: "ihr", f: "wohnt" }, { p: "sie/Sie", f: "wohnen" }],
    examples: [{ de: "Wo wohnst du?", zh: "你住在哪里？" }, { de: "Ich wohne in Beijing.", zh: "我住在北京。" }] },
  { lemma: "sprechen", forms: ["sprechen", "spreche", "sprichst", "spricht", "sprecht"], pos: "动词", ipa: "ˈʃpʁɛçn̩", zh: "说（语言）",
    conjugation: [{ p: "ich", f: "spreche" }, { p: "du", f: "sprichst" }, { p: "er/sie/es", f: "spricht" }, { p: "wir", f: "sprechen" }, { p: "ihr", f: "sprecht" }, { p: "sie/Sie", f: "sprechen" }],
    examples: [{ de: "Ich spreche Deutsch.", zh: "我说德语。" }, { de: "Welche Sprachen sprichst du?", zh: "你说哪些语言？" }] },
  { lemma: "lernen", forms: ["lernen", "lerne", "lernst", "lernt"], pos: "动词", ipa: "ˈlɛʁnən", zh: "学习",
    conjugation: [{ p: "ich", f: "lerne" }, { p: "du", f: "lernst" }, { p: "er/sie/es", f: "lernt" }, { p: "wir", f: "lernen" }, { p: "ihr", f: "lernt" }, { p: "sie/Sie", f: "lernen" }],
    examples: [{ de: "Lernst du Deutsch?", zh: "你学德语吗？" }] },
  { lemma: "heißen", forms: ["heißen", "heiße", "heißt"], pos: "动词", ipa: "ˈhaɪ̯sn̩", zh: "名叫；叫做",
    conjugation: [{ p: "ich", f: "heiße" }, { p: "du", f: "heißt" }, { p: "er/sie/es", f: "heißt" }, { p: "wir", f: "heißen" }, { p: "ihr", f: "heißt" }, { p: "sie/Sie", f: "heißen" }],
    examples: [{ de: "Wie heißt du?", zh: "你叫什么名字？" }] },
  { lemma: "machen", forms: ["machen", "mache", "machst", "macht"], pos: "动词", ipa: "ˈmaxn̩", zh: "做；制作",
    conjugation: [{ p: "ich", f: "mache" }, { p: "du", f: "machst" }, { p: "er/sie/es", f: "macht" }, { p: "wir", f: "machen" }, { p: "ihr", f: "macht" }, { p: "sie/Sie", f: "machen" }],
    examples: [{ de: "Was machst du beruflich?", zh: "你是做什么工作的？" }] },
  { lemma: "arbeiten", forms: ["arbeiten", "arbeite", "arbeitest", "arbeitet"], pos: "动词", ipa: "ˈaʁbaɪ̯tn̩", zh: "工作",
    conjugation: [{ p: "ich", f: "arbeite" }, { p: "du", f: "arbeitest" }, { p: "er/sie/es", f: "arbeitet" }, { p: "wir", f: "arbeiten" }, { p: "ihr", f: "arbeitet" }, { p: "sie/Sie", f: "arbeiten" }],
    examples: [{ de: "Ich arbeite in Berlin.", zh: "我在柏林工作。" }] },
  { lemma: "studieren", forms: ["studieren", "studiere", "studierst", "studiert"], pos: "动词", ipa: "ʃtuˈdiːʁən", zh: "上大学；研读",
    conjugation: [{ p: "ich", f: "studiere" }, { p: "du", f: "studierst" }, { p: "er/sie/es", f: "studiert" }, { p: "wir", f: "studieren" }, { p: "ihr", f: "studiert" }, { p: "sie/Sie", f: "studieren" }],
    examples: [{ de: "Ich studiere Medizin.", zh: "我学医。" }] },
  { lemma: "gehen", forms: ["gehen", "gehe", "gehst", "geht"], pos: "动词", ipa: "ˈɡeːən", zh: "走；去",
    conjugation: [{ p: "ich", f: "gehe" }, { p: "du", f: "gehst" }, { p: "er/sie/es", f: "geht" }, { p: "wir", f: "gehen" }, { p: "ihr", f: "geht" }, { p: "sie/Sie", f: "gehen" }],
    examples: [{ de: "Ich gehe nach Hause.", zh: "我回家。" }] },
  { lemma: "fragen", forms: ["fragen", "frage", "fragst", "fragt"], pos: "动词", ipa: "ˈfʁaːɡn̩", zh: "问",
    conjugation: [{ p: "ich", f: "frage" }, { p: "du", f: "fragst" }, { p: "er/sie/es", f: "fragt" }, { p: "wir", f: "fragen" }, { p: "ihr", f: "fragt" }, { p: "sie/Sie", f: "fragen" }],
    examples: [{ de: "Ich frage den Lehrer.", zh: "我问老师。" }] },
  { lemma: "antworten", forms: ["antworten", "antworte", "antwortest", "antwortet"], pos: "动词", ipa: "ˈantvɔʁtn̩", zh: "回答",
    conjugation: [{ p: "ich", f: "antworte" }, { p: "du", f: "antwortest" }, { p: "er/sie/es", f: "antwortet" }, { p: "wir", f: "antworten" }, { p: "ihr", f: "antwortet" }, { p: "sie/Sie", f: "antworten" }],
    examples: [{ de: "Antworten Sie bitte.", zh: "请回答。" }] },

  // ---- Nouns (名词) ----
  { lemma: "Mann", forms: ["Mann", "Männer"], pos: "名词", article: "der", plural: "Männer", ipa: "man", zh: "男人" },
  { lemma: "Frau", forms: ["Frau", "Frauen"], pos: "名词", article: "die", plural: "Frauen", ipa: "fʁaʊ̯", zh: "女人；妻子" },
  { lemma: "Vater", forms: ["Vater", "Väter"], pos: "名词", article: "der", plural: "Väter", ipa: "ˈfaːtɐ", zh: "父亲" },
  { lemma: "Mutter", forms: ["Mutter", "Mütter"], pos: "名词", article: "die", plural: "Mütter", ipa: "ˈmʊtɐ", zh: "母亲" },
  { lemma: "Sohn", forms: ["Sohn", "Söhne"], pos: "名词", article: "der", plural: "Söhne", ipa: "zoːn", zh: "儿子" },
  { lemma: "Tochter", forms: ["Tochter", "Töchter"], pos: "名词", article: "die", plural: "Töchter", ipa: "ˈtɔxtɐ", zh: "女儿" },
  { lemma: "Bruder", forms: ["Bruder", "Brüder"], pos: "名词", article: "der", plural: "Brüder", ipa: "ˈbʁuːdɐ", zh: "兄弟" },
  { lemma: "Schwester", forms: ["Schwester", "Schwestern"], pos: "名词", article: "die", plural: "Schwestern", ipa: "ˈʃvɛstɐ", zh: "姐妹" },
  { lemma: "Eltern", forms: ["Eltern"], pos: "名词", article: "die", ipa: "ˈɛltɐn", zh: "父母" },
  { lemma: "Großeltern", forms: ["Großeltern"], pos: "名词", article: "die", ipa: "ˈɡʁoːsɛltɐn", zh: "祖父母" },
  { lemma: "Familie", forms: ["Familie", "Familien"], pos: "名词", article: "die", plural: "Familien", ipa: "faˈmiːli̯ə", zh: "家庭" },
  { lemma: "Beruf", forms: ["Beruf", "Berufe"], pos: "名词", article: "der", plural: "Berufe", ipa: "bəˈʁuːf", zh: "职业",
    examples: [{ de: "Was ist dein Beruf?", zh: "你的职业是什么？" }] },
  { lemma: "Student", forms: ["Student", "Studenten"], pos: "名词", article: "der", plural: "Studenten", ipa: "ʃtuˈdɛnt", zh: "（男）大学生" },
  { lemma: "Studentin", forms: ["Studentin", "Studentinnen"], pos: "名词", article: "die", plural: "Studentinnen", ipa: "ʃtuˈdɛntɪn", zh: "（女）大学生" },
  { lemma: "Arzt", forms: ["Arzt", "Ärzte"], pos: "名词", article: "der", plural: "Ärzte", ipa: "aʁtst", zh: "（男）医生" },
  { lemma: "Ärztin", forms: ["Ärztin", "Ärztinnen"], pos: "名词", article: "die", plural: "Ärztinnen", ipa: "ˈɛʁtstɪn", zh: "（女）医生" },
  { lemma: "Lehrer", forms: ["Lehrer"], pos: "名词", article: "der", plural: "Lehrer", ipa: "ˈleːʁɐ", zh: "（男）老师" },
  { lemma: "Lehrerin", forms: ["Lehrerin", "Lehrerinnen"], pos: "名词", article: "die", plural: "Lehrerinnen", ipa: "ˈleːʁəʁɪn", zh: "（女）老师" },
  { lemma: "Fahrer", forms: ["Fahrer"], pos: "名词", article: "der", plural: "Fahrer", ipa: "ˈfaːʁɐ", zh: "司机" },
  { lemma: "Auto", forms: ["Auto", "Autos"], pos: "名词", article: "das", plural: "Autos", ipa: "ˈaʊ̯to", zh: "汽车" },
  { lemma: "Haus", forms: ["Haus", "Häuser"], pos: "名词", article: "das", plural: "Häuser", ipa: "haʊ̯s", zh: "房子", examples: [{ de: "Ich gehe nach Hause.", zh: "我回家。" }] },
  { lemma: "Wohnung", forms: ["Wohnung", "Wohnungen"], pos: "名词", article: "die", plural: "Wohnungen", ipa: "ˈvoːnʊŋ", zh: "公寓" },
  { lemma: "Stadt", forms: ["Stadt", "Städte"], pos: "名词", article: "die", plural: "Städte", ipa: "ʃtat", zh: "城市", examples: [{ de: "Ich wohne in einer großen Stadt.", zh: "我住在大城市。" }] },
  { lemma: "Land", forms: ["Land", "Länder"], pos: "名词", article: "das", plural: "Länder", ipa: "lant", zh: "国家；土地",
    examples: [{ de: "Ich komme aus einem anderen Land.", zh: "我来自另一个国家。" }] },
  { lemma: "Sprache", forms: ["Sprache", "Sprachen"], pos: "名词", article: "die", plural: "Sprachen", ipa: "ˈʃpʁaːxə", zh: "语言",
    examples: [{ de: "Ich lerne eine neue Sprache.", zh: "我在学一门新语言。" }] },
  { lemma: "Name", forms: ["Name", "Namen"], pos: "名词", article: "der", plural: "Namen", ipa: "naːmə", zh: "名字" },
  { lemma: "Nummer", forms: ["Nummer", "Nummern"], pos: "名词", article: "die", plural: "Nummern", ipa: "ˈnʊmɐ", zh: "号码", examples: [{ de: "Meine Telefonnummer.", zh: "我的电话号码。" }] },
  { lemma: "Adresse", forms: ["Adresse", "Adressen"], pos: "名词", article: "die", plural: "Adressen", ipa: "aˈdʁɛsə", zh: "地址" },
  { lemma: "Buch", forms: ["Buch", "Bücher"], pos: "名词", article: "das", plural: "Bücher", ipa: "buːx", zh: "书" },
  { lemma: "Wort", forms: ["Wort", "Wörter"], pos: "名词", article: "das", plural: "Wörter", ipa: "vɔʁt", zh: "词；单词" },
  { lemma: "Tag", forms: ["Tag", "Tage"], pos: "名词", article: "der", plural: "Tage", ipa: "taːk", zh: "天；白天", examples: [{ de: "Guten Tag!", zh: "你好！" }] },
  { lemma: "Zeit", forms: ["Zeit"], pos: "名词", article: "die", ipa: "tsaɪ̯t", zh: "时间" },
  { lemma: "Jahr", forms: ["Jahr", "Jahre"], pos: "名词", article: "das", plural: "Jahre", ipa: "jaːɐ̯", zh: "年", examples: [{ de: "Ich bin 39 Jahre alt.", zh: "我 39 岁。" }] },
  { lemma: "Schule", forms: ["Schule", "Schulen"], pos: "名词", article: "die", plural: "Schulen", ipa: "ˈʃuːlə", zh: "学校" },
  { lemma: "Bleistift", forms: ["Bleistift", "Bleistifte"], pos: "名词", article: "der", plural: "Bleistifte", ipa: "ˈblaɪ̯ʃtɪft", zh: "铅笔",
    examples: [{ de: "Das ist ein Bleistift.", zh: "这是一支铅笔。" }] },

  // ---- Pronouns / articles ----
  { lemma: "ich", forms: ["ich"], pos: "代词", ipa: "ɪç", zh: "我" },
  { lemma: "du", forms: ["du"], pos: "代词", ipa: "duː", zh: "你（非正式）" },
  { lemma: "er", forms: ["er"], pos: "代词", ipa: "eːɐ̯", zh: "他" },
  { lemma: "sie", forms: ["sie"], pos: "代词", ipa: "ziː", zh: "她 / 他们 / 您（Sie）" },
  { lemma: "wir", forms: ["wir"], pos: "代词", ipa: "viːɐ̯", zh: "我们" },
  { lemma: "der", forms: ["der", "den", "dem", "des"], pos: "冠词", ipa: "deːɐ̯", zh: "定冠词（阳性 / 多种格）" },
  { lemma: "die", forms: ["die"], pos: "冠词", ipa: "diː", zh: "定冠词（阴性 / 复数）" },
  { lemma: "das", forms: ["das"], pos: "冠词", ipa: "das", zh: "定冠词（中性）" },
  { lemma: "ein", forms: ["ein", "einen", "einem", "einer"], pos: "冠词", ipa: "aɪ̯n", zh: "不定冠词（阳性 / 中性）" },
  { lemma: "eine", forms: ["eine"], pos: "冠词", ipa: "ˈaɪ̯nə", zh: "不定冠词（阴性）" },

  // ---- Adjectives / adverbs ----
  { lemma: "gut", forms: ["gut", "gute", "guter", "gutes"], pos: "形容词", ipa: "ɡuːt", zh: "好的", examples: [{ de: "Mir geht es gut.", zh: "我很好。" }] },
  { lemma: "schlecht", forms: ["schlecht"], pos: "形容词", ipa: "ʃlɛçt", zh: "差的；坏的" },
  { lemma: "groß", forms: ["groß", "große", "großer"], pos: "形容词", ipa: "ɡʁoːs", zh: "大的" },
  { lemma: "klein", forms: ["klein", "kleine"], pos: "形容词", ipa: "klaɪ̯n", zh: "小的" },
  { lemma: "neu", forms: ["neu", "neue"], pos: "形容词", ipa: "nɔɪ̯", zh: "新的" },
  { lemma: "alt", forms: ["alt", "alte"], pos: "形容词", ipa: "alt", zh: "老的；旧的", examples: [{ de: "Wie alt bist du?", zh: "你多大了？" }] },
  { lemma: "deutsch", forms: ["deutsch"], pos: "形容词", ipa: "dɔɪ̯tʃ", zh: "德国的；德语的" },
  { lemma: "chinesisch", forms: ["chinesisch"], pos: "形容词", ipa: "çiˈneːzɪʃ", zh: "中国的；中文的" },
  { lemma: "hier", forms: ["hier"], pos: "副词", ipa: "hiːɐ̯", zh: "这里" },
  { lemma: "da", forms: ["da"], pos: "副词", ipa: "daː", zh: "那里" },
  { lemma: "heute", forms: ["heute"], pos: "副词", ipa: "ˈhɔɪ̯tə", zh: "今天" },
  { lemma: "morgen", forms: ["morgen"], pos: "副词", ipa: "ˈmɔʁɡn̩", zh: "明天" },
  { lemma: "gern", forms: ["gern"], pos: "副词", ipa: "ɡɛʁn", zh: "喜欢（做）", examples: [{ de: "Ich lerne gern.", zh: "我喜欢学习。" }] },
  { lemma: "auch", forms: ["auch"], pos: "副词", ipa: "aʊ̯x", zh: "也" },
  { lemma: "nicht", forms: ["nicht"], pos: "副词", ipa: "nɪçt", zh: "不；没" },
  { lemma: "sehr", forms: ["sehr"], pos: "副词", ipa: "zeːɐ̯", zh: "很；非常" },

  // ---- Prepositions ----
  { lemma: "aus", forms: ["aus"], pos: "介词", ipa: "aʊ̯s", zh: "从……出来；来自",
    examples: [{ de: "Ich komme aus China.", zh: "我来自中国。" }] },
  { lemma: "in", forms: ["in"], pos: "介词", ipa: "ɪn", zh: "在……里",
    examples: [{ de: "Ich wohne in Beijing.", zh: "我住在北京。" }] },
  { lemma: "mit", forms: ["mit"], pos: "介词", ipa: "mɪt", zh: "和；用", examples: [{ de: "Ich spreche mit ihm.", zh: "我和他说话。" }] },
  { lemma: "von", forms: ["von"], pos: "介词", ipa: "fɔn", zh: "……的（所属）" },
  { lemma: "nach", forms: ["nach"], pos: "介词", ipa: "naːx", zh: "向；在……之后", examples: [{ de: "nach Hause gehen", zh: "回家" }] },

  // ---- Question words ----
  { lemma: "wer", forms: ["wer"], pos: "疑问词", ipa: "veːɐ̯", zh: "谁",
    examples: [{ de: "Wer ist das?", zh: "这是谁？" }] },
  { lemma: "was", forms: ["was"], pos: "疑问词", ipa: "vas", zh: "什么" },
  { lemma: "wie", forms: ["wie"], pos: "疑问词", ipa: "viː", zh: "怎样；如何",
    examples: [{ de: "Wie geht es dir?", zh: "你好吗？" }] },
  { lemma: "wo", forms: ["wo"], pos: "疑问词", ipa: "voː", zh: "在哪里",
    examples: [{ de: "Wo wohnst du?", zh: "你住哪？" }] },
  { lemma: "woher", forms: ["woher"], pos: "疑问词", ipa: "vɔˈheːɐ̯", zh: "从哪里" },
  { lemma: "welche", forms: ["welche", "welcher", "welches"], pos: "疑问词", ipa: "ˈvɛlçə", zh: "哪些；哪一个",
    examples: [{ de: "Welche Sprachen sprichst du?", zh: "你说哪些语言？" }] },
];

// Build a fast index: surface form (lowercased) -> entry
const FORM_INDEX = new Map<string, DictEntry>();
for (const e of DICTIONARY) {
  for (const f of e.forms) FORM_INDEX.set(f.toLowerCase(), e);
}

export interface LookupResult {
  entry: DictEntry;
  matchedForm: string;
  isInflected: boolean; // true if the matched form is not the lemma (a conjugation etc.)
  grammaticalPerson?: string; // e.g. "du" when the form is that person's conjugation
}

export function lookupWord(raw: string): LookupResult | null {
  const w = raw.trim().toLowerCase().replace(/[.,!?;:?"„""'’]/g, "");
  if (!w) return null;
  const entry = FORM_INDEX.get(w);
  if (!entry) return null;
  // Preserve the dictionary's own capitalisation (e.g. "Bleistift", not "bleistift").
  const matchedForm = entry.forms.find((f) => f.toLowerCase() === w) ?? w;
  const isInflected = matchedForm.toLowerCase() !== entry.lemma.toLowerCase();
  const person = entry.conjugation?.find((c) => c.f.toLowerCase() === w)?.p;
  return {
    entry,
    matchedForm,
    isInflected,
    grammaticalPerson: person,
  };
}
