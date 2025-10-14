"use client"

export function DiagonalMarquee() {
  return (
    <div
      aria-hidden
      className="diagonal-marquee"
      style={{
        height: "64px", 
        fontSize: "1.5rem", 
      }}
    >
      <div className="diagonal-inner">
        <span>
          2x International Hackathon Winner • 2x International Hackathon Winner • 2x International Hackathon Winner •{" "}
        </span>
        <span>
          2x International Hackathon Winner • 2x International Hackathon Winner • 2x International Hackathon Winner •{" "}
        </span>
      </div>
    </div>
  )
}
