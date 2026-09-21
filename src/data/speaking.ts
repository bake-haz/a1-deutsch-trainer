export type SpeakingKind = "word" | "sentence";

export type SpeakingItem = {
  id: string;
  category: string;
  kind: SpeakingKind;
  de: string;
  zh: string;
};

export const SPEAKING_CATEGORIES = [
  "自我介绍",
  "家庭人物",
  "课堂交流",
  "数字时间",
  "吃喝",
  "购物",
  "出行",
  "工作",
  "住房",
  "健康",
  "日常生活",
  "礼貌社交",
] as const;

const words = (category: string, rows: Array<[string, string, string]>): SpeakingItem[] =>
  rows.map(([id, de, zh]) => ({ id, category, kind: "word", de, zh }));

const sentences = (category: string, rows: Array<[string, string, string]>): SpeakingItem[] =>
  rows.map(([id, de, zh]) => ({ id, category, kind: "sentence", de, zh }));

export const SPEAKING_ITEMS: SpeakingItem[] = [
  ...words("自我介绍", [
    ["intro-ich", "ich", "我"],
    ["intro-du", "du", "你"],
    ["intro-heissen", "heißen", "叫……名字"],
    ["intro-kommen", "kommen", "来 / 来自"],
    ["intro-wohnen", "wohnen", "居住"],
    ["intro-sprechen", "sprechen", "说（语言）"],
    ["intro-deutsch", "Deutsch", "德语"],
    ["intro-chinesisch", "Chinesisch", "中文"],
  ]),
  ...sentences("自我介绍", [
    ["intro-s1", "Wie heißt du?", "你叫什么名字？"],
    ["intro-s2", "Ich heiße Zhihui.", "我叫 Zhihui。"],
    ["intro-s3", "Woher kommst du?", "你来自哪里？"],
    ["intro-s4", "Ich komme aus China.", "我来自中国。"],
  ]),

  ...words("家庭人物", [
    ["family-familie", "die Familie", "家庭"],
    ["family-mutter", "die Mutter", "妈妈"],
    ["family-vater", "der Vater", "爸爸"],
    ["family-sohn", "der Sohn", "儿子"],
    ["family-tochter", "die Tochter", "女儿"],
    ["family-bruder", "der Bruder", "兄弟"],
    ["family-schwester", "die Schwester", "姐妹"],
    ["family-kind", "das Kind", "孩子"],
  ]),
  ...sentences("家庭人物", [
    ["family-s1", "Wer ist denn das?", "那是谁呀？"],
    ["family-s2", "Das ist Susanne.", "这是 Susanne。"],
    ["family-s3", "Das ist meine Frau.", "这是我的妻子。"],
    ["family-s4", "Ich habe drei Kinder.", "我有三个孩子。"],
  ]),

  ...words("课堂交流", [
    ["class-verstehen", "verstehen", "理解"],
    ["class-wiederholen", "wiederholen", "重复"],
    ["class-langsam", "langsam", "慢"],
    ["class-bitte", "bitte", "请 / 不客气"],
    ["class-frage", "die Frage", "问题"],
    ["class-antwort", "die Antwort", "回答"],
    ["class-schreiben", "schreiben", "写"],
    ["class-aussprechen", "aussprechen", "发音"],
  ]),
  ...sentences("课堂交流", [
    ["class-s1", "Wie bitte?", "您说什么？"],
    ["class-s2", "Noch einmal, bitte.", "请再说一次。"],
    ["class-s3", "Kannst du das bitte wiederholen?", "你能再说一遍吗？"],
    ["class-s4", "Ich verstehe das nicht.", "我不明白。"],
  ]),

  ...words("数字时间", [
    ["time-null", "null", "零"],
    ["time-eins", "eins", "一"],
    ["time-zwei", "zwei", "二"],
    ["time-drei", "drei", "三"],
    ["time-zehn", "zehn", "十"],
    ["time-zwanzig", "zwanzig", "二十"],
    ["time-heute", "heute", "今天"],
    ["time-morgen", "morgen", "明天"],
  ]),
  ...sentences("数字时间", [
    ["time-s1", "Wie spät ist es?", "几点了？"],
    ["time-s2", "Es ist sieben Uhr.", "现在七点。"],
    ["time-s3", "Wann kommst du?", "你什么时候来？"],
    ["time-s4", "Ich komme morgen.", "我明天来。"],
  ]),

  ...words("吃喝", [
    ["food-wasser", "das Wasser", "水"],
    ["food-kaffee", "der Kaffee", "咖啡"],
    ["food-tee", "der Tee", "茶"],
    ["food-milch", "die Milch", "牛奶"],
    ["food-brot", "das Brot", "面包"],
    ["food-reis", "der Reis", "米饭"],
    ["food-hunger", "der Hunger", "饥饿"],
    ["food-durst", "der Durst", "口渴"],
  ]),
  ...sentences("吃喝", [
    ["food-s1", "Ich habe Hunger.", "我饿了。"],
    ["food-s2", "Ich habe Durst.", "我渴了。"],
    ["food-s3", "Ich möchte einen Kaffee.", "我想要一杯咖啡。"],
    ["food-s4", "Was möchtest du?", "你想要什么？"],
  ]),

  ...words("购物", [
    ["shop-kaufen", "kaufen", "买"],
    ["shop-kosten", "kosten", "花费"],
    ["shop-bezahlen", "bezahlen", "付款"],
    ["shop-billig", "billig", "便宜"],
    ["shop-teuer", "teuer", "贵"],
    ["shop-geld", "das Geld", "钱"],
    ["shop-euro", "der Euro", "欧元"],
    ["shop-preis", "der Preis", "价格"],
  ]),
  ...sentences("购物", [
    ["shop-s1", "Wie viel kostet das?", "这个多少钱？"],
    ["shop-s2", "Das kostet zehn Euro.", "这个十欧元。"],
    ["shop-s3", "Ich möchte das kaufen.", "我想买这个。"],
    ["shop-s4", "Haben Sie das auch in klein?", "您有小一点的吗？"],
  ]),

  ...words("出行", [
    ["travel-auto", "das Auto", "汽车"],
    ["travel-bus", "der Bus", "公交车"],
    ["travel-zug", "der Zug", "火车"],
    ["travel-bahnhof", "der Bahnhof", "火车站"],
    ["travel-fahren", "fahren", "乘车 / 驾驶"],
    ["travel-gehen", "gehen", "走 / 去"],
    ["travel-links", "links", "左边"],
    ["travel-rechts", "rechts", "右边"],
  ]),
  ...sentences("出行", [
    ["travel-s1", "Wo ist der Bahnhof?", "火车站在哪里？"],
    ["travel-s2", "Ich fahre mit dem Bus.", "我坐公交车。"],
    ["travel-s3", "Wohin gehst du?", "你去哪里？"],
    ["travel-s4", "Gehen Sie bitte geradeaus.", "请一直往前走。"],
  ]),

  ...words("工作", [
    ["work-arbeit", "die Arbeit", "工作"],
    ["work-arbeiten", "arbeiten", "工作（动词）"],
    ["work-beruf", "der Beruf", "职业"],
    ["work-fahrer", "der Fahrer", "司机"],
    ["work-kollege", "der Kollege", "男同事"],
    ["work-kollegin", "die Kollegin", "女同事"],
    ["work-chef", "der Chef", "老板 / 上司"],
    ["work-pause", "die Pause", "休息"],
  ]),
  ...sentences("工作", [
    ["work-s1", "Was bist du von Beruf?", "你是做什么工作的？"],
    ["work-s2", "Ich arbeite als Fahrer.", "我是司机。"],
    ["work-s3", "Wann beginnt die Arbeit?", "几点开始工作？"],
    ["work-s4", "Ich habe jetzt Pause.", "我现在休息。"],
  ]),

  ...words("住房", [
    ["home-haus", "das Haus", "房子"],
    ["home-wohnung", "die Wohnung", "公寓 / 住房"],
    ["home-zimmer", "das Zimmer", "房间"],
    ["home-kueche", "die Küche", "厨房"],
    ["home-bad", "das Bad", "浴室"],
    ["home-tuer", "die Tür", "门"],
    ["home-fenster", "das Fenster", "窗户"],
    ["home-schluessel", "der Schlüssel", "钥匙"],
  ]),
  ...sentences("住房", [
    ["home-s1", "Wo wohnst du?", "你住在哪里？"],
    ["home-s2", "Ich wohne in Berlin.", "我住在柏林。"],
    ["home-s3", "Wo ist mein Schlüssel?", "我的钥匙在哪里？"],
    ["home-s4", "Ich bin zu Hause.", "我在家。"],
  ]),

  ...words("健康", [
    ["health-krank", "krank", "生病"],
    ["health-gesund", "gesund", "健康"],
    ["health-arzt", "der Arzt", "医生"],
    ["health-apotheke", "die Apotheke", "药店"],
    ["health-kopf", "der Kopf", "头"],
    ["health-bauch", "der Bauch", "肚子"],
    ["health-schmerz", "der Schmerz", "疼痛"],
    ["health-medikament", "das Medikament", "药"],
  ]),
  ...sentences("健康", [
    ["health-s1", "Ich bin krank.", "我生病了。"],
    ["health-s2", "Ich habe Kopfschmerzen.", "我头疼。"],
    ["health-s3", "Wo ist die Apotheke?", "药店在哪里？"],
    ["health-s4", "Ich brauche einen Arzt.", "我需要医生。"],
  ]),

  ...words("日常生活", [
    ["daily-aufstehen", "aufstehen", "起床"],
    ["daily-lernen", "lernen", "学习"],
    ["daily-lesen", "lesen", "阅读"],
    ["daily-hoeren", "hören", "听"],
    ["daily-essen", "essen", "吃"],
    ["daily-trinken", "trinken", "喝"],
    ["daily-schlafen", "schlafen", "睡觉"],
    ["daily-machen", "machen", "做"],
  ]),
  ...sentences("日常生活", [
    ["daily-s1", "Ich lerne Deutsch.", "我学德语。"],
    ["daily-s2", "Was machst du heute?", "你今天做什么？"],
    ["daily-s3", "Ich stehe um sieben Uhr auf.", "我七点起床。"],
    ["daily-s4", "Am Abend lese ich ein Buch.", "晚上我看书。"],
  ]),

  ...words("礼貌社交", [
    ["social-hallo", "Hallo", "你好"],
    ["social-guten-tag", "Guten Tag", "您好"],
    ["social-danke", "Danke", "谢谢"],
    ["social-entschuldigung", "Entschuldigung", "对不起 / 打扰一下"],
    ["social-tschuess", "Tschüss", "再见"],
    ["social-bis-bald", "Bis bald", "回头见"],
    ["social-ja", "ja", "是 / 对"],
    ["social-nein", "nein", "不 / 不是"],
  ]),
  ...sentences("礼貌社交", [
    ["social-s1", "Guten Morgen!", "早上好！"],
    ["social-s2", "Vielen Dank.", "非常感谢。"],
    ["social-s3", "Entschuldigung, können Sie mir helfen?", "打扰一下，您能帮我吗？"],
    ["social-s4", "Tschüss, bis morgen!", "再见，明天见！"],
  ]),
];

