import { useEffect, useRef, useState } from 'react'
import './App.css'

const START_TEXT = 'Initializing heart.PROTOCOL_v2.0...'

function App() {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const pointsRef = useRef([])
  const startRef = useRef(0)
  const [typedText, setTypedText] = useState('')
  const [stage, setStage] = useState('console')

  useEffect(() => {
    if (typedText.length < START_TEXT.length) {
      const timer = setTimeout(() => {
        setTypedText(START_TEXT.slice(0, typedText.length + 1))
      }, 35)
      return () => clearTimeout(timer)
    }
  }, [typedText])

  const isReady = typedText.length === START_TEXT.length

  useEffect(() => {
    if (stage !== 'reveal') {
      cancelAnimationFrame(animationRef.current)
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const addPoint = (t, size, centerX, centerY, scale, minAlpha, maxAlpha, maxDelay) => {
      const x = 16 * Math.sin(t) ** 3
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      )

      pointsRef.current.push({
        x: centerX + x * scale * size,
        y: centerY + y * scale * size,
        alpha: 0,
        targetAlpha: minAlpha + Math.random() * (maxAlpha - minAlpha),
        delay: Math.random() * maxDelay,
      })
    }

    const initPoints = () => {
      const ratio = Math.max(1, window.devicePixelRatio || 1)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      pointsRef.current = []
      startRef.current = 0

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const scale = Math.min(window.innerWidth, window.innerHeight) / 45

      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        addPoint(t, 1, centerX, centerY, scale, 0.8, 1, 2000)
      }

      for (let size = 0.2; size < 1; size += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          addPoint(t, size, centerX, centerY, scale, 0.4, 0.8, 3000)
        }
      }
    }

    const draw = (time) => {
      if (!startRef.current) startRef.current = time

      const elapsed = time - startRef.current
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = '14px "Fira Code", ui-monospace, monospace'
      ctx.textBaseline = 'middle'

      pointsRef.current.forEach((point) => {
        if (elapsed > point.delay) {
          point.alpha += (point.targetAlpha - point.alpha) * 0.02
        }

        const text = 'i love you'
        ctx.fillStyle = `rgba(255, 77, 109, ${point.alpha})`
        ctx.fillText(text, point.x - ctx.measureText(text).width / 2, point.y)
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    initPoints()
    animationRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', initPoints)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', initPoints)
    }
  }, [stage])

  const openHeart = () => {
    if (isReady && stage === 'console') setStage('reveal')
  }

  return (
    <main className={`app ${isReady && stage === 'console' ? 'ready' : ''}`} onClick={openHeart}>
      <div className="scanline" />

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
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setStage('reveal')
                  }}
                >
                  <span className="lock" aria-hidden="true" />
                  <span>Decrypt Message</span>
                  <span className="terminal-cursor" />
                </button>
                <span className="hint">(or just click anywhere)</span>
              </div>
            )}
          </div>
        </section>
      )}

      {stage === 'reveal' && (
        <section className="reveal-screen">
          <canvas ref={canvasRef} className="heart-canvas" />

          <div className="center-message">
            <h1>Decrypted</h1>
            <div className="divider" />
            <button
              className="reencrypt"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setStage('console')
              }}
            >
              Re-encrypt
            </button>
          </div>

          <div className="debug left">
            <div>ln: 420</div>
            <div>id: 0xDEADBEEF</div>
            <div>type: organic_emotion</div>
          </div>
          <div className="debug right">heart_reveal // success</div>
        </section>
      )}
    </main>
  )
}

export default App


