import { useEffect, type CSSProperties } from "react";
import { FiZoomIn } from "react-icons/fi";
import { photoPairs } from "../data/story";
import type { Photo } from "../types";

interface PhotoGalleryProps {
  activePair: number;
  polaroidTilts: number[];
  onOpen: (photo: Photo) => void;
}

type PolaroidStyle = CSSProperties & {
  "--start-rotate": string;
  "--tilt": string;
};

export function PhotoGallery({ activePair, polaroidTilts, onOpen }: PhotoGalleryProps) {
  const activePhotos = photoPairs[activePair] ?? [];

  useEffect(() => {
    const nextPair = photoPairs[(activePair + 1) % photoPairs.length] ?? [];

    nextPair.forEach((photo) => {
      const image = new Image();
      image.src = photo.src;
    });
  }, [activePair]);

  return (
    <section className="photo-screen">
      <div className="photo-container">
        <div className="photo-pair">
          <div key={activePair} className="pair-wrapper active">
            {activePhotos.map((photo, index) => {
              const globalIndex = activePair * 2 + index;
              const tilt = polaroidTilts[globalIndex] ?? 0;
              const style: PolaroidStyle = {
                "--start-rotate": index === 0 ? "-12deg" : "12deg",
                "--tilt": `${tilt}deg`,
              };

              return (
                <div key={photo.src} className="photo-polaroid" style={style}>
                  <button
                    type="button"
                    className="photo-wrapper"
                    aria-label={`Открыть фото: ${photo.text}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpen(photo);
                    }}
                  >
                    <img src={photo.src} className="photo" alt={photo.text} decoding="async" />
                    <span className="zoom-icon">
                      <FiZoomIn />
                    </span>
                  </button>
                  <p className="photo-caption">{photo.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
