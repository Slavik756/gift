import { useCallback, useEffect, useRef, useState } from "react";

interface PhotoLightboxProps {
  src: string;
  caption: string;
  onClose: () => void;
}

export function PhotoLightbox({ src, caption, onClose }: PhotoLightboxProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const initialDistance = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      setScale((previous) => Math.max(1, Math.min(5, previous * delta)));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getDistance = (touches: TouchList) => {
      const deltaX = touches[0].clientX - touches[1].clientX;
      const deltaY = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(deltaX ** 2 + deltaY ** 2);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) initialDistance.current = getDistance(event.touches);
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (event.touches.length !== 2 || initialDistance.current === null) return;

      const currentDistance = getDistance(event.touches);
      const scaleChange = currentDistance / initialDistance.current;
      setScale((previous) => Math.max(1, Math.min(5, previous * scaleChange)));
      initialDistance.current = currentDistance;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const close = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      const x = Math.max(-1, Math.min(1, event.gamma / 45));
      const y = Math.max(-1, Math.min(1, event.beta / 90));
      setOffset({ x: x * 15, y: y * 15 });
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 10, y: y * 10 });
  };

  return (
    <div
      className="lightbox-overlay"
      onClick={(event) => {
        event.stopPropagation();
        close();
      }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ touchAction: "none" }}
    >
      <div
        className="lightbox-image-wrapper"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: "transform 0.05s ease-out",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <img src={src} alt={caption} className="lightbox-image" />
        {caption && <p className="lightbox-caption">{caption}</p>}
      </div>
      <button
        type="button"
        className="lightbox-close"
        aria-label="Закрыть фотографию"
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
      >
        ✕
      </button>
    </div>
  );
}
