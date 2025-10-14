"use client"

import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"

export function Starfield() {
  return (
    <div className="relative h-[100vh] w-full  overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1] }} className="absolute inset-0">
        <ambientLight intensity={0.2} />
        <Stars radius={80} depth={90} count={900} factor={3} saturation={0} fade speed={0.2} />
      </Canvas>
      
    </div>
  )
}
