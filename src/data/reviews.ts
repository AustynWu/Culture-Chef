// data/reviews.ts
import { chefs } from "@/data/chefs";

export type Review = {
  id: string;
  chefId: string;
  author: string;
  rating: number;     // 1..5
  text: string;
  createdAt: string;  // ISO
  orderId?: string;
};

// 簡單模板（可自行擴充/改成更道地的文案）
const AUTHORS = ["Kevin W.", "Jess L.", "Ming C.", "Tina H.", "Leo Y.", "Arjun P.", "Mina T.", "Luca D.", "Asha R.", "Kenji N.", "Mike C.", "Sarah K.", "Omar A.", "Nate V.", "Clara S."];
const TEMPLATES = [
  "Great flavors and friendly service.",
  "Portions were generous and fresh.",
  "Would definitely rebook.",
  "Tasted like home—comforting and honest.",
  "Balanced seasoning; arrived right on time.",
  "Loved the textures, not too salty or sweet.",
  "Clean presentation and warm communication.",
  "Spice level just right; we all enjoyed it.",
  "Excellent value for the quality.",
  "Reminded me of hometown cooking."
];

// 以 chefId 當種子 → 穩定隨機
function seeded(chefId: string, i: number) {
  let h = 0;
  const s = chefId + ":" + i;
  for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0;
  const rnd = (n: number) => Math.abs(Math.sin(h++)) % 1; // 0..1
  return { rnd };
}

function genFive(chefId: string): Review[] {
  const out: Review[] = [];
  for (let i = 0; i < 5; i++) {
    const { rnd } = seeded(chefId, i);
    const a = AUTHORS[Math.floor(rnd(0) * AUTHORS.length)];
    const t = TEMPLATES[Math.floor(rnd(1) * TEMPLATES.length)];
    const rating = 3 + Math.floor(rnd(2) * 3); // 3..5 星，較正向
    // 生成近 60 天內的日期（新到舊）
    const daysAgo = Math.floor(rnd(3) * 60) + i * 2;
    const dt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    out.push({
      id: `seed-${chefId}-${i + 1}`,
      chefId,
      author: a,
      rating,
      text: t,
      createdAt: dt,
    });
  }
  // 新的排前面（createdAt 由新到舊）
  out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return out;
}

// === 匯出：每位 chef 5 筆 ===
export const SEED_REVIEWS: Record<string, Review[]> = Object.fromEntries(
  chefs.map((c) => [c.id, genFive(c.id)])
);
