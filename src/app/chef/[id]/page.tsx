"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { chefs } from "@/data/chefs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";  
import "swiper/css";
import "swiper/css/pagination";     
import ReservationForm from "@/components/ReservationForm";
import { useMode } from "@/components/mode-context";
// ← 跟 browse 一樣引入 framer-motion 與 fadeIn
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/variants";

export default function ChefProfile({ params }: { params: { id: string } }) 
{
  const router = useRouter();
  const { mode } = useMode();

  const chef = chefs.find(c => c.id === params.id);
  if (!chef) return <main className="p-6">Chef not found.</main>;

  return (
    <main className="py-12 xl:py-24 bg-menu">
      <div className="container mx-auto">
        
        {/* ▶ 新增：行動列（固定在頁面上方；保持白卡+陰影風格） */}
        <motion.div
          variants={fadeIn("down", 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="max-w-[1000px] mx-auto sticky top-0 z-20"
        >
          <div className="flex items-center justify-between bg-white/95 backdrop-blur rounded-2xl shadow-2xl px-[20px] py-[10px] mb-4">
            <button
              onClick={() => router.back()}
              className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50"
            >
              ← Back
            </button>

            <div className="flex items-center gap-2">
              {/* Show Edit only when Chef Mode is active */}
              {mode === "chef" && (
              <button
              onClick={() => router.push(`/chefs/manage?id=${chef.id}`)}
              className="text-sm px-3 py-1.5 rounded-lg border bg-black text-white hover:opacity-90"
              >
              Edit
              </button>
              )}
              <Link
              href="#reserve"             // 捲到本頁預約表單（靜態）
              className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:opacity-90">
              Book now
            </Link>
            </div>
          </div>
        </motion.div>
        
        {/* 頁首：主圖 + 基本資訊 */}
        <motion.div
          variants={fadeIn("up", 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="max-w-[1000px] mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* 左邊：廚師照片 */}
            <div className="flex items-center justify-center p-4">
                <img
                src={chef.avatar}
                alt={chef.name}
                className="w-full md:w-[400px] h-[300px] object-cover rounded-2xl"
                />
                <div className="px-[30px] py-[24px]">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{chef.name}</h1>
                <p className="text-gray-600 mb-2">{chef.cuisine.join(" · ")} · {chef.location}</p>
                <p className="text-orange font-semibold">⭐ {chef.rating?.toFixed?.(1) ?? "4.5"}</p>
            </div>
            </div>
            {/* 右邊：dishes 相簿 */}
            <div className="p-4">
            <h2 className="text-xl font-bold mb-3">{chef.name}’s Dishes</h2>
            <div className="relative">
            <Swiper
                spaceBetween={16}
                slidesPerView={2}
                grabCursor={true}
                modules={[Pagination]}                    // ⬅️ 啟用模組
                pagination={{ clickable: true }}          // ⬅️ 顯示圓點，可點擊
                className="rounded-lg pb-8"               // ⬅️ 底部留空，避免圓點被遮
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024:{ slidesPerView: 2 }               // 桌面可顯示更多張（可調）
            }}
            >
                {chef.dishes?.map((dish: string, i: number) => (
                <SwiperSlide key={i}>
                    <img
                    src={`${chef.dishlocate}/${dish}`}
                    alt={`Dish ${i + 1}`}
                    className="w-full h-[220px] object-cover rounded-lg shadow"
                    />
                </SwiperSlide>
                ))}
            </Swiper>
            </div>
            <div className="dishes-pagination flex justify-center gap-2 mt-2"></div>
            </div>
        </motion.div>

        {/* 內容：主廚故事 + 菜單 */}
        <div className="max-w-[1000px] mx-auto mt-8 grid gap-8 md:grid-cols-2">
          <motion.div
            variants={fadeIn("up", 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="bg-white shadow-2xl rounded-2xl p-[24px]"
          >
            <h2 className="mb-3">About the chef</h2>
            <p className="text-gray-700 leading-relaxed">{chef.bio ?? "Home-style dishes with seasonal ingredients."}</p>
            <br></br>
            <h2 className="mb-3">Menu</h2>
            <ul className="divide-y">
              {(chef.menu ?? []).map((m: any, i: number) => (
                <li key={i} className="py-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{m.title}</p>
                    <p className="text-sm text-gray-600">{m.desc}</p>
                  </div>
                  <span className="font-semibold text-orange">${m.price}</span>
                </li>
              ))}
            </ul>
          </motion.div>

                {/* Reserve */}
            {/* <div id="reserve" className="max-w-[500px] mx-auto mt-8 md:col-span-2"> */}
              <motion.div
                id="reserve"
                variants={fadeIn("up", 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.1 }}
                className="bg-white shadow-2xl rounded-2xl p-[24px]"
              >
                <h2 className="mb-6">Reserve with {chef.name}</h2>

                {/* 內部橫排：左表單 / 右側說明（或顯示價格、小計等） */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
                  {/* 左邊：表單 */}
                  <div>
                    <ReservationForm chefId={chef.id} chefName={chef.name} />
                  </div>
                {/* </div> */}
              </motion.div>
            {/* </div> */}


          {/* <div className="bg-white shadow-2xl rounded-2xl p-[24px]">
            <h2 className="mb-3">Menu</h2>
            <ul className="divide-y">
              {(chef.menu ?? []).map((m: any, i: number) => (
                <li key={i} className="py-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{m.title}</p>
                    <p className="text-sm text-gray-600">{m.desc}</p>
                  </div>
                  <span className="font-semibold text-orange">${m.price}</span>
                </li>
              ))}
            </ul>
          </div> */}

        </div>
      </div>
    </main>
  );
}
