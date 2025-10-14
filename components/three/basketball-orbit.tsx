"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type * as THREE from "three"

function Ball() {
  const ref = useRef<THREE.Mesh>(null!)
  const t0 = performance.now()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + t0 * 0.0001
    const r = 0.8
    ref.current.position.x = Math.cos(t) * r
    ref.current.position.y = Math.sin(t * 1.3) * 0.3
    ref.current.rotation.y += 0.02
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color="#D97706" roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

export function BasketballOrbit() {
  return (
    <Canvas camera={{ position: [0, 0, 2] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 2]} intensity={0.6} />
      <Ball />
    </Canvas>
  )
}
