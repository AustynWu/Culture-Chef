"use client";

import * as React from "react";
import QuizModal from "./QuizModal";

export default function QuizFab() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Floating, center-right, attention grabbing */}
      <button
        onClick={() => setOpen(true)}
        title="Try a culture quiz"
        className="
          fixed right-5 top-1/2 -translate-y-1/2 z-[150]
          inline-flex items-center gap-2
          rounded-full px-4 py-3
          bg-black text-white shadow-2xl
          hover:scale-[1.03] active:scale-[0.98] transition
          animate-[pulse_2.4s_ease-in-out_infinite]
        "
        aria-label="Open culture quiz"
      >
        <span className="text-lg">🎲</span>
        <span className="text-sm font-semibold">Try a Culture Quiz</span>
      </button>

      <QuizModal open={open} onOpenChange={setOpen} />
    </>
  );
}

/* If you would rather place a prominent inline CTA (e.g., in your hero),
   copy this component into /components/QuizCta.tsx and render it in your page:

   "use client";
   import * as React from "react";
   import QuizModal from "./QuizModal";

   export function QuizCta() {
     const [open, setOpen] = React.useState(false);
     return (
       <>
         <button
           onClick={() => setOpen(true)}
           className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-3 shadow-lg hover:scale-[1.02] transition"
         >
           <span className="text-lg">🎲</span>
           <span className="font-semibold">Play the Culture Quiz</span>
         </button>
         <QuizModal open={open} onOpenChange={setOpen} />
       </>
     );
   }
*/
