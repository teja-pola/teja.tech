"use client"

import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { useEffect, useState } from "react"

export function Starfield() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // wait for the global readiness flag set by InitialLoader
    if (typeof window === "undefined") return setReady(true)
    if ((window as any).__siteReady) return setReady(true)

    const interval = setInterval(() => {
      if ((window as any).__siteReady) {
        clearInterval(interval)
        setReady(true)
      }
    }, 150)
    // safety timeout
    const t = setTimeout(() => {
      clearInterval(interval)
      setReady(true)
    }, 15000)
    return () => {
      clearInterval(interval)
      clearTimeout(t)
    }
  }, [])

  if (!ready) return null

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 1] }} className="absolute inset-0">
        <ambientLight intensity={0.2} />
        <Stars radius={80} depth={90} count={900} factor={3} saturation={0} fade speed={0.2} />
      </Canvas>
    </div>
  )
}
