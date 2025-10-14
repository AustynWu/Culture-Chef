"use client";

import * as React from "react";

export default function ScrollPills({
  label,
  items,
  value,
  onChange,
}: {
  label?: string;
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const scrollToCenter = (btn: HTMLButtonElement | null) => {
    const wrap = wrapRef.current;
    if (!wrap || !btn) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const delta =
      btn.offsetLeft - (wrap.clientWidth / 2 - btn.clientWidth / 2);
    wrap.scrollTo({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2">
      {label ? (
        <span className="text-xs text-gray-600 px-1 shrink-0">{label}</span>
      ) : null}

      {/* 外層加遮罩：左右淡出效果 */}
      <div className="relative flex-1">
        {/* 捲動容器 */}
        <div
          ref={wrapRef}
          className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pr-1"
        >
          {items.map((r) => {
            const active = value === r;
            return (
              <button
                key={r}
                onClick={(e) => {
                  onChange(r);
                  scrollToCenter(e.currentTarget);
                }}
                className={`px-3 py-1 rounded-full border transition shrink-0
                  ${active ? "bg-orange text-white border-orange" : "hover:bg-orange/10"}
                `}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* 左右漸層遮罩（只做視覺提示，不擋點擊） */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}

/* 隱藏原生卷軸（可放到 globals.css）
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
