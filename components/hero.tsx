"use client"

import Image from "next/image"

export function Hero() {
  return (
    
      

      
      <div className="relative z-10 mx-auto mt-28 w-[80vw]  h-[80vh]  sticky bottom-0">
        <Image
          src="/images/hero.png"
          alt="Portrait"
          fill
          priority
          sizes="(max-width: 640px) 80vw, 80vw"
          className="object-contain pointer-events-none select-none"
        />
      </div>
    
  )
}
