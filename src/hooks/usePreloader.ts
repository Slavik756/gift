import { useEffect, useRef, useState } from "react";

interface UsePreloaderOptions {
  audioSources: string[];
  imageSources: string[];
  onReady: () => void;
}

export function usePreloader({
  audioSources,
  imageSources,
  onReady,
}: UsePreloaderOptions) {
  const [progress, setProgress] = useState(0);
  const displayedProgressRef = useRef(0);
  const actualProgressRef = useRef(0);

  useEffect(() => {
    const total = imageSources.length + audioSources.length;
    let loadedCount = 0;
    let animationFrame: number | null = null;
    let finishTimer: number | null = null;
    let cancelled = false;
    const fallbackTimers: number[] = [];

    const finishPreload = () => {
      const startTime = Date.now();
      const waitForMinimumDuration = () => {
        if (cancelled) return;
        if (Date.now() - startTime >= 3500) {
          finishTimer = window.setTimeout(() => {
            if (!cancelled) onReady();
          }, 300);
          return;
        }
        animationFrame = requestAnimationFrame(waitForMinimumDuration);
      };
      waitForMinimumDuration();
    };

    const markLoaded = () => {
      if (cancelled) return;
      loadedCount += 1;
      actualProgressRef.current = Math.round((loadedCount / total) * 100);
      if (loadedCount === total) finishPreload();
    };

    const animateProgress = () => {
      setProgress((previous) => {
        const nextProgress = Math.min(previous + 1, actualProgressRef.current);
        displayedProgressRef.current = nextProgress;
        return nextProgress;
      });
      if (displayedProgressRef.current < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);

    imageSources.forEach((source) => {
      const image = new Image();
      let completed = false;
      const markImageLoaded = () => {
        if (completed) return;
        completed = true;
        markLoaded();
      };
      image.onload = markImageLoaded;
      image.onerror = markImageLoaded;
      image.src = source;
    });

    audioSources.forEach((source) => {
      const audio = new Audio(source);
      let completed = false;
      const markAudioLoaded = () => {
        if (completed) return;
        completed = true;
        markLoaded();
      };
      audio.addEventListener("canplaythrough", markAudioLoaded, { once: true });
      audio.addEventListener("error", markAudioLoaded, { once: true });
      fallbackTimers.push(window.setTimeout(markAudioLoaded, 10000));
      audio.load();
    });

    return () => {
      cancelled = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (finishTimer) window.clearTimeout(finishTimer);
      fallbackTimers.forEach(window.clearTimeout);
    };
  }, [audioSources, imageSources, onReady]);

  return progress;
}
