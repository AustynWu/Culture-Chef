// /components/VoucherDialog.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  code?: string;
};

export default function VoucherDialog({ open, onOpenChange, code }: Props) {
  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      alert("Copied!");
    } catch {
      alert(`Your code: ${code}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Nice job! 🎉</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You answered correctly. Here’s your voucher code:
          </p>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-xs uppercase text-gray-500">Voucher</p>
              <p className="font-mono text-lg">{code ?? "—"}</p>
            </div>
            <Button size="sm" onClick={copy}>Copy</Button>
          </div>

          <div className="flex items-center gap-2">
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Continue
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

          <p className="text-[11px] text-gray-500">
            Demo only — single-use codes and redemption limits are enforced in the full version.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
