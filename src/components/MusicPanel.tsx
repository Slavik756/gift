import type { ChangeEvent, MouseEvent } from "react";
import { RiVolumeMuteFill, RiVolumeUpFill } from "react-icons/ri";

interface MusicPanelProps {
  hidden: boolean;
  isMuted: boolean;
  isExpanded: boolean;
  volume: number;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  onVolumeChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function MusicPanel({
  hidden,
  isMuted,
  isExpanded,
  volume,
  onToggle,
  onVolumeChange,
}: MusicPanelProps) {
  return (
    <div
      className={`music-panel${isExpanded ? " expanded" : ""}${hidden ? " music-hidden" : ""}`}
    >
      <button
        type="button"
        className="music-toggle"
        onClick={onToggle}
        aria-label={isMuted ? "Включить музыку" : "Выключить музыку"}
      >
        {isMuted ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
        className="volume-slider"
        aria-label="Громкость"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
