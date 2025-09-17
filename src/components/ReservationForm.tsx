"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  chefId?: string;
  chefName?: string;
};

const ReservationForm = ({ chefId, chefName }: Props) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [people, setPeople] = useState<string>("");
  const [service, setService] = useState<"home" | "pickup">("home");
  const [time, setTime] = useState<string>("");
  const [addr, setAddr] = useState({ line1: "", suburb: "", postcode: "" });
  const [notes, setNotes] = useState("");

  const canSubmit =
    !!date && !!people && (service === "pickup" ? !!time : !!(addr.line1 && addr.suburb));

  // ReservationForm.tsx
  const fieldBase =
  "flex items-center justify-between w-full h-[52px] px-6 !py-0 rounded-lg " +
  "bg-white text-black border border-gray-200 text-sm leading-none";

  return (
    // 讓整個表單本身就是兩欄格線：大螢幕橫向配置
    <form className="grid gap-6 md:grid-cols-2">
      {/* 姓名 */}
      <div className="space-y-2">
        <Label htmlFor="firstname" className="text-black">first name</Label>
        <Input
          id="firstname"
          type="text"
          autoComplete="given-name"
          className="h-[52px] rounded-lg bg-white text-black border border-gray-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastname" className="text-black">last name</Label>
        <Input
          id="lastname"
          type="text"
          autoComplete="family-name"
          className="h-[52px] rounded-lg bg-white text-black border border-gray-200"
        />
      </div>


      {/* 日期 */}
      <div className="space-y-2">
        <Label className="text-black">date</Label>
        <Popover>
          <PopoverTrigger asChild>
            {/* 重要：Button 預設 variant="input" 是白字，我們用 className 覆蓋成白底黑字 */}
            <Button
              variant="input"
              className={cn(
                "justify-start text-left font-normal", // 日期想要靠左可保留
                fieldBase.replace("justify-between", "justify-start") // 讓它也是 flex 而非 inline-flex
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-black" />
              {date ? format(date, "PPP") : <span className="text-black">Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* 人數 */}
      <div className="space-y-2">
        <Label className="text-black">people</Label>
        {/* 重要：SelectTrigger 自帶白字；一定要補 text-black + 白底 + 邊框 */}
        <Select onValueChange={setPeople}>
          <SelectTrigger     
              className={fieldBase + " [&>span]:leading-none" // SelectValue 是 span，鎖行高
                }>
            <SelectValue placeholder="How many people?" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-black">People</SelectLabel>
              {[1,2,3,4,5,6,7,8].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 服務方式（佔滿一列） */}
      <div className="space-y-2 md:col-span-2">
        <Label className="text-black">service</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setService("home")}
            className={`px-3 py-1 rounded-full border ${service==="home" ? "bg-orange shadow" : "hover:bg-orange"}`}
          >
            At home
          </button>
          <button
            type="button"
            onClick={() => setService("pickup")}
            className={`px-3 py-1 rounded-full border ${service==="pickup" ? "bg-orange shadow" : "hover:bg-orange"}`}
          >
            Pickup
          </button>
        </div>
      </div>

      {/* Pickup 才需要時間 */}
      {service === "pickup" && (
        <div className="space-y-2">
          <Label className="text-black">pickup time</Label>
          <Select onValueChange={setTime}>
            <SelectTrigger className="w-full h-[52px] rounded-lg bg-white text-black border border-gray-200">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-black">Time</SelectLabel>
                {["11:30","12:00","12:30","18:00","18:30","19:00"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Pickup location will be shared after confirmation.</p>
        </div>
      )}

      {/* At home 才需要地址（分三欄） */}
      {service === "home" && (
        <div className="md:col-span-2 grid gap-6 md:grid-cols-3">
          <div className="space-y-3 md:col-span-2">
            <Label htmlFor="suburb" className="text-black">suburb</Label>
            <Input
              id="suburb"
              value={addr.suburb}
              onChange={e => setAddr(a => ({ ...a, suburb: e.target.value }))}
              className="h-[52px] rounded-lg bg-white text-black border border-gray-200"
            />
          </div>
          <div className="space-y-3 md:col-span-1">
            <Label htmlFor="postcode" className="text-black">postcode</Label>
            <Input
              id="postcode"
              value={addr.postcode}
              onChange={e => setAddr(a => ({ ...a, postcode: e.target.value }))}
              className="h-[52px] rounded-lg bg-white text-black border border-gray-200"
            />
          </div>
            <div className="md:col-span-3 space-y-3">
            <Label htmlFor="addr1" className="text-black">address</Label>
            <Input
              id="addr1"
              value={addr.line1}
              onChange={e => setAddr(a => ({ ...a, line1: e.target.value }))}
              className="h-[52px] rounded-lg bg-white text-black border border-gray-200"
            />
          </div>
        </div>
      )}

      {/* 備註（佔滿一列） */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="notes" className="text-black">notes</Label>
        <Input
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Allergies, access notes…"
          className="h-[52px] rounded-lg bg-white text-black border border-gray-200"
        />
      </div>

      {/* 送出（靠右） */}
      <div className="md:col-span-2 flex justify-end">
        <Button
          asChild
          className="h-[52px] px-5 rounded-lg bg-black text-white "
          variant="default"
          disabled={!canSubmit}
        >
          <Link href="/success">Book now</Link>
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;
