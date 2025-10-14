// src/app/browse/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../../lib/variants";
import Modal from "@/components/Modal";
import { chefsWithGeo as chefs } from "@/data/chefs";
import dynamic from "next/dynamic";
import type { Chef as DataChef, MenuItem as DataMenuItem, SpiceLevel } from "@/data/chefs";
import ScrollPills from "@/components/ScrollPills";

// 最小型別（避免你的 data 欄位沒有就報錯）
type MenuItem = DataMenuItem;  // 已含 dietaryTags?: string[], spiceLevel?: SpiceLevel
type Chef = DataChef;          // 已含 halalVerified?: boolean 等
// 用資料的型別推導出字面量聯合型別 "vegan" | "vegetarian" | "halal"
type DietaryTag = NonNullable<DataMenuItem["dietaryTags"]>[number];

const ChefMap = dynamic(() => import("@/components/ChefMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center text-sm text-gray-500">
      Loading map…
    </div>
  ),
});

export default function BrowsePage() {
  // 從資料動態萃取菜系（去重）
  const cuisines = useMemo(() => {
    const set = new Set<string>();
    (chefs as Chef[]).forEach((c) => (c.cuisine || []).forEach((x) => set.add(x)));
    return Array.from(set).sort();
  }, []);

  // 取出唯一的 Region（來自 chef.origin.region）
  const regions = useMemo(() => {
    const set = new Set<string>();
    (chefs as Chef[]).forEach((c) => {
      const r = c.origin?.region?.trim();
      if (r) set.add(r);
    });
    return ["All", ...Array.from(set).sort()];
  }, []);

  const [qRegion, setQRegion] = useState<string>("All");


  const [qCuisine, setQCuisine] = useState<string | null>(null);

  // ADD ↓ 三個狀態
  const [qDietary, setQDietary] = useState<DietaryTag[]>([]);                // "vegan" | "vegetarian" | "halal"
  const [qSpice, setQSpice] = useState<SpiceLevel[]>([]);
  const [qHalalVerified, setQHalalVerified] = useState(false);

  // 選項（加上 as const，避免被寬化成 string[]）
  const DIETARY = ["vegan", "vegetarian", "halal"] as const;
  const SPICE: readonly SpiceLevel[] = ["none", "mild", "medium", "hot"] as const;

  // 小工具：為了型別穩定，分開寫兩個 toggle
  const toggleDietary = (arr: DietaryTag[], v: DietaryTag) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const toggleSpice = (arr: SpiceLevel[], v: SpiceLevel) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];


  // 小工具：多選切換
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);


  // 篩選後資料
  const list = useMemo(() => {
      let out = chefs as Chef[];

      // 0) Region（新增）
      if (qRegion && qRegion !== "All") {
        out = out.filter((c) => c.origin?.region === qRegion);
      }

      // 1) Culture（原本就有）
      if (qCuisine) {
        out = out.filter(c => (c.cuisine || []).includes(qCuisine));
      }

      // 2) Halal verified（主廚層級）
      if (qHalalVerified) {
        out = out.filter(c => c.halalVerified === true);
      }

      // 3) Dietary（多選；AND：同一道菜需同時含所有選中的 tag）
      if (qDietary.length) {
        out = out.filter(c => {
          const menu = c.menu || [];
          return menu.some(m => {
            const tags = m.dietaryTags || [];
            return qDietary.every(t => tags.includes(t));
          });
        });
      }

      // 4) Spice（多選；OR：任一被選辣度命中即可）
      if (qSpice.length) {
        out = out.filter(c => {
          const menu = c.menu || [];
          return menu.some(m => m.spiceLevel && qSpice.includes(m.spiceLevel as any));
        });
      }

      return out;
    }, [qRegion, qCuisine, qDietary, qSpice, qHalalVerified]);

  // 取得「from $」價格（看 menu 最低價；無則顯示 priceRange）
  const getFromPrice = (c: Chef) => {
    const prices = (c.menu || [])
      .map((m) => m.price)
      .filter((n): n is number => typeof n === "number");
    if (prices.length) return `from $${Math.min(...prices)}`;
    if (c.priceRange) return c.priceRange; // 備援
    return "from $--";
  };

  // chefmap distance and information
  const [sorted, setSorted] = useState<(Chef & {distance?: number})[]>([]);
  // component 內：加一個 state
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section className="relative isolate py-16 lg:py-24 xl:py-32 min-h-[120vh] bg-menu" id="browse">
      <div className="container mx-auto">
        {/* 標題（沿用 MenuBar.tsx 的區塊語彙） */}
        <div className="mr-auto max-w-[1050px] px-4">
        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className=" text-left xl:text-left relative z-16"
        >
          {/* Title row + Map button */}
          <div className="mr-auto px-4 mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">All Chefs</h2>
              <p className="text-teal-600">Browse &amp; filter by cuisine</p>
            </div>

            <button
              onClick={() => setMapOpen(true)}
              className="ml-auto inline-flex items-center rounded-lg bg-orange text-white px-4 py-2 hover:opacity-90"
            >
              Map view
            </button>
          </div>

        </motion.div>
        </div>

        {/* 篩選（風格延續：圓角小膠囊按鈕） */}
        {/* 外層：只負責定位與靠左寬度限制 */}
        <div className="sticky top-24 z-20 mr-auto max-w-[1050px] px-4 mb-10">
          {/* 內層：實際的膠囊群，寬度跟內容一樣就不會鋪滿到右邊黑底 */}
          <div className="inline-flex w-fit flex-wrap gap-2 justify-start bg-white/60 backdrop-blur-md rounded-xl px-2 py-2 shadow">
          <button
            onClick={() => setQCuisine(null)}
            className={`px-3 py-1 rounded-full border ${!qCuisine ? "bg-orange shadow" : "hover:bg-orange"}`}
          >
            All
          </button>
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setQCuisine(c)}
              className={`px-3 py-1 rounded-full border ${qCuisine === c ? "bg-orange shadow" : "hover:bg-orange"}`}
            >
              {c}
            </button>
          ))}

          {/* —— 強制換行（保留外層 inline-flex 與漂浮） —— */}
          <div className="basis-full h-0" />

          {/* ADD ↓ Region（Pills） */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600 px-1">Region:</span>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setQRegion(r)}
                className={`px-3 py-1 rounded-full border ${
                  qRegion === r ? "bg-orange shadow" : "hover:bg-orange"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* —— 強制換行（保留外層 inline-flex 與漂浮） —— */}
          <div className="basis-full h-0" />

          {/* ADD ↓ Dietary 多選 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600 px-1">Dietary:</span>
            {/* Dietary 多選 */}
            {DIETARY.map((d) => (
              <button
                key={d}
                onClick={() => setQDietary((x) => toggleDietary(x, d))}
                className={`px-3 py-1 rounded-full border ${qDietary.includes(d) ? "bg-orange shadow" : "hover:bg-orange"}`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* ADD ↓ Spice 多選 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600 px-1">Spice:</span>
            {/* Spice 多選 */}
            {SPICE.map((s) => (
              <button
                key={s}
                onClick={() => setQSpice((x) => toggleSpice(x, s))}
                className={`px-3 py-1 rounded-full border ${qSpice.includes(s) ? "bg-orange shadow" : "hover:bg-orange"}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* <button
            onClick={() => {
              setQRegion("All");
              setQCuisine(null);
              // 若還有其他條件，一併清掉
            }}
            className="text-xs underline text-gray-500 hover:text-gray-800"
          >
            Reset filters
          </button> */}

          {/* —— 強制換行（保留外層 inline-flex 與漂浮） —— */}
          <div className="basis-full h-0" />
          
          {/* ADD ↓ Halal verified 勾選 */}
          {/* <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-gray-600 text-black px-1">Halal verified:</label>
            <button
              onClick={() => setQHalalVerified(v => !v)}
              className={`px-3 py-1 rounded-full border ${qHalalVerified ? "bg-orange shadow" : "hover:bg-orange"}`}
            >
              {qHalalVerified ? "Only verified" : "Include all"}
            </button>
          </div> */}
          </div>
        </div>

        {/* 卡片網格（完全沿用 MenuBar 的卡片風格） */}
        <div className="mr-auto max-w-[1100px] px-4">
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16"
        >
          {list.map((c) => (
            <div key={c.id} className="max-w-[300px] bg-white shadow-2xl mx-auto xl:mx-0 group">
              <div className="overflow-hidden">
                <Image
                  className="group-hover:scale-110 transition-all duration-300"
                  src={c.avatar || "/menu/item-1.png"}
                  width={300}
                  height={300}
                  alt={c.name}
                />
              </div>
              <div className="pt-[20px] pb-[28px] px-[30px]">
                <Link href={`/chef/${c.id}`}>
                  <h3 className="font-poppins text-black mb-[8px]">
                    {c.name} — {(c.cuisine || []).slice(0, 2).join(" / ")}
                  </h3>
                </Link>

                {c.origin?.region && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs mb-2">
                    {c.origin.region}
                  </span>
                )}

                <div className="text-xl font-poppins font-semibold text-orange">
                  {getFromPrice(c)}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        </div>
      </div>
      {/* // 在 return 的最後面加 Modal（放在 <section> 裡也可）： */}
      <Modal open={mapOpen} title="Chefs near Parramatta" onClose={() => setMapOpen(false)}>
        <div className="h-[420px]">
          <ChefMap chefs={list as any} radiusKm={10} />
        </div>
      </Modal>
    </section>
  );
}
