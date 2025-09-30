// =============================
// File: components/mode-context.tsx
// Purpose: Global toggle for "User" vs "Chef Mode" (prototype only)
// =============================
"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";


type Mode = "user" | "chef";


interface ModeCtx {
mode: Mode;
toggle: () => void;
setMode: (m: Mode) => void;
}


const Ctx = createContext<ModeCtx | null>(null);


export function ModeProvider({ children }: { children: React.ReactNode }) {
const [mode, setMode] = useState<Mode>("chef");


// load from localStorage once on mount
useEffect(() => {
const saved = (typeof window !== "undefined" && localStorage.getItem("cc_mode")) as Mode | null;
if (saved === "chef" || saved === "user") setMode(saved);
}, []);


// persist when changed
useEffect(() => {
if (typeof window !== "undefined") localStorage.setItem("cc_mode", mode);
}, [mode]);


const value = useMemo(
() => ({ mode, toggle: () => setMode(prev => (prev === "chef" ? "user" : "chef")), setMode }),
[mode]
);


return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}


export function useMode() {
const v = useContext(Ctx);
if (!v) throw new Error("useMode must be used within <ModeProvider>");
return v;
}