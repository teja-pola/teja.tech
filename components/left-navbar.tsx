'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, FolderGit2, PencilRuler, LibraryBig, Lock } from 'lucide-react';

export function LeftNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const sections = ['home', 'about', 'projects', 'blogs', 'skills'];

  // Set active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleNavigation = (section: string) => {
    const currentIndex = sections.indexOf(activeSection);
    const targetIndex = sections.indexOf(section);
    
    // Only allow forward navigation
    if (targetIndex >= currentIndex) {
      setActiveSection(section);
      router.push(`#${section}`, { scroll: false });
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const Item = ({
    section,
    label,
    icon: Icon,
    isActive,
    isClickable,
  }: {
    section: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    isClickable: boolean;
  }) => {
    return (
      <button
        onClick={() => isClickable && handleNavigation(section)}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition relative ${
          isActive
            ? 'text-foreground bg-foreground/10'
            : isClickable
            ? 'text-muted-foreground hover:text-foreground cursor-pointer'
            : 'text-muted-foreground/30 cursor-not-allowed'
        }`}
        aria-label={label}
        title={isClickable ? label : `Navigate to ${label} (scroll up to access)`}
        disabled={!isClickable}
      >
        <Icon className="h-5 w-5" />
        {!isClickable && (
          <Lock className="absolute -top-1 -right-1 h-3 w-3 text-muted-foreground/50" />
        )}
      </button>
    );
  };

  const currentSectionIndex = sections.indexOf(activeSection);

  return (
    <aside
      aria-label="Site navigation"
      className="glass fixed left-1/2 top-23 z-40 w-[80vw] px-2 py-2 flex justify-center rounded-2xl -translate-x-1/2 -translate-y-1/2 md:left-13 md:top-1/2 md:w-auto md:-translate-y-1/2 md:rounded-2xl md:p-2 md:block"
    >
      <nav className="flex flex-row items-center gap-2 md:flex-col md:items-center md:gap-2">
        {sections.map((section, index) => (
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
            isClickable={index >= currentSectionIndex}
          />
        ))}
      </nav>
    </aside>
  );
}