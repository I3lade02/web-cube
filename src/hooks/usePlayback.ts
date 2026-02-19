"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drives step changes over time. Caller owns `step` and passes setStep from useState.
 */
export function usePlayback({
  maxStep,
  step,
  setStep
}: {
  maxStep: number;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [playing, setPlaying] = useState(false);
  const [msPerMove, setMsPerMove] = useState(450);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;

    if (step >= maxStep) {
      setPlaying(false);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setStep((prev) => Math.min(maxStep, prev + 1));
    }, msPerMove);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [playing, msPerMove, maxStep, step, setStep]);

  useEffect(() => {
    if (step >= maxStep && playing) setPlaying(false);
  }, [step, maxStep, playing]);

  return { playing, setPlaying, msPerMove, setMsPerMove };
}
