import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import music from "./assets/music/music.mp3";

import img1 from "./assets/photos/1.jpg";
import img2 from "./assets/photos/2.jpg";
import img3 from "./assets/photos/3.jpg";
import img4 from "./assets/photos/4.jpg";
import img5 from "./assets/photos/5.jpg";
import img6 from "./assets/photos/6.jpg";
import img7 from "./assets/photos/7.jpg";
import img8 from "./assets/photos/8.jpg";
import img9 from "./assets/photos/9.jpg";
import img10 from "./assets/photos/10.jpg";
import img11 from "./assets/photos/11.jpg";
import img12 from "./assets/photos/12.jpg";

import { RiVolumeUpFill, RiVolumeMuteFill } from "react-icons/ri";
import { FaLock, FaLockOpen } from "react-icons/fa6";
import { FiZoomIn } from "react-icons/fi";

const START_TEXT = "Initializing heart.PROTOCOL_v2.0...";

const photos = [
  { src: img1, text: "Твоя улыбка 💖" },
  { src: img2, text: "Счастливый момент" },
  { src: img3, text: "Ты такая красивая здесь" },
  { src: img4, text: "Просто ты — и этого достаточно" },
  { src: img5, text: "Твоя улыбка 💖" },
  { src: img6, text: "Счастливый момент" },
  { src: img7, text: "Ты такая красивая здесь" },
  { src: img8, text: "Просто ты — и этого достаточно" },
  { src: img9, text: "Твоя улыбка 💖" },
  { src: img10, text: "Счастливый момент" },
  { src: img11, text: "Ты такая красивая здесь" },
  { src: img12, text: "Просто ты — и этого достаточно" },
];

const photoPairs = [];
for (let i = 0; i < photos.length; i += 2) {
  photoPairs.push([photos[i], photos[i + 1]]);
}

const slides = [
  {
    title: "Запуск воспоминаний",
    text: `Инициализация чувств...\nТы — первый стабильный сигнал в моей жизни.\nС этого момента всё стало осмысленнее.`,
  },
  {
    title: "Почему я счастлив",
    text: `Потому что ты появилась в моей жизни.\nИ даже обычные дни стали теплее и спокойнее.\nС тобой всё внутри стало тише и правильнее.`,
  },
  {
    title: "Маленькие моменты",
    text: `Твои сообщения.\nТвоя тишина рядом.\nТвои случайные слова и улыбки.\nИ именно из этого складывается моё счастье.`,
  },
  {
    title: "Что я чувствую",
    text: `Я люблю тебя не за что-то конкретное.\nА за тебя — настоящую.\nЗа всё, что делает тебя тобой.`,
  },
  {
    title: "Когда тебя нет рядом",
    text: `Мир становится тише и пустее.\nНо даже тогда ты остаёшься в мыслях.\nКак что-то очень родное и постоянное.`,
  },
  {
    title: "Как я тебя люблю",
    text: `Тихо. Глубоко. Без лишних слов.\nИногда даже сам не могу это объяснить.\nНо это всегда больше, чем просто чувство.`,
  },
  {
    title: "Будущее",
    text: `Я не знаю, что будет дальше.\nНо я хочу, чтобы в этом будущем была ты.\nИ чтобы таких дней было ещё очень много.`,
  },
  {
    title: "С днём рождения ❤️",
    text: `Я желаю тебе самого важного — спокойного счастья.\nТакого, которое не нужно искать или заслуживать.\nТы уже его заслуживаешь просто тем, что ты есть.\n\nЯ люблю тебя.\nИ если этот текст что-то должен сказать — то только это.`,
  },
];

