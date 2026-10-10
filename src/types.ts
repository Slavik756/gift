export type Stage =
  | "preload"
  | "console"
  | "memory"
  | "reveal"
  | "slides"
  | "final"
  | "photos"
  | "end";

export interface Photo {
  src: string;
  text: string;
}

export interface StorySlide {
  title: string;
  text: string;
}

export interface CardPage {
  title: string;
  text: string;
}

export interface LightboxPhoto {
  src: string;
  caption: string;
}

export interface PatternIcon {
  left: number;
  top: number;
  size: number;
  rotation: number;
  opacity: number;
  emoji: string;
}

export interface FallingLeaf {
  left: number;
  delay: number;
  size: number;
  duration: number;
}
