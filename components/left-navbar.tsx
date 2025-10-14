"use client"

import type React from "react"

import { Home, User, FolderGit2, FileText, LibraryBig } from "lucide-react"


export function LeftNavbar() {
  const Item = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <a
      href={href}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition"
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </a>
  )
  return (
    <aside
      aria-label="Site navigation"
      className="glass fixed left-1/2 top-23 z-40 w-[80vw]  px-2 py-2 flex justify-center rounded-2xl -translate-x-1/2 -translate-y-1/2 md:left-13 md:top-1/2 md:w-auto md:-translate-y-1/2 md:rounded-2xl md:p-2 md:block"
    >
      <nav className="flex flex-row items-center gap-2 md:flex-col md:items-center md:gap-2">
        <Item href="#home" label="Home" icon={Home} />
        <Item href="#about" label="About" icon={User} />
        <Item href="#blogs" label="Blog" icon={LibraryBig} />
        <Item href="#projects" label="Projects" icon={FolderGit2} />
        <Item href="#resume" label="Resume" icon={FileText} />
      </nav>
    </aside>
  )
}
