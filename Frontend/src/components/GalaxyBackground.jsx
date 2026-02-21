import React, { useRef, useEffect } from 'react'

/**
 * Galaxy-style background adapted for Shiv Enterprises (black, red, white).
 * Inspired by reactbits.dev/backgrounds/galaxy — modified to match site theme.
 */
export default function GalaxyBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId = null
    let time = 0

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
    }

    const starCount = 180
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      speed: 0.0002 + Math.random() * 0.0003,
      twinkle: Math.random() * Math.PI * 2,
    }))

    function draw() {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      if (!w || !h) return

      time += 0.008

      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, w, h)

      const g1 = ctx.createRadialGradient(
        w * 0.3, h * 0.4, 0,
        w * 0.3, h * 0.4, w * 0.8
      )
      g1.addColorStop(0, 'rgba(180, 20, 30, 0.12)')
      g1.addColorStop(0.5, 'rgba(120, 10, 20, 0.06)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(
        w * 0.7, h * 0.6, 0,
        w * 0.7, h * 0.6, w * 0.6
      )
      g2.addColorStop(0, 'rgba(255, 50, 50, 0.08)')
      g2.addColorStop(0.6, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      stars.forEach((star) => {
        const x = (star.x + time * star.speed) % 1
        const xPx = x * w
        const yPx = star.y * h
        const twinkle = 0.7 + 0.3 * Math.sin(time + star.twinkle)
        const alpha = Math.min(1, twinkle)
        ctx.beginPath()
        ctx.arc(xPx, yPx, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      })

      stars.slice(0, 25).forEach((star, i) => {
        const x = (star.x + 0.5 + time * star.speed * 0.7) % 1
        const xPx = x * w
        const yPx = (star.y * 0.8 + 0.1) * h
        const twinkle = 0.5 + 0.4 * Math.sin(time * 1.2 + i * 0.5)
        ctx.beginPath()
        ctx.arc(xPx, yPx, star.r * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 100, 100, ${twinkle * 0.4})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    setSize()
    window.addEventListener('resize', setSize)
    draw()
    return () => {
      window.removeEventListener('resize', setSize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="galaxy-bg"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
