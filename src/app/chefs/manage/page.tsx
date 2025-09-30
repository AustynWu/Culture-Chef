// =============================
// File: app/chefs/manage/page.tsx (single unified page: create if no id, edit if ?id=...)
// =============================
"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChefEditor from "@/components/chefEditor";
import { chefs } from "@/data/chefs";


const EMPTY = {
id: "",
name: "",
avatar: "/placeholder/chef.jpg",
cuisine: [],
location: "",
rating: 4.5,
priceRange: "$$",
bio: "",
gallery: [],
menu: [],
dishlocate: "/uploads",
dishes: [],
};


export default function Manage() {
const router = useRouter();
const sp = useSearchParams();
const id = sp.get("id");


const initialChef = useMemo(() => {
if (!id) return EMPTY; // create-mode
return chefs.find((c) => c.id === id) ?? EMPTY; // edit-mode
}, [id]);

const profileUrl = (id: string) => `/chef/${id}`;

// app/chefs/manage/page.tsx 內的 toolbar（整段替換）
const toolbar = (
  <div className="mb-4 flex items-center justify-between">
    <div className="text-sm text-gray-600">
      {id ? (
        <>Editing: <span className="font-medium">{id}</span></>
      ) : (
        <>Create new chef</>
      )}
    </div>

    <div className="ml-auto flex items-center gap-2">
      {/* Create：切到無 id 的 create 模式 */}
      <button
        className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90"
        onClick={() => router.push("/chefs/manage")}  // 只跳到 manage（無 id）
        title="Create new chef"
      >
        + Create
      </button>

      {/* View Profile：僅編輯模式顯示 */}
      {id && (
        <button
          className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90"
          onClick={() => router.push(profileUrl(id))} // ⬅ 下面有 profileUrl()
        >
          View Profile
        </button>
      )}
    </div>
  </div>
);


return (
<main className="py-12 xl:py-20 bg-menu min-h-screen">
<div className="container mx-auto max-w-7xl">
{toolbar}
{/* // app/chefs/manage/page.tsx 底部渲染 */}
<ChefEditor key={id ?? "new"} initialChef={initialChef as any} />
</div>
</main>
);
}