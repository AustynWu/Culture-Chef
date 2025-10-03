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


// 最小型別（避免你的 data 欄位沒有就報錯）
type MenuItem = { title?: string; desc?: string; price?: number };
type Chef = {
  id: string;
  name: string;
  avatar?: string;
  cuisine?: string[];
  location?: string;
  rating?: number;
  priceRange?: "$" | "$$" | "$$$";
  menu?: MenuItem[];
};

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

  const [qCuisine, setQCuisine] = useState<string | null>(null);

  // 篩選後資料
  const list = useMemo(() => {
    const data = chefs as Chef[];
    if (!qCuisine) return data;
    return data.filter((c) => (c.cuisine || []).includes(qCuisine));
  }, [qCuisine]);

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
    <section className="relative isolate  py-12 xl:py-24 bg-menu" id="browse">
      <div className="container mx-auto">
        {/* 標題（沿用 MenuBar.tsx 的區塊語彙） */}
        <div className="mr-auto max-w-[950px] px-4">
        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className=" text-left xl:text-left relative z-10"
        >
          {/* Title row + Map button */}
          <div className="mr-auto px-4 mb-6 flex items-end justify-between">
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
        <div className="sticky top-24 z-20 mr-auto max-w-[950px] px-4 mb-10">
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
          </div>
        </div>

        {/* 卡片網格（完全沿用 MenuBar 的卡片風格） */}
        <div className="mr-auto max-w-[950px] px-4">
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-10"
        >
          {list.map((c) => (
            <div key={c.id} className="max-w-[270px] bg-white shadow-2xl mx-auto xl:mx-0 group">
              <div className="overflow-hidden">
                <Image
                  className="group-hover:scale-110 transition-all duration-300"
                  src={c.avatar || "/menu/item-1.png"}
                  width={270}
                  height={270}
                  alt={c.name}
                />
              </div>
              <div className="pt-[20px] pb-[28px] px-[30px]">
                <Link href={`/chef/${c.id}`}>
                  <h3 className="font-poppins text-black mb-[14px]">
                    {c.name} — {(c.cuisine || []).slice(0, 2).join(" / ")}
                  </h3>
                </Link>
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