const cardPages = [
  {
    title: "Для тебя ❤️",
    text: `Я сделал эту открытку специально для тебя.\nНе потому что надо, а потому что мне правда хочется сказать тебе важное.\n\nТы стала для меня очень близким и дорогим человеком, и я просто хотел оставить это здесь — в этих словах.`,
  },
  {
    title: "Ты для меня",
    text: `С тобой моя жизнь стала намного теплее и приятнее.\nДаже обычные дни с тобой ощущаются по-другому — легче, спокойнее и как-то правильнее.\n\nТы умеешь делать простые вещи особенными, даже не замечая этого.`,
  },
  {
    title: "Моменты с тобой",
    text: `Я ценю каждый момент с тобой — разговоры, шутки, твои сообщения, даже самые обычные.\n\nИногда именно такие маленькие вещи и создают самое сильное чувство.\nИ с тобой их особенно много.`,
  },
  {
    title: "Когда ты рядом",
    text: `Когда ты рядом, всё становится проще.\nНе нужно ничего придумывать или играть какую-то роль — можно просто быть собой.\n\nИ это ощущение очень ценное для меня.`,
  },
  {
    title: "Почему ты важна",
    text: `Ты стала для меня важной не из-за чего-то одного.\nА просто потому, какая ты есть.\n\nВ тебе есть что-то очень тёплое и настоящее, что мне очень близко.`,
  },
  {
    title: "Моё чувство к тебе",
    text: `Я люблю тебя спокойно и искренне.\nБез лишних слов и громких фраз — просто по-настоящему.\n\nТы для меня очень дорогой человек, и это чувство со мной постоянно.`,
  },
  {
    title: "Моё пожелание тебе",
    text: `Я хочу, чтобы ты была счастлива.\nЧтобы у тебя было больше поводов улыбаться, радоваться и чувствовать себя хорошо.\n\nЧтобы ты всегда знала, что ты ценная и важная.`,
  },
  {
    title: "С днём рождения ❤️",
    text: `Спасибо тебе за тебя.\nЗа то, что ты есть в моей жизни и делаешь её лучше просто своим присутствием.\n\nЯ правда очень рад, что ты рядом.\nИ я тебя люблю — спокойно, искренне и по-настоящему.`,
  },
];

// Компонент полноэкранного просмотра фото
function PhotoLightbox({ src, caption, onClose }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const initialDistance = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 10, y: y * 10 });
  }, []);

  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma === undefined || e.beta === undefined) return;
      const x = Math.max(-1, Math.min(1, e.gamma / 45));
      const y = Math.max(-1, Math.min(1, e.beta / 90));
      setOffset({ x: x * 15, y: y * 15 });
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(1, Math.min(5, prev * delta)));
  }, []);

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance.current) {
      const currentDistance = getDistance(e.touches);
      const scaleChange = currentDistance / initialDistance.current;
      setScale((prev) => Math.max(1, Math.min(5, prev * scaleChange)));
      initialDistance.current = currentDistance;
    }
  };

  const close = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="lightbox-overlay"
      onClick={close}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div
        className="lightbox-image-wrapper"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: "transform 0.05s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={caption} className="lightbox-image" />
        {caption && <p className="lightbox-caption">{caption}</p>}
      </div>
      <button className="lightbox-close" onClick={close}>
        ✕
      </button>
    </div>
  );
}

