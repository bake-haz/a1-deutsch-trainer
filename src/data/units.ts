// ============================================================================
// Textbook structure + source-PDF registry.
//
// The product spec asks for a Unit 1..16 + Plateau/Review scaffold. Because the
// provided PDFs are SCANNED, only Unit 1–2 are hand-structured so far; Units 3–16
// are scaffolded and point back to the original PDF (opened in-app) marked
// "待结构化" — nothing is fabricated for them.
// ============================================================================

export interface TextbookUnit {
  number: number;
  titleDe: string;
  titleZh: string;
  pageStart: number; // approximate (PDF scanned)
  pageEnd: number; // approximate
  structured: boolean; // do we have structured training content?
  note: string;
}

// Standard Netzwerk A1 (3rd ed.) Lektion topics for 1–12; 13–16 are later modules
// in the book's 16-unit + Plateau layout. Topics beyond 12 are intentionally left
// generic to avoid fabricating content we cannot verify from the scanned PDFs.
export const UNITS: TextbookUnit[] = [
  { number: 1, titleDe: "Hallo! Wie geht's?", titleZh: "你好！最近好吗？", pageStart: 8, pageEnd: 31, structured: true, note: "已结构化：问候、姓名、国家、语言、住址、职业、人称代词、sein、数字、字母。" },
  { number: 2, titleDe: "Familie und Beruf", titleZh: "家庭与职业", pageStart: 32, pageEnd: 55, structured: true, note: "已结构化：家庭、职业、haben、否定、Ja/Nein-Fragen、基本语序、核心动词变化。" },
  { number: 3, titleDe: "Essen und Trinken", titleZh: "饮食", pageStart: 56, pageEnd: 79, structured: false, note: "待结构化：原书见学生用书 PDF，可在「教材」页打开对应页。" },
  { number: 4, titleDe: "Wohnen", titleZh: "居住", pageStart: 80, pageEnd: 103, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 5, titleDe: "Alltag und Zeit", titleZh: "日常与时间", pageStart: 104, pageEnd: 127, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 6, titleDe: "Körper und Gesundheit", titleZh: "身体与健康", pageStart: 128, pageEnd: 151, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 7, titleDe: "Freizeit und Hobbys", titleZh: "业余时间与爱好", pageStart: 152, pageEnd: 175, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 8, titleDe: "Reisen und Verkehr", titleZh: "旅行与交通", pageStart: 176, pageEnd: 199, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 9, titleDe: "Einkaufen und Geld", titleZh: "购物与金钱", pageStart: 200, pageEnd: 223, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 10, titleDe: "Vergangenheit", titleZh: "过去时态", pageStart: 224, pageEnd: 247, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 11, titleDe: "Medien und Kommunikation", titleZh: "媒体与沟通", pageStart: 248, pageEnd: 271, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 12, titleDe: "Natur und Umwelt", titleZh: "自然与环境", pageStart: 272, pageEnd: 295, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 13, titleDe: "Unit 13 (im Buch)", titleZh: "进阶单元 13（待结构化）", pageStart: 296, pageEnd: 305, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 14, titleDe: "Unit 14 (im Buch)", titleZh: "进阶单元 14（待结构化）", pageStart: 306, pageEnd: 312, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 15, titleDe: "Unit 15 (im Buch)", titleZh: "进阶单元 15（待结构化）", pageStart: 312, pageEnd: 312, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 16, titleDe: "Unit 16 (im Buch)", titleZh: "进阶单元 16（待结构化）", pageStart: 312, pageEnd: 312, structured: false, note: "待结构化：原书见学生用书 PDF。" },
  { number: 99, titleDe: "Plateau / Wiederholung", titleZh: "阶段复习 / Plateau", pageStart: 0, pageEnd: 0, structured: false, note: "阶段复习模块：原书见学生用书 PDF。" },
];

export interface SourcePdf {
  id: "student" | "vocab" | "test";
  title: string;
  role: string;
  pages: number;
  fileName: string; // expected filename if user drops it into the app
  note: string;
}

export const SOURCE_PDFS: SourcePdf[] = [
  {
    id: "student",
    title: "交际德语教程 A1 第三版 · 学生用书",
    role: "主教材（课文 / 对话 / 语法 / 练习）",
    pages: 312,
    fileName: "交际德语教程A1第三版-学生用书.pdf",
    note: "核心教材。Unit 1–2 已结构化并接入训练；其余单元可在应用内打开原书页面对照学习。",
  },
  {
    id: "vocab",
    title: "交际德语 A1 第三版 · 词汇手册",
    role: "词汇总表 / 单词卡来源",
    pages: 92,
    fileName: "交际德语A1第三版-词汇手册.pdf",
    note: "按单元排列的词汇表，可作为单词卡与听写来源。",
  },
  {
    id: "test",
    title: "交际德语 A1 第三版 · 测试手册",
    role: "单元测试 / 模拟题（考试能力映射）",
    pages: 72,
    fileName: "交际德语A1第三版-测试手册.pdf",
    note: "每单元测试与模拟题。V1 仅建立「考试能力」入口与题型映射，不逐题导入。",
  },
];

export const EXAM_SKILL_KEYS = ["Hören", "Lesen", "Schreiben", "Sprechen"] as const;
export type ExamSkillKey = (typeof EXAM_SKILL_KEYS)[number];
