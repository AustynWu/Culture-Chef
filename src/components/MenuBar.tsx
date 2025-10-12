"use client";
import Link from "next/link";
import Image from "next/image";
// ADD ↓ 新增兩行
import { chefsWithGeo as chefs } from "@/data/chefs";
import { DEMO_USERS } from "@/data/users";
import { motion } from "framer-motion";

import { fadeIn } from "../../variants";
import { IoIosArrowRoundForward } from "react-icons/io";

// 由 chefs 資料動態產卡：標題、價格、圖片、href 都出自同一筆 chef
const getFromPrice = (chef: any) => {
  const prices = (chef.menu || []).map((m: any) => m.price).filter((n: any) => typeof n === "number");
  return prices.length ? `from $${Math.min(...prices)}` : "from $--";
};

const getChefImage = (chef: any) => {
  // 優先選菜圖：/dishlocate + 隨機一張 dishes；否則用 avatar
  const list = Array.isArray(chef.dishes) && chef.dishes.length ? chef.dishes : [];
  if (chef.dishlocate && list.length) {
    const pick = list[Math.floor(Math.random() * list.length)];
    return `${chef.dishlocate}/${pick}`;
  }
  return chef.avatar || "/menu/item-1.png";
};

const currentUser = DEMO_USERS[0]; // 或用你已有的 currentUser / pickRandomDemoUser()

// 最符合目前使用者偏好
const scored = (chefs as any[]).map((c) => {
  const d = c.menu || [];
  const wantsVegan = currentUser.dietary?.includes("vegan");
  const wantsHalal = currentUser.dietary?.includes("halal");
  const wantsNone  = currentUser.spiceTolerance === "none";

  const score =
    (wantsVegan ? (d.some((x:any)=>x.dietaryTags?.includes("vegan")) ? 2 : 0) : 0) +
    (wantsHalal ? (d.some((x:any)=>x.dietaryTags?.includes("halal")) ? 2 : 0) : 0) +
    (wantsNone  ? (d.some((x:any)=>x.spiceLevel === "none") ? 1 : 0) : 0);

  return { chef: c, score };
});

const top4 = scored.sort((a,b)=>b.score-a.score).slice(0,4).map(({chef:c})=>c);

const cards = top4.map((c) => ({
  id: c.id,
  title: `${c.name} — ${(c.cuisine || []).slice(0, 2).join(" / ")}`,
  price: getFromPrice(c),
  href: `/chef/${c.id}`,
  img: getChefImage(c),
  _chef: c,
}));


const MenuBar = () => {
  return (
    <section className=" relative py-12 xl:py-24 bg-menu" id="menu">
      <div className="container mx-auto">
        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className=" max-w-[570px] mx-auto text-center xl:text-right"
        >
          <div>
            <h2 className="mb-3"> Featured Chefs</h2>
            {/* ADD ↓ 顯示目前使用者；這裡先用 users[0]，若你有 currentUser 就換成它 */}
          <div className="text-xl text-gray-600 mb-2 xl:text-right">
            Browsing as: <span className="font-semibold">{currentUser.name}</span> — {currentUser.notes}
          </div>
            <Link
              className="text-green flex justify-center items-center mb-16 xl:justify-end"
              href="/browse"
            >
              view all
              <IoIosArrowRoundForward className="text-3xl" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 gap-[30px] md:grid-cols-3 md:gap-[15px] xl:grid-cols-4"
        >
          {cards.map((item, index) => {
            const chef = item._chef;

            // 極簡配對（沿用你現在的邏輯）
            let tagText = "Explore menu";
            if (chef && Array.isArray(chef.menu)) {
              const dishes = chef.menu;
              const wantsVegan = currentUser.dietary?.includes("vegan");
              const wantsHalal = currentUser.dietary?.includes("halal");
              const wantsNone  = currentUser.spiceTolerance === "none";

              const has = {
                vegan: dishes.some((d: any) => d.dietaryTags?.includes("vegan")),
                halal: dishes.some((d: any) => d.dietaryTags?.includes("halal")),
                none:  dishes.some((d: any) => d.spiceLevel === "none"),
                veganAndNone: dishes.some((d: any) => d.dietaryTags?.includes("vegan") && d.spiceLevel === "none"),
                halalAndMildOrNone: dishes.some((d: any) => d.dietaryTags?.includes("halal") && (d.spiceLevel === "none" || d.spiceLevel === "mild")),
              };

              if (wantsVegan && wantsNone && has.veganAndNone) tagText = "Good match: vegan • no-spicy";
              else if (wantsVegan && has.vegan)                tagText = "Close match: vegan";

              if (wantsHalal && wantsNone && has.halalAndMildOrNone) tagText = "Good match: halal • mild/none";
              else if (wantsHalal && has.halal)                      tagText = "Close match: halal";

              if (!wantsVegan && !wantsHalal && wantsNone && has.none) tagText = "Close match: no-spicy";
            }

            return (
              <div key={index} className="max-w-[270px] bg-white shadow-2xl  mx-auto xl:mx-0 group">
                <div className="overflow-hidden w-[270px] h-[270px] rounded-xl">
                  <Image
                    className="group-hover:scale-110 transition-all duration-300 object-cover w-full h-full"
                    src={item.img}
                    width={270}
                    height={270}
                    alt={item.title}
                  />
                </div>
                <div className="pt-[20px] pb-[28px] px-[30px]">
                  <Link href={item.href}>
                    <h3 className=" font-poppins text-black mb-[14px]">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="text-[11px] text-gray-600 mb-1">{tagText}</div>
                  <div className="text-xl font-poppins font-semibold text-orange ">
                    {item.price}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuBar;
