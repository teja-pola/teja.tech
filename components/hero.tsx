"use client"

import Image from "next/image"

export function Hero() {
  return (
    <div className="relative z-10 mx-2 w-full h-full flex items-end justify-center">
      <div className="relative w-full  h-full max-w-5xl">
        <Image
          src="/images/hero.png"
          alt="Portrait"
          fill
          priority
          className="object-contain object-bottom pointer-events-none select-none"
        />
      </div>
    </div>
  )
}
