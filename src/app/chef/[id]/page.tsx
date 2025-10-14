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
// review region
import { useEffect, useMemo, useState } from "react";
import { SEED_REVIEWS, type Review } from "@/data/reviews";




// Small helper: 1–5 dot scale for flavor profile
function FlavorDots({ label, value }: { label: string; value?: number }) {
  const num = Number(value ?? 0);
  const v = Math.min(Math.max(isNaN(num) ? 0 : num, 0), 5);

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="w-28 shrink-0 text-sm text-gray-700">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < v;
          return (
            <span
              key={i}
              aria-hidden="true"
              className={[
                "inline-block rounded-full h-2 w-2",
                filled ? "bg-[#f59e0b]" : "bg-white border border-[#f59e0b]",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}

// Small helper: pill tags
function Pills({ items, emptyText }: { items?: string[]; emptyText?: string }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">{emptyText ?? "—"}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((x) => (
        <span key={x} className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs">
          {x}
        </span>
      ))}
    </div>
  );
}

// 固定用 UTC，手動組 YYYY/MM/DD，避免 SSR/CSR locale 差異
function formatDateYMD(iso: string) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}/${m}/${day}`; // e.g. 2025/08/10
}

// calculate the rating star
function useChefReviewStats(chefId: string) {
  const [local, setLocal] = useState<Review[]>([]);

  const readLocal = () => {
    const key = `reviews:${chefId}`;
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    setLocal(list);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    readLocal();

    // 同頁面也會收到（我們會手動 dispatch）
    const onCustom = () => readLocal();

    // 其他分頁修改時會觸發 storage 事件
    const onStorage = (e: StorageEvent) => {
      if (e.key === `reviews:${chefId}`) readLocal();
    };

    window.addEventListener("reviews-changed", onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("reviews-changed", onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [chefId]);

  const merged = useMemo(() => {
    const seed = SEED_REVIEWS[chefId] ?? [];
    const all = [...local, ...seed];
    return all.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [chefId, local]);

  const avg = merged.length
    ? merged.reduce((s, r) => s + r.rating, 0) / merged.length
    : 0;

  return { avg, count: merged.length };
}


// read local review data
function ReviewsList({ chefId }: { chefId: string }) {
  const [local, setLocal] = useState<Review[]>([]);

  // 讀 localStorage（只在 client）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `reviews:${chefId}`;
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    setLocal(list);
  }, [chefId]);

  // 刪除本地評論
  const deleteLocalReview = (id: string) => {
    const key = `reviews:${chefId}`;
    const list: Review[] = JSON.parse(localStorage.getItem(key) || "[]");
    const next = list.filter((r) => r.id !== id);
    localStorage.setItem(key, JSON.stringify(next));
    setLocal(next);                                 // 立即刷新本列表
    window.dispatchEvent(new Event("reviews-changed")); // 通知抬頭星等重算
  };

  // 合併：localStorage（最新） + 種子
  const merged = useMemo(() => {
    const seed = SEED_REVIEWS[chefId] ?? [];
    const all = [...local, ...seed];
    return all.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [chefId, local]);

  if (merged.length === 0) {
    return <p className="text-gray-600">No reviews yet.</p>;
  }

  return (
    <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-2">
      {merged.map((r) => {
        const isLocal = local.some((x) => x.id === r.id); // 只有本地的能刪
        return (
        <div key={r.id} className="rounded-xl border p-4 flex gap-3 items-start">
          {/* avatar 先用姓名縮寫 */}
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
            {r.author.split(" ").map(s => s[0]).join("").slice(0,2)}
          </div>
          
          {/* right side */}
          <div className="min-w-0 flex-1">
            {/* ← 這一排：左邊作者，右邊固定寬的日期 */}
            <div className="flex items-center gap-3">
              <div className="font-medium truncate">{r.author}</div>
              <span className="ml-auto text-xs text-gray-500 tabular-nums min-w-[88px] text-right">
                {formatDateYMD(r.createdAt)}
              </span>
              {isLocal && (
                  <button
                    onClick={() => deleteLocalReview(r.id)}
                    className="ml-2 rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                    title="Delete this review"
                  >
                    Delete
                  </button>
                )}
            </div>

            <div className="mt-0.5 text-orange">
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </div>
            <p className="mt-1 text-sm text-gray-700">{r.text}</p>
            {r.orderId && (
              <div className="mt-1 text-xs text-gray-500">From order #{r.orderId}</div>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}



export default function ChefProfile({ params }: { params: { id: string } }) 
{
  const router = useRouter();
  const { mode } = useMode();

  const chef = useMemo(() => chefs.find((c) => c.id === params.id), [params.id]);

  // ✅ hooks 永遠同順序：這裡用 params.id
  const { avg, count } = useChefReviewStats(params.id);

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
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">{chef.name}</h1>

                  {/* Origin badges：更小、更緊 */}
                  {(chef.origin?.country || chef.origin?.region || chef.origin?.city) && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {chef.origin?.country && (
                        <span className="inline-flex items-center rounded-full border px-2 py-2 text-[10px] leading-none">
                          {chef.origin.country}
                        </span>
                      )}
                      {chef.origin?.region && (
                        <span className="inline-flex items-center rounded-full border px-2 py-2 text-[10px] leading-none">
                          {chef.origin.region}
                        </span>
                      )}
                      {chef.origin?.city && (
                        <span className="inline-flex items-center rounded-full border px-2 py-2 text-[10px] leading-none">
                          {chef.origin.city}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Cuisine · Location · Rating 同行 */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="truncate">{chef.cuisine.join(" · ")}</span>
                    <span className="text-gray-300">•</span>
                    <span className="truncate">{chef.location}</span>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center gap-1 text-orange font-semibold">
                      <span aria-hidden>★</span>
                      {avg.toFixed(1)} <span className="text-gray-500 font-normal">({count})</span>
                    </span>
                  </div>
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
            <p className="text-gray-700 leading-relaxed text-sm">
              {chef.bio ?? "Home-style dishes with seasonal ingredients."}
            </p>

            {/* Origin & Region */}
            {(chef.origin?.country || chef.origin?.region || chef.origin?.city) && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Origin &amp; Region</h3>
                <div className="flex flex-wrap gap-2">
                  {chef.origin?.country && (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs">
                      {chef.origin.country}
                    </span>
                  )}
                  {chef.origin?.region && (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs">
                      {chef.origin.region}
                    </span>
                  )}
                  {chef.origin?.city && (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs">
                      {chef.origin.city}
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* Regional notes */}
            {(chef.regionalNotes && chef.regionalNotes.length > 0) && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Regional notes</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {chef.regionalNotes.map((n: string, i: number) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Flavor profile */}
            {chef.flavorProfile && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Flavor profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FlavorDots label="Salty"      value={chef.flavorProfile.salty} />
                  <FlavorDots label="Sweet"      value={chef.flavorProfile.sweet} />
                  <FlavorDots label="Spicy"      value={chef.flavorProfile.spicy} />
                  <FlavorDots label="Herbaceous" value={chef.flavorProfile.herbaceous} />
                  <FlavorDots label="Umami"      value={chef.flavorProfile.umami} />
                  <FlavorDots label="Oily"       value={chef.flavorProfile.oily} />
                </div>
              </section>

            )}

            {/* Specialties */}
            {(chef.specialties && chef.specialties.length > 0) && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                <Pills items={chef.specialties} />
              </section>
            )}

            {/* Techniques */}
            {(chef.techniques && chef.techniques.length > 0) && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Techniques</h3>
                <Pills items={chef.techniques} />
              </section>
            )}

            {/* === Collapsible Full Menu === */}
            <section className="mt-10">
              <details className="group rounded-2xl border p-4 open:shadow-sm">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      Full menu
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      expand
                    </span>
                  </div>
                </summary>

                {/* 原本你的 Menu 列表從這裡開始搬進來 */}
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
              </details>
            </section>

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

            


        </div>
        {/* // 在 return 裡「Reserve」卡片後面，加： */}
        <motion.div
          variants={fadeIn("up", 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="max-w-[1000px] mx-auto mt-8 bg-white shadow-2xl rounded-2xl p-[24px]"
        >
          <h2 className="mb-4">Reviews</h2>

          <ReviewsList chefId={chef.id} />
        </motion.div>
      </div>
    </main>
  );
}
