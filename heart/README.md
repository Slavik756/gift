import { useEffect, useRef, useState } from 'react'
import './App.css'
import music from './assets/music.mp3'

const START_TEXT = 'Initializing heart.PROTOCOL_v2.0...'

function App() {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const pointsRef = useRef([])
  const startRef = useRef(0)

  const heartsRef = useRef(null)
  const heartsAnim = useRef(null)

  const audioRef = useRef(null)

  const [typedText, setTypedText] = useState('')
  const [stage, setStage] = useState('console')
  const [finalText, setFinalText] = useState('')
  const [memoryText, setMemoryText] = useState('')

  // 💌 SLIDES STATE
  const [slideIndex, setSlideIndex] = useState(0)

  const slides = [
    {
      title: 'Почему я счастлив',
      text: `Потому что ты появилась в моей жизни.
Каждый день стал теплее и спокойнее.`,
    },
    {
      title: 'Что я чувствую',
      text: `Я люблю тебя не за что-то.
А просто за то, какая ты есть.`,
    },
    {
      title: 'Как я тебя люблю',
      text: `Тихо. Глубоко. Искренне.
Больше, чем могу выразить словами.`,
    },
    {
      title: 'С днём рождения ❤️',
      text: `Я желаю тебе счастья, которое ты даришь другим.
И чтобы ты всегда чувствовала себя любимой.`,
    },
  ]

  // typing effect
  useEffect(() => {
    if (typedText.length < START_TEXT.length) {
      const timer = setTimeout(() => {
        setTypedText(START_TEXT.slice(0, typedText.length + 1))
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [typedText])

  const isReady = typedText.length === START_TEXT.length

  // HEART CANVAS (UNCHANGED)
  useEffect(() => {
    if (stage !== 'reveal') {
      cancelAnimationFrame(animationRef.current)
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const addPoint = (t, size, cx, cy, scale, minA, maxA, maxDelay) => {
      const x = 16 * Math.sin(t) ** 3
      const y =
        -(13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t))

      pointsRef.current.push({
        x: cx + x * scale * size,
        y: cy + y * scale * size,
        alpha: 0,
        targetAlpha: minA + Math.random() * (maxA - minA),
        delay: Math.random() * maxDelay,
      })
    }

    const init = () => {
      const ratio = window.devicePixelRatio || 1

      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      pointsRef.current = []
      startRef.current = 0

      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const scale = Math.min(window.innerWidth, window.innerHeight) / 45

      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        addPoint(t, 1, cx, cy, scale, 0.8, 1, 2000)
      }

      for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          addPoint(t, s, cx, cy, scale, 0.3, 0.8, 3000)
        }
      }
    }

    const draw = (time) => {
      if (!startRef.current) startRef.current = time

      const elapsed = time - startRef.current

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = '14px Fira Code, monospace'

      pointsRef.current.forEach((p) => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.02
        }

        const text = 'i love you'
        ctx.fillStyle = `rgba(255,77,109,${p.alpha})`

        const w = ctx.measureText(text).width
        ctx.fillText(text, p.x - w / 2, p.y)
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    init()
    animationRef.current = requestAnimationFrame(draw)

    window.addEventListener('resize', init)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', init)
    }
  }, [stage])

  // FINAL hearts (UNCHANGED)
  useEffect(() => {
    if (stage !== 'final') {
      cancelAnimationFrame(heartsAnim.current)
      return
    }

    const canvas = heartsRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const hearts = []

    const spawn = () => {
      hearts.push({
        x: Math.random() * canvas.width,
        y: -20,
        speed: 1 + Math.random() * 2,
        alpha: 1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.2) spawn()

      ctx.font = '20px Arial'

      hearts.forEach((h, i) => {
        h.y += h.speed
        h.alpha -= 0.003

        ctx.globalAlpha = h.alpha
        ctx.fillText('❤️', h.x, h.y)

        if (h.alpha <= 0 || h.y > canvas.height) {
          hearts.splice(i, 1)
        }
      })

      ctx.globalAlpha = 1
      heartsAnim.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(heartsAnim.current)
      window.removeEventListener('resize', resize)
    }
  }, [stage])

  // FINAL TEXT
  useEffect(() => {
    if (stage !== 'final') return

    const text = 'Я люблю тебя. Спасибо, что ты есть ❤️'
    let i = 0

    setFinalText('')

    const interval = setInterval(() => {
      setFinalText(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 50)

    return () => clearInterval(interval)
  }, [stage])

  // MEMORY
  useEffect(() => {
    if (stage !== 'memory') return

    const lines = [
      'Scanning memories...',
      'Loading first meeting...',
      'Processing emotions...',
      'Almost ready ❤️',
    ]

    let lineIndex = 0
    let charIndex = 0

    setMemoryText('')

    const typeLine = () => {
      const currentLine = lines[lineIndex]

      if (!currentLine) {
        setTimeout(() => setStage('reveal'), 800)
        return
      }

      const interval = setInterval(() => {
        setMemoryText(currentLine.slice(0, charIndex))
        charIndex++

        if (charIndex > currentLine.length) {
          clearInterval(interval)

          setTimeout(() => {
            setMemoryText('')
            lineIndex++
            charIndex = 0
            typeLine()
          }, 1400)
        }
      }, 70)
    }

    typeLine()

    return () => setMemoryText('')
  }, [stage])

  // REVEAL -> SLIDES (UPDATED)
  useEffect(() => {
    if (stage !== 'reveal') return

    const fadeIn = setTimeout(() => {
      document.body.classList.add('cinema-fade')
    }, 7500)

    const switchStage = setTimeout(() => {
      document.body.classList.remove('cinema-fade')
      setStage('slides')   // ← ВАЖНО: теперь в слайды
    }, 10000)

    return () => {
      clearTimeout(fadeIn)
      clearTimeout(switchStage)
    }
  }, [stage])

  // SLIDES AUTO PLAY
  useEffect(() => {
    if (stage !== 'slides') return

    setSlideIndex(0)

    const interval = setInterval(() => {
      setSlideIndex((prev) => {
        if (prev >= slides.length - 1) {
          clearInterval(interval)
          setTimeout(() => setStage('final'), 1000)
          return prev
        }
        return prev + 1
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [stage])

  const openHeart = () => {
    if (isReady && stage === 'console') {
      if (audioRef.current) {
        audioRef.current.volume = 0.25
        audioRef.current.play().catch(() => {})
      }

      setStage('memory')
    }
  }

  return (
    <main
      className={`app ${isReady && stage === 'console' ? 'ready' : ''}`}
      onClick={openHeart}
    >
      <audio ref={audioRef} loop>
        <source src={music} type="audio/mpeg" />
      </audio>

      <div className="scanline" />

      {/* CONSOLE */}
      {stage === 'console' && (
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
  e.stopPropagation()

  if (audioRef.current) {
    audioRef.current.volume = 0.25
    audioRef.current.play().catch(console.error)
  }

  setStage('memory')
}}
                >
                  Decrypt Message
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MEMORY */}
      {stage === 'memory' && (
        <section className="console-screen">
          <div className="console">
            <div className="tag">[memory core]</div>
            <p>{memoryText}</p>
          </div>
        </section>
      )}

      {/* REVEAL */}
      {stage === 'reveal' && (
        <section className="reveal-screen">
          <canvas ref={canvasRef} className="heart-canvas" />

          <div className="center-message">
            <h1>Decrypted</h1>
            <div className="divider" />
          </div>
        </section>
      )}

      {/* 💌 SLIDES */}
      {stage === 'slides' && (
        <section className="reveal-screen">
          <div className="center-message">
            <h1>{slides[slideIndex].title}</h1>
            <div className="divider" />
            <p style={{ maxWidth: 600, whiteSpace: 'pre-line' }}>
              {slides[slideIndex].text}
            </p>
          </div>
        </section>
      )}

      {/* FINAL */}
      {stage === 'final' && (
        <section className="reveal-screen">
          <canvas
            ref={heartsRef}
            className="heart-canvas"
            style={{ zIndex: 0 }}
          />

          <div className="center-message" style={{ zIndex: 2 }}>
            <h1>💖 MESSAGE DECRYPTED</h1>

            <div className="divider" />

            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600 }}>
              {finalText}
            </p>

            <button
              className="reencrypt"
              onClick={() => setStage('slides')}
            >
              продолжить
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App  