export function speakingTips(text: string): string[] {
  const lower = text.toLocaleLowerCase("de-DE");
  const tips: string[] = [];

  if (lower.includes("ch")) {
    tips.push("ch：ich / nicht 一类要轻，不要读成中文“西”或英语 sh。");
  }
  if (lower.includes("sch")) {
    tips.push("sch：读作类似“sh”的音，嘴唇略向前。");
  }
  if (/(^|\s)(sp|st)/.test(lower)) {
    tips.push("词首 sp / st：常读成 shp / sht 的感觉。");
  }
  if (lower.includes("ei") || lower.includes("ai")) {
    tips.push("ei / ai：通常读成“ai”方向的双元音。");
  }
  if (lower.includes("ie")) {
    tips.push("ie：通常是长 i，注意把元音拉足。");
  }
  if (lower.includes("eu") || lower.includes("äu")) {
    tips.push("eu / äu：是一个双元音，不要拆成两个音节。");
  }
  if (lower.includes("ö")) {
    tips.push("ö：嘴型像 o，但舌位更接近 e。");
  }
  if (lower.includes("ü")) {
    tips.push("ü：嘴型像 u，但舌位更接近 i。");
  }
  if (/[bdg][.!?]?$/i.test(text.trim())) {
    tips.push("词尾 b / d / g 常发生清化，分别更接近 p / t / k。");
  }
  if (lower.includes("r")) {
    tips.push("r：先以“能被听懂”为目标，不必强求夸张的小舌音。");
  }

  if (!tips.length) {
    tips.push("先听标准音，再完整说一遍；不要逐字念，要保持一个词或一句话的整体节奏。");
  }
  return tips.slice(0, 3);
}
