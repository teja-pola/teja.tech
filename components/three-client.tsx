"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const Starfield = dynamic(() => import("@/components/three/starfield").then((m) => m.Starfield), {
  ssr: false,
  loading: () => <div className="h-72 w-full rounded-md bg-muted" aria-hidden />,
})

const BasketballOrbit = dynamic(
  () => import("@/components/three/basketball-orbit").then((m) => m.BasketballOrbit),
  { ssr: false, loading: () => null }
)

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
    </>
  )
}
