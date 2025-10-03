"use client";
import { MapContainer, TileLayer, Marker, Circle, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const HOME = { lat: -33.8138, lng: 151.0010 }; // Parramatta center

// 簡易 Haversine（公里）
function km(a:{lat:number;lng:number}, b:{lat:number;lng:number}) {
  const R=6371, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

// 修正 Leaflet 預設圖示在 Next 中顯示問題
const icon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconAnchor: [12, 41],
});

// ✅ 簡易「我的位置」藍點（不用圖片）
const myIcon = L.divIcon({
  className: "",                 // 清空預設 class
  html: '<div style="width:12px;height:12px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 0 2px rgba(59,130,246,.3)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const makeChefIcon = (url?: string) =>
  L.divIcon({
    className: "", // 清掉預設樣式
    html: `
      <div style="
        width:34px;height:34px;border-radius:50%;
        background:#fff;display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 6px rgba(0,0,0,.25);
      ">
        <img src="${url || "/placeholder.png"}"
             style="width:30px;height:30px;border-radius:50%;object-fit:cover" />
      </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],  // 中心點
    popupAnchor: [0, -18],
  });

type Chef = {
  id: string; name: string; avatar?: string; cuisine?: string[];
  lat?: number; lng?: number; location?: string;
};

export default function ChefMap({
  chefs, radiusKm = 10,
  onSorted,
}: { chefs: Chef[]; radiusKm?: number; onSorted?: (sorted: (Chef & {distance?: number})[]) => void }) {

  const [me, setMe] = useState<{lat:number;lng:number}|null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setMe(null), // 拒絕權限時，就用預設中心
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const center = me ?? HOME;

  const withDistance = useMemo(() => {
    const base = chefs.filter(c => typeof c.lat==="number" && typeof c.lng==="number");
    const list = base.map(c => ({ ...c, distance: km(center, {lat:c.lat!, lng:c.lng!}) }))
                     .sort((a,b) => (a.distance ?? 0) - (b.distance ?? 0));
    onSorted?.(list);
    return list;
  }, [chefs, center, onSorted]);

  const inRadius = withDistance.filter(c => (c.distance ?? Infinity) <= radiusKm);

  return (
    <div className="rounded-2xl overflow-hidden shadow">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: 380, width: "100%" }}>
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
        {/* 你的座標（若有） */}
        {me && (
            <>
                <Marker position={[me.lat, me.lng]} icon={myIcon}>
                <Popup>You are here</Popup>
                </Marker>
                <Circle
                center={[me.lat, me.lng]}
                radius={radiusKm * 1000}
                pathOptions={{ color: "#f97316", fillOpacity: 0.15 }}
                />
            </>
            )}
        {/* Chef 標記 */}
        {inRadius.map(c => (
          <Marker key={c.id} position={[c.lat!, c.lng!]} icon={makeChefIcon(c.avatar)}>
            {/* hover 卡片（頭像 + 名稱 + 菜系） */}
            <Tooltip
            direction="top"
            offset={[0, -14]}           // 和頭像拉開一點
            opacity={1}
            sticky                      // 滑鼠移動時跟著游標，體驗更好
            className="chef-tip"        // ⬅ 用這個 class 來客製尺寸與外觀
            >
            <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                src={c.avatar || "/placeholder.png"}
                alt={c.name}
                className="h-8 w-8 rounded-full object-cover border"
                />
                <div className="text-xs leading-tight">
                <div className="font-semibold">{c.name}</div>
                <div className="text-gray-600">{(c.cuisine || []).join(" / ")}</div>
                </div>
            </div>
            </Tooltip>  

            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{c.name}</div>
                <div className="text-gray-600">{(c.cuisine||[]).join(" / ")}</div>
                {typeof c.distance === "number" && <div className="mt-1">{c.distance.toFixed(1)} km away</div>}
                <Link href={`/chef/${c.id}`} className="mt-2 inline-block rounded border bg-black !text-white hover:bg-orange px-2 py-1">View</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
