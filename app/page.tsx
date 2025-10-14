
import { Suspense } from "react"
import { Hero } from "@/components/hero"
import { IPhoneSocials } from "@/components/iphone-socials"
import { Projects } from "@/components/projects"
import { ChatAboutMe } from "@/components/chat-about-me"
import { LeftNavbar } from "@/components/left-navbar"
import { ViewerPulse } from "@/components/viewer-pulse"
import { CountryFlagCursor } from "@/components/country-flag-cursor"
import { DiagonalMarquee } from "@/components/diagonal-marquee"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThreeClient } from "@/components/three-client"

export default function Page() {
  // client-only three.js components are provided by <ThreeClient />

  return (
    <main className="relative">
      <LeftNavbar />
      <ViewerPulse />
      <DiagonalMarquee />
      <CountryFlagCursor />

      {/* floating glass navbar 
      <nav className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-background/40 px-3 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/30">
        <ul className="flex items-center gap-4 text-xs">
          <li>
            <a href="#home" className="text-muted-foreground hover:text-foreground transition">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition">
              About
            </a>
          </li>
          <li>
            <a href="#blogs" className="text-muted-foreground hover:text-foreground transition">
              Blogs
            </a>
          </li>
          <li>
            <a href="#projects" className="text-muted-foreground hover:text-foreground transition">
              Projects
            </a>
          </li>
          <li>
            <a href="#resume" className="text-muted-foreground hover:text-foreground transition">
              Resume
            </a>
          </li>
          <li className="pl-2">
            <ThemeToggle />
          </li>
        </ul>
      </nav>*/}

      

      {/* Hero with star background */}
      <section id="home" className="relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 pointer-events-none">
          <ThreeClient />
          {/* shooting stars overlay */}
          <div className="shooting-star" />
          
        </div>
        <div className="relative">
          <Hero />
        </div>
        {/* visual accent (three client renders orbit) */}
      </section>

      {/* iPhone socials */}
      <section id="about" className="mx-auto w-full max-w-screen-md px-4 py-10 md:py-14">
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">SOCIALS</h2>
        <IPhoneSocials />
      </section>

      {/* Featured Projects */}
      <section id="projects" className="mx-auto w-full max-w-screen-md px-4 py-10 md:py-14">
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">PROJECTS</h2>
  <Projects />
      </section>

      {/* Chat about me */}
      <section id="blogs" className="mx-auto w-full max-w-screen-md px-4 py-10 md:py-14">
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">ASK ABOUT ME</h2>
        <ChatAboutMe />
      </section>

      <footer id="resume" className="mx-auto w-full max-w-screen-md px-4 pb-10 pt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dharma Teja Pola
      </footer>
    </main>
  )
}
