"use client"

import { useEffect, useRef } from "react"

interface WaveProps {
  className?: string
  speed?: number
  amplitude?: number
  wavelength?: number
}

export default function Wave({
  className = "",
  speed = 0.05,
  amplitude = 20,
  wavelength = 0.01,
}: WaveProps) {
  const waveRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const wave = waveRef.current
    if (!wave) return

    let phase = 0
    const yBase = 200

    function animate() {
      phase += speed
      const points = []
      for (let x = 0; x <= 1440; x += 10) {
        const y =
          Math.sin(x * wavelength + phase) * amplitude * Math.sin(x * 0.02) +
          yBase
        points.push(`${x},${y}`)
      }
      if (wave) {
        wave.setAttribute(
          "d",
          `M0,${yBase} ${points.join(" ")} L1440,320 L0,320 Z`
        )
      }
      requestAnimationFrame(animate)
    }

    animate()
  }, [speed, amplitude, wavelength])

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0099ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0099ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path ref={waveRef} fill="url(#waveGradient)" />
    </svg>
  )
}
