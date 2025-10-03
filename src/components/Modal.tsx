"use client";
export default function Modal({
  open, title, onClose, children,
}: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm rounded-md px-2 py-1 hover:bg-gray-100">✕</button>
        </div>
        <div className="p-0">{children}</div>
      </div>
    </div>
  );
}
