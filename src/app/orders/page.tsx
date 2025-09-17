// app/orders/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion"

type ServiceType = "pickup" | "at_home";
type OrderStatus = "awaiting_chef" | "processing" | "completed" | "cancelled";

type Order = {
  id: string;
  createdAt: string;   // when the order was created
  date: string;        // booking date (YYYY-MM-DD)
  time: string;        // booking time (HH:mm)
  people: number;
  service: ServiceType;
  chefName: string;
  chefId?: string;     // for future dynamic routing
  location?: string;   // only for at_home
  notes?: string;
  status: OrderStatus;
  total: number;       // display price (static)
};

// --- Static seed data (richer structure) ---
const ORDERS: Order[] = [
  {
    id: "ORD-2025-0007",
    createdAt: "2025-09-17 14:12",
    date: "2025-09-20",
    time: "18:30",
    people: 4,
    service: "pickup",
    chefName: "Amy Lin",
    chefId: "amy-lin",
    status: "awaiting_chef",
    total: 92,
    notes: "No chilli, add one side dish if possible."
  },
  {
    id: "ORD-2025-0006",
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
    notes: "One vegetarian set; disposable cutlery if available."
  },
  {
    id: "ORD-2025-0005",
    createdAt: "2025-09-10 19:40",
    date: "2025-09-12",
    time: "19:00",
    people: 3,
    service: "pickup",
    chefName: "Maria Rossi",
    chefId: "maria-rossi",
    status: "completed",
    total: 76,
    notes: "Perfect portions. Will order again!"
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
    notes: "Cancelled due to schedule change (informed the chef)."
  },
  // a couple more to make the page feel full
  {
    id: "ORD-2025-0003",
    createdAt: "2025-08-20 11:25",
    date: "2025-08-23",
    time: "13:00",
    people: 6,
    service: "pickup",
    chefName: "Hassan Ali",
    chefId: "hassan-ali",
    status: "completed",
    total: 168,
    notes: "Family lunch; extra pita if possible."
  },
  {
    id: "ORD-2025-0002",
    createdAt: "2025-08-10 08:40",
    date: "2025-08-12",
    time: "20:00",
    people: 2,
    service: "at_home",
    chefName: "Sofia Gomez",
    chefId: "sofia-gomez",
    status: "completed",
    total: 98,
    location: "Westmead NSW",
    notes: "Anniversary dinner; mild spice."
  },
  {
    id: "ORD-2025-0001",
    createdAt: "2025-08-01 17:05",
    date: "2025-08-02",
    time: "18:30",
    people: 3,
    service: "pickup",
    chefName: "Akira Tanaka",
    chefId: "akira-tanaka",
    status: "completed",
    total: 84,
    notes: "Add extra karaage if available."
  }
];

// --- Status badge style/labels (English) ---
const statusMeta: Record<OrderStatus, { label: string; className: string }> = {
  awaiting_chef: { label: "Waiting for Chef Confirmation", className: "bg-amber-100 text-amber-800 border-amber-200" },
  processing:    { label: "In progress",                    className: "bg-blue-100 text-blue-800 border-blue-200"   },
  completed:     { label: "Completed",                      className: "bg-green-100 text-green-800 border-green-200"},
  cancelled:     { label: "Cancelled",                      className: "bg-gray-100 text-gray-700 border-gray-200"  },
};

export default function OrdersPage() {
  const [tab, setTab] = useState<"active" | "history">("active");

  // split into Active vs History (richer UX from copy file, English copy + page style)
  const { active, history } = useMemo(() => {
    const active = ORDERS.filter(o => o.status === "awaiting_chef" || o.status === "processing");
    const history = ORDERS.filter(o => o.status === "completed" || o.status === "cancelled");
    return { active, history };
  }, []);

  const list = tab === "active" ? active : history;

  return (
    <main className="py-12 xl:py-24 bg-menu">
      <div className="container mx-auto max-w-[1000px]">
        {/* Top bar (keeps the page.tsx vibe) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold">My Orders</h1>
          <div className="flex items-center gap-3">
            <Link href="/browse" className="rounded-lg border px-4 py-2 bg-white text-black 
            hover:bg-orange hover:text-black transition-colors">
              ← Back to browse
            </Link>
          </div>
        </motion.div>

        {/* Tabs: Active / History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex rounded-xl border bg-white p-1 shadow"
        >
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 rounded-lg text-sm ${tab === "active" ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            Active ({active.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 rounded-lg text-sm ${tab === "history" ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            History ({history.length})
          </button>
        </motion.div>

        {/* Order list */}
        <div className="grid gap-4">
          {list.map((o, i) => {
            const s = statusMeta[o.status];
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }} // i 是 map 的索引
                className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 border"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Left: main info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500">#{o.id}</span>
                      <span className={`text-xs border rounded-full px-2 py-0.5 ${s.className}`}>{s.label}</span>
                    </div>
                    <div className="mt-1 font-semibold">{o.chefName}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {o.date} {o.time} · {o.people} people · {o.service === "pickup" ? "Pickup" : "At home"}
                      {o.location ? ` · ${o.location}` : ""}
                    </div>
                    {o.notes && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        Notes: {o.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-orange">${o.total}</span>

                    {/* View chef (placeholder to /browse for now) */}
                    <Link
                      href="/browse"
                      className="rounded-lg border px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
                    >
                      View chef
                    </Link>

                    {o.status === "awaiting_chef" && (
                      <>
                        <button className="rounded-lg bg-black text-white px-3 py-1.5 text-sm hover:opacity-90">
                          Cancel request
                        </button>
                        <button className="rounded-lg px-3 py-1.5 text-sm border bg-white hover:bg-gray-50">
                          Message chef
                        </button>
                      </>
                    )}
                    {o.status === "processing" && (
                      <>
                        <button className="rounded-lg bg-black text-white px-3 py-1.5 text-sm hover:opacity-90">
                          Contact chef
                        </button>
                        <button className="rounded-lg px-3 py-1.5 text-sm border bg-white hover:bg-gray-50">
                          Update notes
                        </button>
                      </>
                    )}
                    {o.status === "completed" && (
                      <>
                        <button className="rounded-lg px-3 py-1.5 text-sm border bg-white hover:bg-gray-50">
                          Rebook
                        </button>
                        <button className="rounded-lg px-3 py-1.5 text-sm border bg-white hover:bg-gray-50">
                          Leave a review
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  <span>Created: {o.createdAt}</span>
                  <span>·</span>
                  <span>Updated: —</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <p className="text-gray-600">
              {tab === "active" ? "You have no active orders right now." : "No past orders yet."}
            </p>
            <div className="mt-4">
              <Link href="/browse" className="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90">
                Browse chefs
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
