// app/orders/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ServiceType = "pickup" | "at_home";
type OrderStatus =
  | "awaiting_chef"   // 等待主廚確認
  | "processing"      // 已確認/處理中
  | "completed"       // 已完成
  | "cancelled";      // 已取消

type Order = {
  id: string;
  createdAt: string;     // ISO or friendly string
  date: string;          // 預約日期
  time: string;          // 預約時間
  people: number;
  service: ServiceType;
  chefName: string;
  chefId?: string;       // 之後可導到實際的 chef 動態頁
  location?: string;     // 地址（在家服務時可留）
  notes?: string;
  status: OrderStatus;
  total: number;         // 總金額 (靜態展示)
};

// --- 假資料（可自由增減） ---
const ORDERS: Order[] = [
  {
    id: "ORD-2025-0001",
    createdAt: "2025-09-17 14:12",
    date: "2025-09-20",
    time: "18:30",
    people: 4,
    service: "pickup",
    chefName: "Amy Lin",
    chefId: "amy-lin",
    status: "awaiting_chef",
    total: 92,
    notes: "無辣、希望加一份小菜。"
  },
  {
    id: "ORD-2025-0002",
    createdAt: "2025-09-12 10:05",
    date: "2025-09-22",
    time: "12:00",
    people: 2,
    service: "at_home",
    chefName: "Raj Singh",
    chefId: "raj-singh",
    status: "processing",
    total: 120,
    location: "Parramatta NSW",
    notes: "素食一份；可否自備一次性餐具？"
  },
  {
    id: "ORD-2025-0003",
    createdAt: "2025-09-05 19:40",
    date: "2025-09-07",
    time: "19:00",
    people: 3,
    service: "pickup",
    chefName: "Maria Rossi",
    chefId: "maria-rossi",
    status: "completed",
    total: 76,
    notes: "太棒了，會再回購！"
  },
  {
    id: "ORD-2025-0004",
    createdAt: "2025-08-29 09:18",
    date: "2025-08-31",
    time: "18:00",
    people: 5,
    service: "at_home",
    chefName: "Sakura Tanaka",
    chefId: "sakura-tanaka",
    status: "cancelled",
    total: 0,
    notes: "臨時有事取消（已與主廚溝通）"
  }
];

// --- 樣式與文案 ---
const statusMeta: Record<OrderStatus, { label: string; className: string }> = {
  awaiting_chef: { label: "等待主廚確認", className: "bg-amber-100 text-amber-800 border-amber-200" },
  processing:    { label: "處理中",       className: "bg-blue-100 text-blue-800 border-blue-200" },
  completed:     { label: "已完成",       className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:     { label: "已取消",       className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export default function OrdersPage() {
  const [tab, setTab] = useState<"active" | "history">("active");

  const { active, history } = useMemo(() => {
    const active = ORDERS.filter(o => o.status === "awaiting_chef" || o.status === "processing");
    const history = ORDERS.filter(o => o.status === "completed" || o.status === "cancelled");
    return { active, history };
  }, []);

  const list = tab === "active" ? active : history;

  return (
    <main className="py-10 bg-menu min-h-[70vh]">
      <div className="container mx-auto max-w-[1000px]">
        {/* 頂部工具列 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My orders</h1>
          <div className="flex items-center gap-3">
            <Link href="/browse" className="rounded-lg border px-4 py-2 bg-white hover:bg-gray-50">
              ← Back to browse
            </Link>
          </div>
        </div>

        {/* 分頁（進行中 / 歷史） */}
        <div className="mb-6 inline-flex rounded-xl border bg-white p-1 shadow">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 rounded-lg text-sm ${tab === "active" ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            進行中 ({active.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 rounded-lg text-sm ${tab === "history" ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            歷史紀錄 ({history.length})
          </button>
        </div>

        {/* 清單 */}
        <div className="grid gap-4">
          {list.map((o) => {
            const s = statusMeta[o.status];
            return (
              <div key={o.id} className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* 左：主資訊 */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500">#{o.id}</span>
                      <span className={`text-xs border rounded-full px-2 py-0.5 ${s.className}`}>{s.label}</span>
                    </div>
                    <div className="mt-1 font-semibold">{o.chefName}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {o.date} {o.time} · {o.people} 人 · {o.service === "pickup" ? "自取" : "到府"}
                      {o.location ? ` · ${o.location}` : ""}
                    </div>
                    {o.notes && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        備註：{o.notes}
                      </p>
                    )}
                  </div>

                  {/* 右：動作區 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-orange">${o.total}</span>
                    {/* 之後可改連到實際 chef 動態頁；暫時導向 /browse */}
                    <Link
                      href="/browse"
                      className="rounded-lg border px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
                    >
                      查看主廚
                    </Link>
                    {o.status === "awaiting_chef" && (
                      <button className="rounded-lg bg-black text-white px-3 py-1.5 text-sm hover:opacity-90">
                        取消申請
                      </button>
                    )}
                    {o.status === "processing" && (
                      <button className="rounded-lg bg-black text-white px-3 py-1.5 text-sm hover:opacity-90">
                        聯絡主廚
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  <span>建立：{o.createdAt}</span>
                  <span>·</span>
                  <span>更新：—</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 空狀態 */}
        {list.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">目前沒有{tab === "active" ? "進行中" : "歷史"}的訂單</p>
            <div className="mt-4">
              <Link href="/browse" className="rounded-lg bg-black text-white px-4 py-2">去逛逛主廚</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
