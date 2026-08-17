import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import music from "./assets/music/music.mp3";
import music2 from "./assets/music/music2.mp3";

import { FaLock, FaLockOpen } from "react-icons/fa6";
import { CardModal } from "./components/CardModal";
import { MusicPanel } from "./components/MusicPanel";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoLightbox } from "./components/PhotoLightbox";
import { START_TEXT, cardPages, photoPairs, photos, slides } from "./data/story";

// Стиль для уведомлений
const toastStyle = {
  style: {
    background: "rgba(255, 77, 109, 0.15)",
    color: "#ff8fb1",
    border: "1px solid rgba(255, 77, 109, 0.4)",
    backdropFilter: "blur(8px)",
  },
  iconTheme: { primary: "#ff4d6d", secondary: "#fff" },
};

// -------------------------------------------------------------
// Основной компонент App
// -------------------------------------------------------------
function App() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const heartsRef = useRef(null);
  const heartsRefLocal = useRef([]);
  const startRef = useRef(0);
  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);
  const currentTrackRef = useRef(1);
  const galaxyRef = useRef(null);
  const starsRef = useRef([]);

  const [activePair, setActivePair] = useState(0);
  const lastVolumeRef = useRef(0.25);

  const [typedText, setTypedText] = useState("");
  const [stage, setStage] = useState("preload");
  const [finalText, setFinalText] = useState("");
  const [memoryText, setMemoryText] = useState("");

  const [slideIndex, setSlideIndex] = useState(0);
  const [slideText, setSlideText] = useState("");

  const [cardOpen, setCardOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [musicAllowed, setMusicAllowed] = useState(false); // ← новый флаг

  const [isUnlocked, setIsUnlocked] = useState(false);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const hidePanelTimer = useRef(null);

  const realProgressRef = useRef(0);
  const loadingProgressRef = useRef(0);

  const [revealLeaving, setRevealLeaving] = useState(false);
  const consoleTimerRef = useRef(null);

  useEffect(() => {
    loadingProgressRef.current = loadingProgress;
  }, [loadingProgress]);

  const [polaroidTilts] = useState(() =>
    photos.map(() => (Math.random() - 0.5) * 6)
  );

  const [patternIcons] = useState(() =>
    Array.from({ length: 60 }).map(() => ({
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 90,
      size: 12 + Math.random() * 16,
      rotation: Math.random() * 360,
      opacity: 0.06 + Math.random() * 0.1,
      emoji: Math.random() < 0.5 ? "❤️" : "🌸",
    }))
  );

  const [leaves] = useState(() =>
    Array.from({ length: 25 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 7,
      size: 14 + Math.random() * 12,
      duration: 6 + Math.random() * 6,
    }))
  );

  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const isMuted = volume === 0;
  const totalPairs = photoPairs.length;

  const shareUrl = "https://gift-chi-five.vercel.app/";
  const shareText = "Посмотри, что мне сделали ❤️";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "You my heart ❤️",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Спасибо, что поделился! 💖", toastStyle);
      } catch {
         // пользователь отменил шаринг – ничего не делаем
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Ссылка скопирована! 🔗", toastStyle);
      } catch {
        toast.error("Не удалось скопировать ссылку");
      }
    }
  };

  // Прелоадер
  useEffect(() => {
    const resources = photos.map((p) => p.src);
    resources.push(music, music2);
    const total = resources.length;
    let loadedCount = 0;
    let animFrame = null;
    let finishTimer = null;
    let cancelled = false;
    const fallbackTimers = [];

    const finishPreload = () => {
      const startTime = Date.now();
      const minDelay = 3500;
      const tryFinish = () => {
        if (cancelled) return;
        if (Date.now() - startTime >= minDelay) {
          finishTimer = window.setTimeout(() => {
            if (!cancelled) setStage("console");
          }, 300);
        } else {
          requestAnimationFrame(tryFinish);
        }
      };
      tryFinish();
    };

    const updateRealProgress = () => {
      if (cancelled) return;
      loadedCount++;
      realProgressRef.current = Math.round((loadedCount / total) * 100);
      if (loadedCount === total) {
        finishPreload();
      }
    };

    const animate = () => {
      setLoadingProgress((prev) => {
        if (prev < realProgressRef.current) {
          return Math.min(prev + 1, realProgressRef.current);
        }
        return prev;
      });
      if (loadingProgressRef.current < 100) {
        animFrame = requestAnimationFrame(animate);
      }
    };
    animFrame = requestAnimationFrame(animate);

    photos.forEach((photo) => {
      const img = new Image();
      let completed = false;
      const markLoaded = () => {
        if (completed) return;
        completed = true;
        updateRealProgress();
      };
      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = photo.src;
    });

    const audio1 = new Audio();
    audio1.src = music;
    let audio1Completed = false;
    const markAudio1Loaded = () => {
      if (audio1Completed) return;
      audio1Completed = true;
      updateRealProgress();
    };
    audio1.addEventListener("canplaythrough", markAudio1Loaded, { once: true });
    audio1.addEventListener("error", markAudio1Loaded, { once: true });
    fallbackTimers.push(window.setTimeout(markAudio1Loaded, 10000));
    audio1.load();

    const audio2 = new Audio();
    audio2.src = music2;
    let audio2Completed = false;
    const markAudio2Loaded = () => {
      if (audio2Completed) return;
      audio2Completed = true;
      updateRealProgress();
    };
    audio2.addEventListener("canplaythrough", markAudio2Loaded, { once: true });
    audio2.addEventListener("error", markAudio2Loaded, { once: true });
    fallbackTimers.push(window.setTimeout(markAudio2Loaded, 10000));
    audio2.load();

    return () => {
      cancelled = true;
      if (animFrame) cancelAnimationFrame(animFrame);
      if (finishTimer) clearTimeout(finishTimer);
      fallbackTimers.forEach(clearTimeout);
      audio1.removeEventListener("canplaythrough", markAudio1Loaded);
      audio1.removeEventListener("error", markAudio1Loaded);
      audio2.removeEventListener("canplaythrough", markAudio2Loaded);
      audio2.removeEventListener("error", markAudio2Loaded);
    };
  }, []);

  // Инициализация двух аудио-объектов с переключением по кругу
  useEffect(() => {
    const a1 = new Audio(music);
    const a2 = new Audio(music2);
    audioRef1.current = a1;
    audioRef2.current = a2;

    const playNext = () => {
      if (currentTrackRef.current === 1) {
        currentTrackRef.current = 2;
        a2.currentTime = 0;
        a2.play().catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
      } else {
        currentTrackRef.current = 1;
        a1.currentTime = 0;
        a1.play().catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
      }
    };

    a1.addEventListener("ended", playNext);
    a2.addEventListener("ended", playNext);

    return () => {
      a1.removeEventListener("ended", playNext);
      a2.removeEventListener("ended", playNext);
      a1.pause();
      a2.pause();
    };
  }, []);

  // Громкость и музыка
  useEffect(() => {
    if (audioRef1.current) audioRef1.current.volume = volume;
    if (audioRef2.current) audioRef2.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (volume === 0 && musicPlaying) {
      const timer = setTimeout(() => {
        audioRef1.current?.pause();
        audioRef2.current?.pause();
        setMusicPlaying(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [volume, musicPlaying]);

  const playMusic = useCallback(() => {
    const a1 = audioRef1.current;
    const a2 = audioRef2.current;
    if (!a1 || !a2) return;
    a1.volume = volume;
    a2.volume = volume;
    const current = currentTrackRef.current === 1 ? a1 : a2;
    current.play()
      .then(() => {
        setMusicPlaying(true);
        setMusicAllowed(true);   // ← теперь музыка разрешена
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      });
  }, [volume]);

  const toggleMusic = useCallback(() => {
    const a1 = audioRef1.current;
    const a2 = audioRef2.current;
    if (!a1 || !a2) return;
    if (volume > 0) {
      lastVolumeRef.current = volume;
      setVolume(0);
      a1.pause();
      a2.pause();
      setMusicPlaying(false);
    } else {
      const newVolume = lastVolumeRef.current || 0.25;
      setVolume(newVolume);
      a1.volume = newVolume;
      a2.volume = newVolume;
      if (musicAllowed) {
        const current = currentTrackRef.current === 1 ? a1 : a2;
        current.play().then(() => setMusicPlaying(true)).catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
      }
    }
  }, [volume, musicAllowed]);

const handleVolumeChange = (e) => {
  e.stopPropagation();
  const newVolume = Number(e.target.value);
  setVolume(newVolume);
  if (newVolume > 0 && !musicPlaying && musicAllowed) playMusic();
};

  const scheduleHidePanel = () => {
    if (hidePanelTimer.current) clearTimeout(hidePanelTimer.current);
    hidePanelTimer.current = setTimeout(() => setPanelExpanded(false), 4000);
  };

  const handleMusicToggleClick = (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 600) {
      setPanelExpanded((prev) => {
        if (!prev) scheduleHidePanel();
        else clearTimeout(hidePanelTimer.current);
        return !prev;
      });
    }
    toggleMusic();
  };

  // Консольный ввод
  useEffect(() => {
    if (stage !== "console") return;
    if (typedText.length < START_TEXT.length) {
      consoleTimerRef.current = setTimeout(
        () => setTypedText(START_TEXT.slice(0, typedText.length + 1)),
        90
      );
    }
    return () => {
      if (consoleTimerRef.current) {
        clearTimeout(consoleTimerRef.current);
        consoleTimerRef.current = null;
      }
    };
  }, [typedText, stage]);

  const isReady = typedText.length === START_TEXT.length;

  useEffect(() => {
    if (stage === "reveal") {
      const id = setTimeout(() => setRevealLeaving(false), 0);
      return () => clearTimeout(id);
    }
  }, [stage]);

  // Сердечко (без изменений)
  useEffect(() => {
    if (stage !== "reveal") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId, running = true;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    const pulseDelay = 1000;
    const pulseStartTimeRef = { current: null };
    const allVisibleTimeRef = { current: null };
    let fadeTimer = null;

    function draw(time) {
      if (!running) return;
      if (!startRef.current) startRef.current = time;
      const elapsed = time - startRef.current;

      const allVisible =
        pointsRef.current.length > 0 &&
        pointsRef.current.every((p) => p.alpha >= p.targetAlpha - 0.01);

      if (allVisible && allVisibleTimeRef.current === null) {
        allVisibleTimeRef.current = time;
        pulseStartTimeRef.current = time + pulseDelay;
      }

      let scale = 1;
      if (pulseStartTimeRef.current !== null && time >= pulseStartTimeRef.current) {
        const pulseElapsed = time - pulseStartTimeRef.current;
        scale = 1 + 0.03 * Math.sin(pulseElapsed * 0.002);
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);
      ctx.font = "16px Fira Code, monospace";
      pointsRef.current.forEach((p) => {
        if (elapsed > p.delay) p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        ctx.fillStyle = `rgba(255,77,109,${p.alpha})`;
        const w = ctx.measureText("i love you").width;
        ctx.fillText("i love you", p.x - w / 2, p.y);
      });
      ctx.restore();
      animationId = requestAnimationFrame(draw);
    }

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        running = true;
        animationId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const init = () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (fadeTimer) clearTimeout(fadeTimer);
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      pointsRef.current = [];
      startRef.current = 0;
      allVisibleTimeRef.current = null;
      pulseStartTimeRef.current = null;
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
      const scale = Math.min(window.innerWidth, window.innerHeight) / 40;

      const addPointWithDelay = (t, size, delay, minAlpha, maxAlpha) => {
        const x = 16 * Math.sin(t) ** 3;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        pointsRef.current.push({
          x: cx + x * scale * size,
          y: cy + y * scale * size,
          alpha: 0,
          targetAlpha: minAlpha + Math.random() * (maxAlpha - minAlpha),
          delay: delay,
        });
      };

      const startAngle = 0;
      const totalContourTime = 4000;
      const contourSteps = Math.floor((Math.PI * 2) / 0.05);
      for (let i = 0; i < contourSteps; i++) {
        const t = startAngle + (i / contourSteps) * Math.PI * 2;
        const delay = (i / contourSteps) * totalContourTime;
        addPointWithDelay(t, 1, delay, 0.8, 1);
      }

      const innerBaseDelay = totalContourTime + 400;
      const innerMaxAdditionalDelay = 2500;
      for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          const delay = innerBaseDelay + Math.random() * innerMaxAdditionalDelay;
          addPointWithDelay(t, s, delay, 0.3, 0.8);
        }
      }

      const scheduleFade = () => {
        if (allVisibleTimeRef.current) {
          const fadeAt = allVisibleTimeRef.current + pulseDelay + 5000;
          const now = performance.now();
          const delay = Math.max(0, fadeAt - now);
          fadeTimer = setTimeout(() => {
            setRevealLeaving(true);
            setTimeout(() => {
              document.body.classList.add("cinema-fade");
              setTimeout(() => {
                document.body.classList.remove("cinema-fade");
                setStage("slides");
              }, 3500);
            }, 1000);
          }, delay);
        } else {
          fadeTimer = setTimeout(scheduleFade, 100);
        }
      };
      scheduleFade();

      animationId = requestAnimationFrame(draw);
    };

    init();
    window.addEventListener("resize", init);
    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      if (fadeTimer) clearTimeout(fadeTimer);
      window.removeEventListener("resize", init);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [stage]);

  // Автосмена пар (стоп при открытом лайтбоксе)
  useEffect(() => {
    if (stage !== "photos" || lightboxPhoto) return;
    const interval = setInterval(
      () => setActivePair((prev) => (prev + 1) % totalPairs),
      6000
    );
    return () => clearInterval(interval);
  }, [stage, totalPairs, lightboxPhoto]);

  useEffect(() => {
    if (stage !== "photos" || lightboxPhoto) return;
    const timer = setTimeout(() => setStage("end"), photos.length * 3000);
    return () => clearTimeout(timer);
  }, [stage, lightboxPhoto]);

  // Галактический фон
  useEffect(() => {
    if (!["slides", "final", "end", "photos"].includes(stage)) return;
    const canvas = galaxyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, running = true, lastTime = 0;
    const fps = 30, interval = 1000 / fps;

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animId);
      } else {
        running = true;
        lastTime = 0;
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 2 + 0.2,
        r: Math.random() * 1.4 + 0.3,
        speed: 0.2 + Math.random() * 0.6,
      }));
    };

    function draw(now) {
      if (!running) return;
      animId = requestAnimationFrame(draw);
      if (now - lastTime < interval) return;
      lastTime = now - (now % interval);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      for (let s of starsRef.current) {
        s.y += s.speed * s.z;
        s.x += Math.sin(s.y * 0.002) * 0.2;
        if (s.y > window.innerHeight) {
          s.y = 0;
          s.x = Math.random() * window.innerWidth;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.3 + s.z * 0.4})`;
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [stage]);

  // Слайды
  useEffect(() => {
    if (stage !== "slides") return;
    const slide = slides[slideIndex];
    if (!slide?.text) return;
    setTimeout(() => setSlideText(""), 0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setSlideText(slide.text.slice(0, i));
      if (i >= slide.text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [stage, slideIndex]);

  useEffect(() => {
    if (stage !== "slides") return;
    const currentText = slides[slideIndex]?.text;
    if (!currentText || slideText !== currentText) return;
    const timeout = setTimeout(() => {
      if (slideIndex < slides.length - 1) setSlideIndex((prev) => prev + 1);
      else setStage("final");
    }, 6000);
    return () => clearTimeout(timeout);
  }, [stage, slideIndex, slideText]);

  // Падающие сердечки
  useEffect(() => {
    if (!["slides", "final", "end"].includes(stage)) return;
    const canvas = heartsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let running = true, animId, lastTime = 0;
    const hearts = heartsRefLocal.current;
    hearts.length = 0;
    const spawnInterval = setInterval(() => {
      if (!running || hearts.length >= 50) return;
      hearts.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        speed: stage === "final" ? 0.6 + Math.random() * 1 : 1 + Math.random() * 1.5,
        alpha: 1,
        size: 14 + Math.random() * 8,
      });
    }, 300);

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animId);
      } else {
        running = true;
        lastTime = 0;
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    function draw(now) {
      if (!running) return;
      animId = requestAnimationFrame(draw);
      if (now - lastTime < 33) return;
      lastTime = now - (now % 33);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y += h.speed;
        h.x += Math.sin(h.y * 0.01) * 0.15;
        h.alpha -= stage === "final" ? 0.001 : 0.0025;
        ctx.globalAlpha = h.alpha;
        ctx.font = `${h.size}px Arial`;
        ctx.fillText("❤️", h.x, h.y);
        if (h.alpha <= 0 || h.y > window.innerHeight + 50) hearts.splice(i, 1);
      }
      ctx.globalAlpha = 1;
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      clearInterval(spawnInterval);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "final") return;
    const fullText = "Я люблю тебя. Спасибо, что ты есть ❤️";
    setTimeout(() => setFinalText(""), 0);
    let i = 0;
    const interval = setInterval(() => {
      setFinalText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== "memory") return;
    setTimeout(() => setMemoryText(""), 0);
    const lines = [
      "Scanning memories...",
      "Loading first meeting...",
      "Processing emotions...",
      "Syncing shared memories...",
      "Almost ready ❤️",
    ];
    let lineIndex = 0, charIndex = 0, cancelled = false;
    const intervals = [], timeouts = [];
    const runLine = () => {
      if (cancelled) return;
      const line = lines[lineIndex];
      if (!line) {
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) setStage("reveal");
          }, 800)
        );
        return;
      }
      intervals.push(
        setInterval(() => {
          if (cancelled) return;
          setMemoryText(line.slice(0, charIndex));
          charIndex++;
          if (charIndex > line.length) {
            clearInterval(intervals[intervals.length - 1]);
            timeouts.push(
              setTimeout(() => {
                if (cancelled) return;
                setMemoryText("");
                lineIndex++;
                charIndex = 0;
                runLine();
              }, 1400)
            );
          }
        }, 110)
      );
    };
    runLine();
    return () => {
      cancelled = true;
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [stage]);

  const goFullScreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const currentSlide = slides[slideIndex] ?? slides[0] ?? { title: "", text: "" };

  return (
    <main
      className={`app ${isReady && stage === "console" ? "ready" : ""}`}
    >
      <div className="scanline" />
      <Toaster position="bottom-center" />

      {stage !== "preload" && (
        <MusicPanel
          hidden={Boolean(lightboxPhoto)}
          isMuted={isMuted}
          isExpanded={panelExpanded}
          volume={volume}
          onToggle={handleMusicToggleClick}
          onVolumeChange={handleVolumeChange}
        />
      )}

      {stage === "preload" && (
        <section className="console-screen">
          <div className="console" style={{ textAlign: "center" }}>
            <p className="tag">[loading assets]</p>
            <p className="preload-text">
              Preloading gift... {loadingProgress}%
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </section>
      )}

      {stage === "console" && (
        <section className="console-screen">
          <div className="console">
            <div className="console-line">
              <span className="tag">[system]</span>
              <span>{typedText}</span>
              <span className="terminal-cursor" />
            </div>
            <div className="console-line">
              <span className="tag">[status]</span>
              {isReady && <span className="status">READY</span>}
            </div>
            <div className="console-package-wrapper">
              {isReady && (
                <div className="package">
                  <p>&gt; One encrypted package found for you.</p>
                  <button
                    type="button"
                    className="decrypt"
                    onClick={(e) => {
                      e.stopPropagation();
                      goFullScreen();
                      playMusic();
                      setStage("memory");
                    }}
                  >
                    Decrypt Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {stage === "memory" && (
        <section className="console-screen">
          <div className="console">
            <div className="tag">[memory core]</div>
            <p className="memory-date">1 July 2026</p>
            <p style={{ minHeight: "1.5em" }}>{memoryText || "\u00A0"}</p>
          </div>
        </section>
      )}

      {stage === "reveal" && (
        <section
          className={`reveal-screen ${revealLeaving ? "reveal-leaving" : ""}`}
        >
          <canvas ref={canvasRef} className="heart-canvas" />
          <div className="center-message">
            <h1>Decrypted</h1>
            <div className="divider" />
          </div>
        </section>
      )}

      {stage === "photos" && (
        <>
          <canvas ref={galaxyRef} className="galaxy-canvas" />
          <PhotoGallery
            activePair={activePair}
            polaroidTilts={polaroidTilts}
            onOpen={(photo) =>
              setLightboxPhoto({ src: photo.src, caption: photo.text })
            }
          />
        </>
      )}

      {stage === "slides" && (
        <section className="reveal-screen">
          <canvas ref={galaxyRef} className="galaxy-canvas" />
          <canvas
            ref={heartsRef}
            className="heart-canvas"
            style={{ zIndex: 0 }}
          />
          <div className="center-message" style={{ zIndex: 2 }}>
            <h1>{currentSlide.title}</h1>
            <div className="divider" />
            <p style={{ maxWidth: 600, whiteSpace: "pre-line" }}>{slideText}</p>
          </div>
        </section>
      )}

      {stage === "end" && (
        <section className="reveal-screen">
          <canvas ref={galaxyRef} className="galaxy-canvas" />
          <div className="center-message">
            <h1>❤️ Спасибо ❤️</h1>
            <p>Я просто хотел подарить тебе немного тепла.</p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button type="button" className="reencrypt" onClick={() => setStage("final")}>
                ← Назад
              </button>
              <button
                type="button"
                className="share-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                Поделиться ❤️
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "final" && (
        <section className="reveal-screen">
          <canvas ref={galaxyRef} className="galaxy-canvas" />
          <canvas
            ref={heartsRef}
            className="heart-canvas"
            style={{ zIndex: 0 }}
          />
          <div className="center-message" style={{ zIndex: 2 }}>
            <h1>💖 MESSAGE DECRYPTED</h1>
            <div className="divider" />
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 600 }}>
              {finalText}
            </p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                type="button"
                className="reencrypt"
                onClick={() => {
                  setPageIndex(0);
                  setCardOpen(true);
                  setIsUnlocked(true);
                }}
              >
                открыть открытку
              </button>
              <button
                type="button"
                className={`reencrypt ${!isUnlocked ? "locked" : ""}`}
                onClick={() => {
                  if (!isUnlocked) return;
                  setActivePair(0);
                  setStage("photos");
                }}
                title={!isUnlocked ? "Сначала открой открытку" : ""}
              >
                {isUnlocked ? (
                  <FaLockOpen style={{ marginRight: 6 }} />
                ) : (
                  <FaLock style={{ marginRight: 6 }} />
                )}
                Продолжить
              </button>
            </div>
          </div>
        </section>
      )}

      {cardOpen && (
        <CardModal
          pageIndex={pageIndex}
          patternIcons={patternIcons}
          leaves={leaves}
          onClose={() => {
            setCardOpen(false);
            setPageIndex(0);
          }}
          onPrevious={() => setPageIndex((page) => Math.max(0, page - 1))}
          onNext={() =>
            setPageIndex((page) => Math.min(cardPages.length - 1, page + 1))
          }
        />
      )}

      {lightboxPhoto && (
        <PhotoLightbox
          src={lightboxPhoto.src}
          caption={lightboxPhoto.caption}
          onClose={() => setLightboxPhoto(null)}
        />
      )}
    </main>
  );
}

export default App;
