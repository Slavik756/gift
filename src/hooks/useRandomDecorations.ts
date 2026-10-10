import { useState } from "react";
import { photos } from "../data/story";
import type { FallingLeaf, PatternIcon } from "../types";

interface RandomDecorations {
  polaroidTilts: number[];
  patternIcons: PatternIcon[];
  leaves: FallingLeaf[];
}

export function useRandomDecorations(): RandomDecorations {
  const [polaroidTilts] = useState<number[]>(() =>
    photos.map(() => (Math.random() - 0.5) * 6),
  );

  const [patternIcons] = useState<PatternIcon[]>(() =>
    Array.from({ length: 60 }, () => ({
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 90,
      size: 12 + Math.random() * 16,
      rotation: Math.random() * 360,
      opacity: 0.06 + Math.random() * 0.1,
      emoji: Math.random() < 0.5 ? "❤️" : "🌸",
    })),
  );

  const [leaves] = useState<FallingLeaf[]>(() =>
    Array.from({ length: 25 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 7,
      size: 14 + Math.random() * 12,
      duration: 6 + Math.random() * 6,
    })),
  );

  return { polaroidTilts, patternIcons, leaves };
}
