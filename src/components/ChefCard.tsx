"use client";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  avatar: string;
  cuisine: string[];
  priceRange: "$" | "$$" | "$$$";
  rating: number;
  location: string;
};

export default function ChefCard(p: Props) {
  return (
    <Link
      href={`/chef/${p.id}`}
      className="group block rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white"
    >
      <div className="aspect-[4/3] bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
      </div>
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{p.name}</h3>
          <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">{p.priceRange}</span>
        </div>
        <p className="text-sm text-gray-600">{p.cuisine.join(" · ")}</p>
        <p className="text-sm text-gray-600">{p.location}</p>
        <p className="text-sm">⭐ {p.rating.toFixed(1)}</p>
      </div>
    </Link>
  );
}
