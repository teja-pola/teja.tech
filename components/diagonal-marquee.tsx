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
      <style>
      {`
        @media (max-width: 640px) {
        .diagonal-marquee {
          font-size: 0.7rem !important;
          transform: rotate(25deg);
          top: 0.25rem;
          right: -9rem;
        }
        }
      `}
      </style>
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
