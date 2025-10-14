"use client"

import type React from "react"

import { Home, User, FolderGit2, FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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
      className="glass fixed left-3 top-1/2 z-40 -translate-y-1/2 rounded-2xl p-2 md:left-6"
      style={{ width: 56 }}
    >
      <nav className="flex flex-col items-center gap-2">
        <Item href="#home" label="Home" icon={Home} />
        <Item href="#about" label="About" icon={User} />
        <Item href="#projects" label="Projects" icon={FolderGit2} />
        <Item href="#resume" label="Resume" icon={FileText} />
      </nav>
      <div className="home-indicator" />
    </aside>
  )
}
