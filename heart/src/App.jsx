import { useEffect, useRef, useState, useMemo } from "react";
import "./App.css";
import music from "./assets/music/music.mp3";

import img1 from "./assets/photos/1.jpg";
import img2 from "./assets/photos/2.jpg";
import img3 from "./assets/photos/3.jpg";
import img4 from "./assets/photos/4.jpg";

const START_TEXT = "Initializing heart.PROTOCOL_v2.0...";

function App() {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const pointsRef = useRef([]);
  const startRef = useRef(0);

  const heartsRef = useRef(null);
  const heartsRefLocal = useRef([]);

  const audioRef = useRef(null);

  const galaxyRef = useRef(null);
  const galaxyAnim = useRef(null);

  const heartAnimRef = useRef(null);
  const intervalsRef = useRef([]);
  const timeoutsRef = useRef([]);
  const starsRef = useRef([]);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [stage, setStage] = useState("console");
  const [finalText, setFinalText] = useState("");
  const [memoryText, setMemoryText] = useState("");

  const [slideIndex, setSlideIndex] = useState(0);
  const [slideText, setSlideText] = useState("");

  const [cardOpen, setCardOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const [photoVisible, setPhotoVisible] = useState(true);

  const addInterval = (id) => intervalsRef.current.push(id);
  const addTimeout = (id) => timeoutsRef.current.push(id);

  const clearAllTimers = () => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
  };

  const photos = [
    { src: img1, text: "Ты 💖" },
    { src: img2, text: "Моменты" },
    { src: img3, text: "Улыбка" },
    { src: img4, text: "Навсегда" },
  ];

  const cardPages = [
    {
      title: "Для тебя ❤️",
      text: `Ты — самое тёплое, что есть в моём мире.
И эта открытка — маленькая попытка это показать.`,
    },
    {
      title: "Любовь",
      text: `Я люблю тебя спокойно.
Без шума. Без условий.
Просто потому что ты — это ты.`,
    },
    {
      title: "Спасибо",
      text: `За твой смех.
За твоё присутствие.
За то, что ты есть в моей жизни.`,
    },
    {
      title: "Пожелание",
      text: `Я хочу, чтобы ты всегда чувствовала себя любимой.
И никогда не сомневалась в своей ценности.`,
    },
  ];

  const slides = [
    {
      title: "Запуск воспоминаний",
      text: `Инициализация чувств...
Ты — первый стабильный сигнал в моей жизни.`,
    },
    {
      title: "Почему я счастлив",
      text: `Потому что ты появилась в моей жизни.
Каждый день стал теплее и спокойнее.`,
    },
    {
      title: "Маленькие моменты",
      text: `Твои сообщения.
Твоя тишина рядом.
Даже обычные дни стали особенными.`,
    },
    {
      title: "Что я чувствую",
      text: `Я люблю тебя не за что-то.
А просто за то, какая ты есть.`,
    },
    {
      title: "Когда тебя нет рядом",
      text: `Мир становится тише.
Но мысль о тебе всё равно рядом.`,
    },
    {
      title: "Как я тебя люблю",
      text: `Тихо. Глубоко. Искренне.
Больше, чем могу выразить словами.`,
    },
    {
      title: "Будущее",
      text: `Я хочу ещё тысячи таких дней.
С тобой.`,
    },
    {
      title: "С днём рождения ❤️",
      text: `Я желаю тебе счастья, которое ты даришь другим.
И чтобы ты всегда чувствовала себя любимой.`,
    },
  ];

  useEffect(() => {
    if (typedText.length < START_TEXT.length) {
      const timer = setTimeout(() => {
        setTypedText(START_TEXT.slice(0, typedText.length + 1));
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [typedText]);

  const isReady = typedText.length === START_TEXT.length;

  useEffect(() => {
    if (stage !== "reveal") {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
      const ratio = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      pointsRef.current = [];
      startRef.current = 0;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const scale = Math.min(window.innerWidth, window.innerHeight) / 45;

      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        addPoint(t, 1, cx, cy, scale, 0.8, 1, 2000);
      }

      for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          addPoint(t, s, cx, cy, scale, 0.3, 0.8, 3000);
        }
      }
    };

    const draw = (time) => {
      if (!startRef.current) startRef.current = time;

      const elapsed = time - startRef.current;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = "14px Fira Code, monospace";

      pointsRef.current.forEach((p) => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        const text = "i love you";
        ctx.fillStyle = `rgba(255,77,109,${p.alpha})`;

        const w = ctx.measureText(text).width;
        ctx.fillText(text, p.x - w / 2, p.y);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    init();
    animationRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", init);
    };
  }, [stage]);

  useEffect(() => {
  if (stage !== "photos") return;

  const interval = setInterval(() => {
    setPhotoIndex((prev) => prev + 2);
  }, 4000);

  return () => clearInterval(interval);
}, [stage]);

  useEffect(() => {
    if (stage !== "photos") return;

    const timer = setTimeout(
      () => {
        setStage("end");
      },
      (photos.length / 2) * 4000,
    );

    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (!["slides", "final", "end", "photos"].includes(stage)) return;

    const canvas = galaxyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      starsRef.current = Array.from({ length: 180 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 2 + 0.2,
        r: Math.random() * 1.4 + 0.3,
        speed: 0.2 + Math.random() * 0.6,
      }));
    };

    const draw = () => {
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

        const alpha = 0.3 + s.z * 0.4;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      galaxyAnim.current = requestAnimationFrame(draw);
    };

    resize();
    galaxyAnim.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    return () => {
      if (galaxyAnim.current) cancelAnimationFrame(galaxyAnim.current);
      window.removeEventListener("resize", resize);
    };
  }, [stage]);

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  useEffect(() => {
    if (stage !== "slides") return;
    const text = slides[slideIndex].text;
    setSlideText("");

    let i = 0;

    const interval = setInterval(() => {
      i++;
      setSlideText(text.slice(0, i));

      if (i > text.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [stage, slideIndex]);

  useEffect(() => {
    if (!["slides", "final", "end"].includes(stage)) return;

    heartsRefLocal.current = [];
    const canvas = heartsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    const hearts = heartsRefLocal.current;
    hearts.length = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // 🔥 ЖЁСТКИЙ ЛИМИТ (главный фикс лагов)
    const MAX_HEARTS = 80;

    const spawn = () => {
      if (hearts.length >= MAX_HEARTS) return;

      hearts.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        speed:
          stage === "final" ? 0.6 + Math.random() * 1 : 1 + Math.random() * 1.5,
        alpha: 1,
        size: 14 + Math.random() * 8,
      });
    };

    const draw = () => {
      if (!running) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 🔥 СИЛЬНО УМЕНЬШЕН SPAWN
      const spawnRate = stage === "final" ? 0.03 : 0.12;
      if (Math.random() < spawnRate) spawn();

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];

        h.y += h.speed;
        h.x += Math.sin(h.y * 0.01) * 0.15;

        // 🔥 меньше нагрузка на alpha
        h.alpha -= stage === "final" ? 0.001 : 0.0025;

        ctx.globalAlpha = h.alpha;
        ctx.font = `${h.size}px Arial`;
        ctx.fillText("❤️", h.x, h.y);

        if (h.alpha <= 0 || h.y > window.innerHeight + 50) {
          hearts.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      heartAnimRef.current = requestAnimationFrame(draw);
    };

    heartAnimRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      heartsRefLocal.current = [];
      cancelAnimationFrame(heartAnimRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "final") return;

    const text = "Я люблю тебя. Спасибо, что ты есть ❤️";
    let i = 0;

    setFinalText("");

    const interval = setInterval(() => {
      setFinalText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== "memory") return;

    const lines = [
      "Scanning memories...",
      "Loading first meeting...",
      "Processing emotions...",
      "Almost ready ❤️",
    ];

    let lineIndex = 0;
    let charIndex = 0;

    setMemoryText("");

    const runLine = () => {
      const line = lines[lineIndex];

      if (!line) {
        const t = setTimeout(() => setStage("reveal"), 800);
        addTimeout(t);
        return;
      }

      const interval = setInterval(() => {
        setMemoryText(line.slice(0, charIndex));
        charIndex++;

        if (charIndex > line.length) {
          clearInterval(interval);

          const t = setTimeout(() => {
            setMemoryText("");
            lineIndex++;
            charIndex = 0;
            runLine();
          }, 1400);

          addTimeout(t);
        }
      }, 70);

      addInterval(interval);
      return () => {
        clearInterval(interval);
      };
    };

    runLine();
  }, [stage]);

 const playMusic = () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (!audio.src) {
    audio.src = music;
    audio.loop = true;
  }

  audio.volume = 0.25;

  audio.play().catch(() => {});
};

  useEffect(() => {
    if (stage !== "reveal") return;

    const fadeIn = setTimeout(() => {
      document.body.classList.add("cinema-fade");
    }, 7500);

    const switchStage = setTimeout(() => {
      document.body.classList.remove("cinema-fade");
      setStage("slides");
    }, 10000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(switchStage);
    };
  }, [stage]);

  const goFullScreen = () => {
    const el = document.documentElement;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  useEffect(() => {
    if (stage !== "slides") return;

    let i = 0;

    const interval = setInterval(() => {
      i++;

      if (i >= slides.length) {
        clearInterval(interval);

        const t = setTimeout(() => setStage("final"), 5000);
        addTimeout(t);

        return;
      }

      setSlideIndex(i);
    }, 9000);

    addInterval(interval);

    return () => clearInterval(interval);
  }, [stage]);

  const openHeart = () => {
    goFullScreen();
    if (isReady && stage === "console") {
      playMusic();
      setStage("memory");
    }
  };

  const leaves = useMemo(
    () =>
      Array.from({ length: 12 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: 12 + Math.random() * 10,
      })),
    [],
  );

  const currentSlide = slides[slideIndex] || slides[0];

  return (
    <main
      className={`app ${isReady && stage === "console" ? "ready" : ""}`}
      onClick={openHeart}
    >
      <audio ref={audioRef} loop />

      <div className="scanline" />

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

            <p className="memory-date">25 июня 2026</p>

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
              {photos[photoIndex] && (
                <img
                  src={photos[photoIndex].src}
                  className={`photo ${photoVisible ? "show" : ""}`}
                />
              )}

              {photos[photoIndex + 1] && (
                <img
                  src={photos[photoIndex + 1].src}
                  className={`photo ${photoVisible ? "show" : ""}`}
                />
              )}
            </div>

            <p className="photo-text">{photos[photoIndex].text}</p>
          </div>
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
            <button
              className="reencrypt"
              onClick={() => {
                setPageIndex(0);
                setCardOpen(true);
              }}
            >
              открыть открытку
            </button>
            <button
              className="reencrypt"
              onClick={() => {
                setStage("photos");
              }}
            >
              продолжить
            </button>
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
