import { Hero } from "@/components/hero"
import { IPhoneSocials } from "@/components/iphone-socials"
import { Projects } from "@/components/projects"
import { LeftNavbar } from "@/components/left-navbar"
import { ViewerPulse } from "@/components/viewer-pulse"
import { CountryFlagCursor } from "@/components/country-flag-cursor"
import { DiagonalMarquee } from "@/components/diagonal-marquee"
import { ThreeClient } from "@/components/three-client"
import { InitialLoader } from "@/components/initial-loader"
import { Button } from "@/components/ui/button"
import BlogBlocks from "@/components/blog-blocks"
import { SkillsPhysics } from "@/components/skills-physics"



export default function Page() {
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

        <section id="about" className="overlay-screen">
          <div className="mx-auto w-full md:w-11/12 lg:w-4/5 max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start my-25">
              {/* left: heading stack + description + CTA */}
              <div className="space-y-5 md:space-y-6 my-[50px]">
                {/* small intro */}
                <p className="text-xs md:text-sm tracking-wider text-muted-foreground uppercase">Hi, I&apos;m</p>
                {/* big name */}
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none text-foreground">
                  DHARMATEJA
                </h3>
                {/* faded role line */}
                <p className="text-base md:text-lg text-muted-foreground">Full‑Stack Developer @ Parul University</p>
                {/* description */}
                <p className="text-pretty leading-relaxed text-foreground/90">
                  I&apos;m a product builder (… full‑stack developer) who loves to iterate ideas and ship thoughtful
                  products end‑to‑end. I enjoy open‑source contributions and crafting dependable, fast experiences
                  powered by AI.
                </p>
                {/* CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* resume file is stored in public/files/ - link with download attribute */}
                  <a href="/files/DharmaTejaPola(1:75:77).pdf" download="DharmaTejaPola.pdf">
                    <Button size="lg" className="font-semibold">
                      Download Resume
                    </Button>
                  </a>
                </div>
                {/* unique off-duty line */}
                <div className="relative inline-block select-none mt-4">
                  {/* red pin (pivot) */}
                  <span
                    aria-hidden
                    className="absolute -left-2 -top-2 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 ring-2 ring-black/40 shadow-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/85" />
                  </span>
                  <p className="m-0 bg-orange-200 text-[33px] md:text-[33px] leading-tight font-semibold border-0 py-1.5 pl-5 pr-2 rounded-[3px] origin-top-left rotate-[2deg] shadow-md text-chart-1">
                    {"When I'm not coding, I do content creation. "}
                    <span className="text-[8px]">{"tap the logos on the right to explore my socials."}</span>
                  </p>
                </div>
              </div>

              {/* right: iPhone socials */}
              <div className="flex justify-center md:justify-end">
                <IPhoneSocials />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="overlay-screen">
          <div className="mx-auto w-full md:w-11/12 lg:w-4/5 max-w-screen-xl px-4 py-12 my-6">
            
            <Projects />
          </div>
        </section>

        {/* Blogs */}
        <section id="blogs" className="overlay-screen">
          <div className="mx-auto w-full md:w-11/12 lg:w-4/5 max-w-screen-xl px-4 py-12">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-extrabold">Blogs</h2>
            </div>
            <BlogBlocks />
          </div>
        </section>

        {/* Skills and Interests */}
        <section id="skills" className="overlay-screen py-12">
          <div className="mx-auto w-full md:w-11/12 lg:w-4/5 max-w-screen-xl px-4">
            <div className="flex items-center justify-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Skills & Interests</h2>
            </div>
            <div className="w-full h-[80vh] rounded-xl overflow-hidden">
              <SkillsPhysics />
            </div>
            <div className="mt-6 text-center text-muted-foreground text-sm">
              <p>Click and drag to interact with the items</p>
            </div>
          </div>
        </section>
        
         {/*Ask me anything */}
         <section id="ask" className="overlay-screen">
          <div className="mx-auto w-full md:w-11/12 lg:w-4/5 max-w-screen-xl px-4 py-12">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-extrabold">Ask Me Anything</h2>
            </div>
            
          </div>
          <div className="w-full flex justify-center">
            <footer
              className="text-xs text-muted-foreground text-center w-full pb-4 font-[Space_Grotesk] absolute bottom-0 left-0 flex justify-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              © {new Date().getFullYear()} Dharma Teja Pola
            </footer>
          </div>
        </section>
        
        
      </main>
    </InitialLoader>
  )
}
