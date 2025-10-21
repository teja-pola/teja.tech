"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"

const Starfield = dynamic(() => import("@/components/three/starfield").then((m) => m.Starfield), {
  ssr: false,
  loading: () => null,
})

const BasketballOrbit = dynamic(
  () => import("@/components/three/basketball-orbit").then((m) => m.BasketballOrbit),
  { ssr: false, loading: () => null }
)

const UFO = dynamic(() => import("@/components/three/ufo").then((m) => m.UFO), { 
  ssr: false, 
  loading: () => null 
})


export function ThreeClient() {
  return (
    <>
      <Suspense fallback={null}>
        <Starfield />
      </Suspense>

      <div className="pointer-events-none absolute left-80 right-2 bottom-2 h-24 w-24 md:right-32 md:bottom-8 md:h-32 md:w-32 opacity-100">
        <Suspense fallback={null}>
          <BasketballOrbit />
        </Suspense>
      </div>

      {/* Fullscreen UFO canvas constrained to its parent (hero) so UFO appears only inside the hero section */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-100">
        <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 8] }} className="absolute inset-0">
              <Environment preset="sunset" background={false} />
              <ambientLight intensity={0.6} />
              <directionalLight intensity={0.8} position={[5, 5, 5]} />
              {/* start bottom-left, end top-right in canvas coordinates */}
              <UFO start={[-3, -2.2, 0]} end={[3, 1.2, 0]} duration={7} helixRadius={0.9} />
          </Canvas>
        </Suspense>
      </div>

    </>
  )
}
