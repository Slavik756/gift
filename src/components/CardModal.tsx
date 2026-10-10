import { cardPages } from "../data/story";
import type { FallingLeaf, PatternIcon } from "../types";

interface CardModalProps {
  pageIndex: number;
  patternIcons: PatternIcon[];
  leaves: FallingLeaf[];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function CardModal({
  pageIndex,
  patternIcons,
  leaves,
  onClose,
  onPrevious,
  onNext,
}: CardModalProps) {
  const currentPage = cardPages[pageIndex] ?? cardPages[0];

  return (
    <div
      className="card-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Открытка"
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <div className="card" onClick={(event) => event.stopPropagation()}>
        <div className="pattern-bg">
          {patternIcons.map((icon, index) => (
            <span
              key={`${icon.left}-${icon.top}-${index}`}
              className="pattern-icon"
              style={{
                left: `${icon.left}%`,
                top: `${icon.top}%`,
                fontSize: `${icon.size}px`,
                transform: `rotate(${icon.rotation}deg)`,
                opacity: icon.opacity,
              }}
            >
              {icon.emoji}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="card-close"
          aria-label="Закрыть открытку"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
        <div className="leaf-animation">
          {leaves.map((leaf, index) => (
            <span
              key={`${leaf.left}-${leaf.delay}-${index}`}
              className="leaf"
              style={{
                left: `${leaf.left}%`,
                animationDelay: `${leaf.delay}s`,
                fontSize: `${leaf.size}px`,
                animationDuration: `${leaf.duration}s`,
              }}
            >
              🍃
            </span>
          ))}
        </div>
        <h2>{currentPage.title}</h2>
        <p style={{ whiteSpace: "pre-line" }}>{currentPage.text}</p>
        <div className="card-controls">
          <button type="button" aria-label="Предыдущая страница" onClick={onPrevious}>
            ←
          </button>
          <span>
            {pageIndex + 1} / {cardPages.length}
          </span>
          <button type="button" aria-label="Следующая страница" onClick={onNext}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
