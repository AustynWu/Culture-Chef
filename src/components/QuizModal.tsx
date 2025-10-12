"use client";

import * as React from "react";
import Image from "next/image";
import { QUIZ_QUESTIONS, QuizQuestion } from "@/data/quiz";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VoucherDialog from "./VoucherDialog";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };
type State = {
  current: QuizQuestion;
  selectedIndex: number | null;
  submitted: boolean;
  isCorrect: boolean | null;
};

function pickRandom(excludeId?: string): QuizQuestion {
  const pool = excludeId ? QUIZ_QUESTIONS.filter(q => q.id !== excludeId) : QUIZ_QUESTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function QuizModal({ open, onOpenChange }: Props) {
  const [state, setState] = React.useState<State>(() => ({
    current: pickRandom(),
    selectedIndex: null,
    submitted: false,
    isCorrect: null,
  }));
  const [voucherOpen, setVoucherOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setState({
        current: pickRandom(),
        selectedIndex: null,
        submitted: false,
        isCorrect: null,
      });
      setVoucherOpen(false);
    }
  }, [open]);

  const onSelect = (i: number) => {
    if (state.submitted) return;
    setState(s => ({ ...s, selectedIndex: i }));
  };

  const onSubmit = () => {
    if (state.selectedIndex == null) return;
    const correct = state.selectedIndex === state.current.correctIndex;
    setState(s => ({ ...s, submitted: true, isCorrect: correct }));
    // 不自動開啟 voucher；改用按鈕讓使用者自行點
  };

  const onNext = () => {
    setState(s => ({
      current: pickRandom(s.current.id),
      selectedIndex: null,
      submitted: false,
      isCorrect: null,
    }));
    setVoucherOpen(false);
  };

  const { current, selectedIndex, submitted, isCorrect } = state;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* 拿掉大 modal 的滾輪：overflow-hidden；高度限制以免超出版面 */}
        <DialogContent className="max-w-[1000px] w-[95vw] max-h-[92vh] overflow-hidden">
          {/* 內層用 flex + min-h-0，確保子區塊（故事）能滾 */}
          <div className="flex flex-col gap-4 min-h-0">
            <DialogHeader className="mb-1">
              <DialogTitle className="text-xl">Culture Chef — Quiz</DialogTitle>
            </DialogHeader>

            {/* 橫向兩欄（圖｜題目） */}
            <div className="grid grid-cols-1 xl:grid-cols-[460px,1fr] gap-6 min-h-0">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={current.imageUrl}
                  alt="quiz dish"
                  fill
                  sizes="(max-width: 1280px) 50vw, 460px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col">
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 text-lg">
                    {current.questionText}
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {current.options.map((opt, i) => {
                      const isChosen = selectedIndex === i;
                      const showCorrect = submitted && i === current.correctIndex;
                      const showWrong = submitted && isChosen && i !== current.correctIndex;
                      return (
                        <button
                          key={i}
                          onClick={() => onSelect(i)}
                          className={[
                            "w-full text-left rounded-lg border px-4 py-3 transition",
                            isChosen ? "border-black" : "border-gray-200",
                            showCorrect ? "bg-green-50 border-green-500" : "",
                            showWrong ? "bg-rose-50 border-rose-500" : "",
                            !submitted && "hover:bg-gray-50"
                          ].filter(Boolean).join(" ")}
                          disabled={submitted}
                          aria-pressed={isChosen}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* 動作按鈕列 */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {!submitted ? (
                      <Button onClick={onSubmit} disabled={selectedIndex == null}>
                        Submit Answer
                      </Button>
                    ) : (
                      <>
                        {/* 答對時顯示「Claim Voucher」按鈕（點了才開 voucher 視窗） */}
                        {isCorrect && current.voucherOnCorrect && (
                          <Button onClick={() => setVoucherOpen(true)}>
                            Claim Voucher
                          </Button>
                        )}
                        <Button variant="secondary" onClick={onNext}>
                          Next (Random)
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                          Close
                        </Button>
                      </>
                    )}
                  </div>

                  {submitted && (
                    <p className={isCorrect ? "text-green-700" : "text-rose-700"}>
                      {isCorrect ? "Correct! 🎉" : "Not quite — here’s a short story:"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 故事區：固定高度、可滾；外層大 modal 不滾 */}
            {submitted && (
              <div className="rounded-lg bg-white border p-4 h-37 md:h-38 overflow-y-auto pr-3 cc-thin-scroll">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {current.story}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Voucher 視窗：只有點「Claim Voucher」才會開 */}
      <VoucherDialog
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
        code={isCorrect ? current.voucherOnCorrect : undefined}
      />
    </>
  );
}
