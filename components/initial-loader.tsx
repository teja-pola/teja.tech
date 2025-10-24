"use client"

import React, { useEffect, useState } from "react"

type Props = { children: React.ReactNode }

export function InitialLoader({ children }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    // 1) Try to warm the UFO GLB into the browser cache
    const modelFetch = fetch("/models/ufo.glb", { cache: "force-cache" })
      .then((r) => r.arrayBuffer())
      .catch(() => null)

    // 2) Preload important three modules directly so Starfield, BasketballOrbit and UFO are fetched
    // Note: importing the top-level three-client may not trigger nested dynamic imports,
    // so import the modules directly.
    const preloadBundles = Promise.all([
      import("@/components/three/starfield").then(() => null).catch(() => null),
      import("@/components/three/basketball-orbit").then(() => null).catch(() => null),
      import("@/components/three/ufo").then(() => null).catch(() => null),
      // also import react-three-fiber so its bundle is warmed
      import("@react-three/fiber").then(() => null).catch(() => null),
      import("@react-three/drei").then(() => null).catch(() => null),
    ])

    
    // 4) Wait for all images to load
    const imageLoad = new Promise<void>((resolve) => {
      if (typeof window === "undefined") return resolve()
      
      const images = Array.from(document.querySelectorAll("img"))
      if (images.length === 0) return resolve()
      
      let loadedCount = 0
      const totalImages = images.length
      
      const checkComplete = () => {
        loadedCount++
        if (loadedCount >= totalImages) resolve()
      }
      
      images.forEach(img => {
        if (img.complete) {
          checkComplete()
        } else {
          img.addEventListener("load", checkComplete, { once: true })
          img.addEventListener("error", checkComplete, { once: true })
        }
      })
      
      // Timeout after 8 seconds
      setTimeout(() => resolve(), 8000)
    })

    // 5) Wait for window load (fonts, etc.) but with a timeout to avoid hanging
    const windowLoad = new Promise<void>((resolve) => {
      if (typeof window === "undefined") return resolve()
      if (document.readyState === "complete") return resolve()
      const onLoad = () => {
        resolve()
      }
      window.addEventListener("load", onLoad)
      // safety timeout (10s)
      const t = setTimeout(() => {
        window.removeEventListener("load", onLoad)
        resolve()
      }, 10000)
      // cleanup handled by resolve path
    })

    Promise.all([modelFetch, preloadBundles, imageLoad, windowLoad]).then(() => {
      // small delay for smoother transition
      if (!mounted) return
      setTimeout(() => setReady(true), 500)
    })

    return () => {
      mounted = false
    }
  }, [])

  // expose readiness globally so other client components (starfield, etc.) can wait
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).__siteReady = ready
    }
  }, [ready])

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-6">
          {/* small animated UFO preview */}
          <div className="w-24 h-24 flex items-center justify-center">
            <svg className="-rotate-6" width="96" height="96" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#9be7ff" />
                  <stop offset="100%" stopColor="#6bd3ff" />
                </linearGradient>
              </defs>
              <ellipse cx="32" cy="36" rx="18" ry="6" fill="url(#g1)"></ellipse>
              <g>
                <ellipse cx="32" cy="28" rx="14" ry="6" fill="#cbd5e1" />
                <ellipse cx="32" cy="26" rx="6" ry="3" fill="#0f172a" opacity="0.9" />
              </g>
              <g className="animate-ufo-bob" transform="translate(0,0)">
                <circle cx="32" cy="22" r="2.4" fill="#fff" opacity="0.9" />
              </g>
            </svg>
          </div>
          
          {/* Loading text with animation */}
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Loading Portfolio</div>
            <div className="text-sm opacity-90 mb-4">Preparing 3D assets, music, and content...</div>
            
            {/* Loading dots animation */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes ufoBob { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
          .animate-ufo-bob { animation: ufoBob 1.6s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
