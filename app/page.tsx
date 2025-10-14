import { Hero } from "@/components/hero"
import { IPhoneSocials } from "@/components/iphone-socials"
import { Projects } from "@/components/projects"
import { ChatAboutMe } from "@/components/chat-about-me"
import { LeftNavbar } from "@/components/left-navbar"
import { ViewerPulse } from "@/components/viewer-pulse"
import { CountryFlagCursor } from "@/components/country-flag-cursor"
import { DiagonalMarquee } from "@/components/diagonal-marquee"
import { ThreeClient } from "@/components/three-client"
import { InitialLoader } from "@/components/initial-loader"

export default function Page() {
  // client-only three.js components are provided by <ThreeClient />
  return (
    <InitialLoader>
      <main className="relative">
        <LeftNavbar />
        <ViewerPulse />
        <DiagonalMarquee />
        <CountryFlagCursor />

        {/* Hero with star background - full viewport and fixed so content can overlay */}
        <section id="home" aria-hidden className="hero-fixed z-0">
          <div className="absolute inset-0 pointer-events-none">
            <ThreeClient />
            <div className="shooting-star" />
          </div>
          <div className="relative h-full z-10">
            <Hero />
          </div>
        </section>

        <section aria-hidden className="overlay-spacer" />

        {/* iPhone socials */}
        <section id="about" className="overlay-screen">
          <div className="container">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">SOCIALS</h2>
            <IPhoneSocials />
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="overlay-screen">
          <div className="container">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">PROJECTS</h2>
            <Projects />
          </div>
        </section>

        {/* Chat about me */}
        <section id="blogs" className="overlay-screen">
          <div className="container">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">ASK ABOUT ME</h2>
            <ChatAboutMe />
          </div>
        </section>

        {/* Resume section */}
        <section id="resume" className="overlay-screen">
          <div className="container">
            <footer className="text-xs text-muted-foreground">© {new Date().getFullYear()} Dharma Teja Pola</footer>
          </div>
        </section>
      </main>
    </InitialLoader>
  )
}
