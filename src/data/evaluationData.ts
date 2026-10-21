import { EvaluationItem, EvaluationCategory } from '../types';

export const evaluationCategories: EvaluationCategory[] = [
  {
    key: 'content',
    title: 'ด้านที่ 1: เนื้อหาและบทเรียน',
    description: 'ประเมินความถูกต้อง ครบถ้วน และคุณค่าทางวิชาการของบทเรียน',
    iconName: 'BookOpen',
  },
  {
    key: 'design',
    title: 'ด้านที่ 2: การออกแบบและความสวยงาม',
    description: 'ประเมินรูปแบบ UI ความสอดคล้องของสี ตัวอักษร และองค์ประกอบศิลป์',
    iconName: 'Palette',
  },
  {
    key: 'usability',
    title: 'ด้านที่ 3: การใช้งานแอปพลิเคชัน',
    description: 'ประเมินความสะดวก ความเร็ว และประสบการณ์การโต้ตอบ UX',
    iconName: 'LayoutGrid',
  },
  {
    key: 'satisfaction',
    title: 'ด้านที่ 4: ประโยชน์และความพึงพอใจ',
    description: 'ประเมินการนำไปใช้ประโยชน์ในชีวิตจริงและความประทับใจโดยรวม',
    iconName: 'HeartHandshake',
  },
];

export const evaluationItems: EvaluationItem[] = [
  // ด้านที่ 1: เนื้อหาและบทเรียน
  {
    id: 'eval_content_1',
    category: 'content',
    text: 'เนื้อหาบทเรียนมีความถูกต้อง ทันสมัย และเหมาะสมต่อการเรียนรู้ด้านความปลอดภัยอินเทอร์เน็ต',
  },
  {
    id: 'eval_content_2',
    category: 'content',
    text: 'การอธิบายเนื้อหามีความชัดเจน ใช้ภาษาเข้าใจง่าย ลำดับเรื่องเป็นขั้นเป็นตอน',
  },
  {
    id: 'eval_content_3',
    category: 'content',
    text: 'ระดับความยากง่ายของเนื้อหาและแบบทดสอบมีความเหมาะสมกับระดับของผู้เรียน',
  },
  {
    id: 'eval_content_4',
    category: 'content',
    text: 'เนื้อหาและกรณีศึกษาสามารถนำไปประยุกต์ใช้ป้องกันภัยคุกคามในชีวิตประจำวันได้จริง',
  },

  // ด้านที่ 2: การออกแบบและความสวยงาม
  {
    id: 'eval_design_1',
    category: 'design',
    text: 'หน้าจอแอปพลิเคชันมีความสวยงาม ทันสมัย และน่าดึงดูดใจในการเข้าเรียนรู้',
  },
  {
    id: 'eval_design_2',
    category: 'design',
    text: 'การเลือกใช้โทนสี (น้ำเงิน ขาว ฟ้าอมเขียว) และรูปแบบตัวอักษร Kanit อ่านง่ายสบายตา',
  },
  {
    id: 'eval_design_3',
    category: 'design',
    text: 'ภาพประกอบ แผนภาพ และอินโฟกราฟิกมีความชัดเจน สื่อความหมายสอดคล้องกับบทเรียน',
  },
  {
    id: 'eval_design_4',
    category: 'design',
    text: 'การจัดวางองค์ประกอบ การแบ่งหมวดหมู่ และ Card Design มีความเป็นระเบียบเรียบร้อย',
  },

  // ด้านที่ 3: การใช้งานแอปพลิเคชัน
  {
    id: 'eval_usability_1',
    category: 'usability',
    text: 'การจัดวางเมนูและระบบการนำทาง (Navigation) ใช้งานสะดวก เข้าใจได้โดยไม่ต้องมีคู่มือ',
  },
  {
    id: 'eval_usability_2',
    category: 'usability',
    text: 'ระบบทำงานรวดเร็ว เข้าถึงเนื้อหาแต่ละบทเรียนและสลับหน้าต่างได้อย่างราบรื่น',
  },
  {
    id: 'eval_usability_3',
    category: 'usability',
    text: 'ระบบแบบทดสอบใช้งานสะดวก มีการนำทางข้อสอบ และเฉลยพร้อมคำอธิบายที่ช่วยให้เข้าใจ',
  },
  {
    id: 'eval_usability_4',
    category: 'usability',
    text: 'แอปพลิเคชันสามารถแสดงผลและใช้งานได้ดีทั้งบนคอมพิวเตอร์ แท็บเล็ต และสมาร์ตโฟน (Responsive)',
  },

  // ด้านที่ 4: ประโยชน์และความพึงพอใจ
  {
    id: 'eval_satisfaction_1',
    category: 'satisfaction',
    text: 'ผู้เรียนได้รับความรู้ความเข้าใจเกี่ยวกับการใช้อินเทอร์เน็ตอย่างปลอดภัยเพิ่มขึ้นอย่างเห็นได้ชัด',
  },
  {
    id: 'eval_satisfaction_2',
    category: 'satisfaction',
    text: 'เกิดความมั่นใจในการระวังป้องกันตนเองจากฟิชชิ่ง มิจฉาชีพ และการปกป้องข้อมูลส่วนบุคคล',
  },
  {
    id: 'eval_satisfaction_3',
    category: 'satisfaction',
    text: 'บรรยากาศการเรียนรู้มีความสนุก น่าสนใจ กระตุ้นให้อยากศึกษาบทเรียนจนครบทุกหน่วย',
  },
  {
    id: 'eval_satisfaction_4',
    category: 'satisfaction',
    text: 'มีความพึงพอใจในภาพรวมต่อการใช้งานเว็บแอปพลิเคชัน SafeNet Learning ในระดับสูง',
  },
];

export const likertScaleOptions = [
  { score: 5, label: 'มากที่สุด', color: 'bg-emerald-500 text-white border-emerald-600' },
  { score: 4, label: 'มาก', color: 'bg-teal-500 text-white border-teal-600' },
  { score: 3, label: 'ปานกลาง', color: 'bg-blue-500 text-white border-blue-600' },
  { score: 2, label: 'น้อย', color: 'bg-amber-500 text-white border-amber-600' },
  { score: 1, label: 'น้อยที่สุด', color: 'bg-rose-500 text-white border-rose-600' },
];

export const getScoreInterpretation = (score: number): { label: string; color: string } => {
  if (score >= 4.51) return { label: 'เหมาะสมมากที่สุด / ยอดเยี่ยม', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (score >= 3.51) return { label: 'เหมาะสมมาก / ดีมาก', color: 'text-teal-700 bg-teal-50 border-teal-200' };
  if (score >= 2.51) return { label: 'ปานกลาง', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (score >= 1.51) return { label: 'น้อย / ควรปรับปรุง', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'น้อยที่สุด / ต้องปรับปรุงเร่งด่วน', color: 'text-rose-700 bg-rose-50 border-rose-200' };
};
