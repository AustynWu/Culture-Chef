// @/data/users.ts
import type { SpiceLevel } from "@/data/chefs";

// 與 chefs.ts 對齊：限制為平台支援的三種
type DietaryTag = "vegan" | "vegetarian" | "halal";

export type DemoUser = {
  id: string;
  name: string;
  dietary: DietaryTag[];       // 例如 ["vegan"] / ["halal"] / []
  spiceTolerance: SpiceLevel;  // "none" | "mild" | "medium" | "hot"
  allergens?: string[];        // 可留空，之後可擴充
  notes?: string;              // 顯示在 UI 的簡短說明
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u1",
    name: "Ava",
    dietary: ["vegan"],
    spiceTolerance: "none",
    notes: "Vegan • No spicy",
  },
  {
    id: "u2",
    name: "Bilal",
    dietary: ["halal"],
    spiceTolerance: "mild",
    notes: "Halal • Mild spice",
  },
  {
    id: "u3",
    name: "Chen",
    dietary: [],
    spiceTolerance: "medium",
    notes: "Prefers medium spice",
  },
];

// 簡單的「刷新時隨機一位」工具（或在頁面用 useState 管控）
export const pickRandomDemoUser = (): DemoUser => {
  const i = Math.floor(Math.random() * DEMO_USERS.length);
  return DEMO_USERS[i];
};
