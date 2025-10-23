'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, FolderGit2, PencilRuler, LibraryBig } from 'lucide-react';

export function LeftNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const sections = ['home', 'about', 'projects', 'blogs', 'skills'];

  // Set active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently most visible in viewport
      let currentSection = 'home';
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.3; // 30% from top

      // Check each section from last to first (so earlier sections take precedence)
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollPosition;
        
        // If we've scrolled past this section's start point
        if (scrollPosition + threshold >= elementTop) {
          currentSection = section;
          break;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sections]);

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    router.push(`#${section}`, { scroll: false });
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Item = ({
    section,
    label,
    icon: Icon,
    isActive,
  }: {
    section: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
  }) => {
    return (
      <button
        onClick={() => handleNavigation(section)}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ease-in-out relative ${
          isActive
            ? 'text-foreground bg-foreground/10 scale-110 shadow-lg'
            : 'text-muted-foreground hover:text-foreground hover:scale-105 cursor-pointer'
        }`}
        aria-label={label}
        title={label}
      >
        <Icon className={`transition-transform duration-300 ${isActive ? 'h-5 w-5' : 'h-5 w-5'}`} />
        {isActive && (
          <span className="absolute inset-0 rounded-xl bg-foreground/5 animate-pulse" />
        )}
      </button>
    );
  };

  return (
    <aside
      aria-label="Site navigation"
      className="glass fixed left-1/2 top-23 z-40 w-[80vw] px-2 py-2 flex justify-center rounded-2xl -translate-x-1/2 -translate-y-1/2 md:left-13 md:top-1/2 md:w-auto md:-translate-y-1/2 md:rounded-2xl md:p-2 md:block"
    >
      <nav className="flex flex-row items-center gap-2 md:flex-col md:items-center md:gap-2">
        {sections.map((section) => (
          <Item
            key={section}
            section={section}
            label={section.charAt(0).toUpperCase() + section.slice(1)}
            icon={
              section === 'home' ? Home :
              section === 'about' ? User :
              section === 'projects' ? FolderGit2 :
              section === 'blogs' ? LibraryBig :
              PencilRuler
            }
            isActive={activeSection === section}
          />
        ))}
      </nav>
    </aside>
  );
}