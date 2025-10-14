"use client"

import Image from "next/image"

export function Hero() {
  return (
    <div className="relative mx-auto max-w-screen-xl px-4 py-16 md:py-24 min-h-[100svh]">
      {/* Big creative overlay text */}
      <div className="pointer-events-none absolute inset-x-0 top-20 z-20 mx-auto w-full max-w-5xl text-center">
        <span className="block text-left text-xl md:text-2xl font-medium italic text-primary/80 pl-2 md:pl-8">
          a boy
        </span>
        <h1 className="mx-auto text-center font-semibold tracking-tight text-balance text-[40px] leading-[0.95] md:text-[88px] text-foreground/90">
          <span className="relative inline-block">
            <span className="opacity-90">WITH POCKET FULL OF</span>
            <span className="absolute inset-0 -z-10 rounded-md border-2 border-foreground/20"></span>
          </span>
        </h1>
        <span className="block text-right text-xl md:text-2xl font-medium italic text-primary/80 pr-2 md:pr-8">
          creativity.
        </span>
      </div>

      {/* Center portrait in front */}
      <div className="relative z-10 mx-auto mt-25 w-[80vw]  h-[80vh]  sticky bottom-0">
        <Image
          src="/images/hero-cutout.png"
          alt="Portrait"
          fill
          priority
          sizes="(max-width: 640px) 80vw, 80vw"
          className="object-contain pointer-events-none select-none"
        />
      </div>
    </div>
  )
}
