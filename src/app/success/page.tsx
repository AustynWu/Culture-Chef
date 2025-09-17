import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Reservation request sent 🎉</h1>
        <p className="text-gray-600">We’ll notify you once the chef confirms.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/orders" className="rounded-lg bg-black text-white px-4 py-2">View my orders</Link>
          <Link href="/browse" className="rounded-lg bg-white text-black border px-4 py-2">Back to browse</Link>
        </div>
      </div>
    </main>
  );
}