function App() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const heartsRef = useRef(null);
  const heartsRefLocal = useRef([]);
  const startRef = useRef(0);
  const audioRef = useRef(null);
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

  const [isUnlocked, setIsUnlocked] = useState(false);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const hidePanelTimer = useRef(null);

  const realProgressRef = useRef(0);
  const loadingProgressRef = useRef(0);

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
        toast.success("Спасибо, что поделился! 💖", {
          style: {
            background: "rgba(255, 77, 109, 0.15)",
            color: "#ff8fb1",
            border: "1px solid rgba(255, 77, 109, 0.4)",
            backdropFilter: "blur(8px)",
          },
          iconTheme: { primary: "#ff4d6d", secondary: "#fff" },
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Ссылка скопирована! 🔗", {
          style: {
            background: "rgba(255, 77, 109, 0.15)",
            color: "#ff8fb1",
            border: "1px solid rgba(255, 77, 109, 0.4)",
            backdropFilter: "blur(8px)",
          },
          iconTheme: { primary: "#ff4d6d", secondary: "#fff" },
        });
      } catch {
        toast.error("Не удалось скопировать ссылку");
      }
    }
  };

  // Прелоадер
  useEffect(() => {
    const resources = photos.map((p) => p.src);
    resources.push(music);
    const total = resources.length;
    let loadedCount = 0;
    let animFrame = null;

    const updateRealProgress = () => {
      loadedCount++;
      realProgressRef.current = Math.round((loadedCount / total) * 100);
      if (loadedCount === total) {
        const startTime = Date.now();
        const minDelay = 3500;
        const tryFinish = () => {
          if (Date.now() - startTime >= minDelay) {
            setTimeout(() => setStage("console"), 300);
          } else {
            requestAnimationFrame(tryFinish);
          }
        };
        tryFinish();
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
      img.onload = updateRealProgress;
      img.onerror = updateRealProgress;
      img.src = photo.src;
    });

    const audio = new Audio();
    audio.src = music;
    audio.addEventListener("canplaythrough", updateRealProgress, { once: true });
    audio.addEventListener("error", updateRealProgress, { once: true });
    audio.load();
    setTimeout(() => {
      if (!audio.readyState || audio.readyState < 2) updateRealProgress();
    }, 5000);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (volume === 0 && musicPlaying) {
      const timer = setTimeout(() => {
        audioRef.current?.pause();
        setMusicPlaying(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [volume, musicPlaying]);

  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src) {
      audio.src = music;
      audio.loop = true;
    }
    audio.volume = volume;
    audio.play().then(() => setMusicPlaying(true)).catch(() => {});
  }, [volume]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (volume > 0) {
      lastVolumeRef.current = volume;
      setVolume(0);
      audio.pause();
      setMusicPlaying(false);
    } else {
      const newVolume = lastVolumeRef.current || 0.25;
      setVolume(newVolume);
      audio.volume = newVolume;
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  }, [volume]);

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && !musicPlaying) playMusic();
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

  useEffect(() => {
    if (stage !== "console") return;
    if (typedText.length < START_TEXT.length) {
      const timer = setTimeout(
        () => setTypedText(START_TEXT.slice(0, typedText.length + 1)),
        90
      );
      return () => clearTimeout(timer);
    }
  }, [typedText, stage]);

  const isReady = typedText.length === START_TEXT.length;

  // Сердечко с медленной пульсацией и долгой задержкой затемнения
  useEffect(() => {
    if (stage !== "reveal") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId,
      running = true;
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
        scale = 1 + 0.03 * Math.sin(pulseElapsed * 0.002); // медленное дыхание
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);
      ctx.font = "14px Fira Code, monospace";
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

    const addPoint = (t, size, cx, cy, scale, minA, maxA, maxDelay) => {
      const x = 16 * Math.sin(t) ** 3;
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      pointsRef.current.push({
        x: cx + x * scale * size,
        y: cy + y * scale * size,
        alpha: 0,
        targetAlpha: minA + Math.random() * (maxA - minA),
        delay: Math.random() * maxDelay,
      });
    };

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
      const scale = Math.min(window.innerWidth, window.innerHeight) / 45;
      for (let t = 0; t < Math.PI * 2; t += 0.05)
        addPoint(t, 1, cx, cy, scale, 0.8, 1, 2000);
      for (let s = 0.2; s < 1; s += 0.2)
        for (let t = 0; t < Math.PI * 2; t += 0.1)
          addPoint(t, s, cx, cy, scale, 0.3, 0.8, 3000);

      const scheduleFade = () => {
        if (allVisibleTimeRef.current) {
          const fadeAt = allVisibleTimeRef.current + pulseDelay + 6000; // 10 секунд пульсации
          const now = performance.now();
          const delay = Math.max(0, fadeAt - now);
          fadeTimer = setTimeout(() => {
            document.body.classList.add("cinema-fade");
            setTimeout(() => {
              document.body.classList.remove("cinema-fade");
              setStage("slides");
            }, 4500);
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
    if (stage !== "photos") return;
    const timer = setTimeout(() => setStage("end"), photos.length * 3000);
    return () => clearTimeout(timer);
  }, [stage]);

  // Галактический фон
  useEffect(() => {
    if (!["slides", "final", "end", "photos"].includes(stage)) return;
    const canvas = galaxyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId,
      running = true,
      lastTime = 0;
    const fps = 30,
      interval = 1000 / fps;

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
    let running = true,
      animId,
      lastTime = 0;
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
    let lineIndex = 0,
      charIndex = 0,
      cancelled = false;
    const intervals = [],
      timeouts = [];
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
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const openHeart = () => {
    goFullScreen();
    if (isReady && stage === "console") {
      playMusic();
      setStage("memory");
    }
  };

  const currentSlide = slides[slideIndex] ?? slides[0] ?? { title: "", text: "" };

  return (
    <main
      className={`app ${isReady && stage === "console" ? "ready" : ""}`}
      onClick={openHeart}
    >
      <audio ref={audioRef} loop />
      <div className="scanline" />
      <Toaster position="bottom-center" />

      {stage !== "console" && stage !== "preload" && (
        <div className={`music-panel${panelExpanded ? " expanded" : ""}`}>
          <button
            className="music-toggle"
            onClick={handleMusicToggleClick}
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
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Громкость"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
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
            {isReady && (
              <div className="package">
                <p>&gt; One encrypted package found for you.</p>
                <button
                  className="decrypt"
                  onClick={(e) => {
                    e.stopPropagation();
                    playMusic();
                    setStage("memory");
                  }}
                >
                  Decrypt Message
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {stage === "memory" && (
        <section className="console-screen">
          <div className="console">
            <div className="tag">[memory core]</div>
            <p className="memory-date">1 July 2026 Happy Birthday</p>
            <p>{memoryText}</p>
          </div>
        </section>
      )}

      {stage === "reveal" && (
        <section className="reveal-screen">
          <canvas ref={canvasRef} className="heart-canvas" />
          <div className="center-message">
            <h1>Decrypted</h1>
            <div className="divider" />
          </div>
        </section>
      )}

      {stage === "photos" && (
        <section className="photo-screen">
          <canvas ref={galaxyRef} className="galaxy-canvas" />
          <div className="photo-container">
            <div className="photo-pair">
              {photoPairs.map((pair, pairIndex) => (
                <div
                  key={pairIndex}
                  className={`pair-wrapper ${pairIndex === activePair ? "active" : ""}`}
                >
                  {pair.map((photo, idx) => {
                    const globalIndex = pairIndex * 2 + idx;
                    const tilt = polaroidTilts[globalIndex];
                    return (
                      <div
                        key={idx}
                        className="photo-polaroid"
                        style={{ transform: `rotate(${tilt}deg)` }}
                      >
                        <div
                          className="photo-wrapper"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxPhoto({
                              src: photo.src,
                              caption: photo.text,
                            });
                          }}
                        >
                          <img
                            src={photo.src}
                            className="photo"
                            alt={photo.text}
                          />
                          <span className="zoom-icon">
                            <FiZoomIn />
                          </span>
                        </div>
                        <p className="photo-caption">{photo.text}</p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {lightboxPhoto && (
            <PhotoLightbox
              src={lightboxPhoto.src}
              caption={lightboxPhoto.caption}
              onClose={() => setLightboxPhoto(null)}
            />
          )}
        </section>
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
              <button className="reencrypt" onClick={() => setStage("final")}>
                ← Назад
              </button>
              <button
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
                продолжить
              </button>
            </div>
          </div>
        </section>
      )}

      {cardOpen && (
        <div
          className="card-overlay"
          onClick={() => {
            setCardOpen(false);
            setPageIndex(0);
          }}
        >
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <div className="pattern-bg">
              {patternIcons.map((icon, i) => (
                <span
                  key={i}
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
              className="card-close"
              onClick={() => {
                setCardOpen(false);
                setPageIndex(0);
              }}
            >
              ✕
            </button>
            <div className="leaf-animation">
              {leaves.map((leaf, i) => (
                <span
                  key={i}
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
            <h2>{cardPages[pageIndex].title}</h2>
            <p style={{ whiteSpace: "pre-line" }}>
              {cardPages[pageIndex].text}
            </p>
            <div className="card-controls">
              <button onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>
                ←
              </button>
              <span>
                {pageIndex + 1} / {cardPages.length}
              </span>
              <button
                onClick={() =>
                  setPageIndex((p) => Math.min(cardPages.length - 1, p + 1))
                }
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;