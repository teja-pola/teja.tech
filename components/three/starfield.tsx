"use client"

import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"

export function Starfield() {
  return (
    <div className="relative h-[50vh] w-full md:h-[60vh] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1] }} className="absolute inset-0">
        <ambientLight intensity={0.4} />
        <Stars radius={80} depth={50} count={900} factor={1} saturation={0} fade speed={0.4} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 0 }).map((_, i) => (
          <div key={i} className="shooting-star" />
        ))}
      </div>
    </div>
  )
}
