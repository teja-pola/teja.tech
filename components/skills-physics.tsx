'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  'React', 'TypeScript', 'Node.js', 'Next.js',
  'PostgreSQL', 'MongoDB', 'Basketball', 
  'Docker', 'HTML', 'Python', 'TailwindCSS','Volleyball',
  'Agents', 'Express', 'Three.js', 'Hono', 'RAG', 'LLMs', 'WEB3', 'cloudflare', 'JavaScript'
];

export function SkillsPhysics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<number | null>(null);
  const bodiesRef = useRef<{ body: Matter.Body; el: HTMLDivElement }[]>([]);
  const hasStarted = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const basePlateHeight = 40;
  const basePlateWidth = 120;
  const baseSpacing = 10;
  const plateHeight= 40;
  const plateWidth=120;
  const spacing = 10;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  // Initialize physics engine
  const startPhysics = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    // Initialize physics engine with mobile-optimized settings
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: width < 640 ? 0.5 : 1, scale: 0.001 }, // Lighter gravity for mobile
      enableSleeping: true,
      timing: {
        timeScale: width < 640 ? 0.8 : 1 // Slower physics for mobile
      }
    });
    engineRef.current = engine;
    // Adjust wall thickness and positioning for mobile screens
    const wallThickness = width < 640 ? 10 : 50;
    const wallOffset = width < 640 ? 5 : 25; // Smaller offset for mobile

    // Create walls with better mobile positioning
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallOffset, width, wallThickness, { isStatic: true }), // Top
      Matter.Bodies.rectangle(width / 2, height + wallOffset, width, wallThickness, { isStatic: true }), // Bottom
      Matter.Bodies.rectangle(-wallOffset, height / 2, wallThickness, height, { isStatic: true }), // Left
      Matter.Bodies.rectangle(width + wallOffset, height / 2, wallThickness, height, { isStatic: true }), // Right
    ];
    Matter.World.add(engine.world, walls);

    // Determine scale factor based on viewport with better mobile scaling
    let scale = 1;
    if (width < 360) {
      scale = 0.4; // Very small mobile (iPhone SE, etc.)
    } else if (width < 480) {
      scale = 0.5; // Small mobile
    } else if (width < 640) {
      scale = 0.6; // Mobile
    } else if (width < 768) {
      scale = 0.7; // Large mobile
    } else if (width < 1024) {
      scale = 0.75; // Tablet
    } else if (width <= 1280 && height <= 800) {
      scale = 0.8; // Nest Hub / Nest Hub Max
    }
    setScaleFactor(scale);

    const plateHeight = basePlateHeight * scale;
    const plateWidth = basePlateWidth * scale;
    const spacing = baseSpacing * scale;
    const fontSize = Math.max(10, 14 * scale);

    // Create tech stack plates
    const bodies = techStack.map((tech, i) => {
      const el = document.createElement('div');
      el.className = 'tech-plate';
      el.innerText = tech;
      
      // Calculate width based on text length and scale
      const textWidth = Math.max(plateWidth, tech.length * 10 * scale);
      
      el.style.cssText = `
        position: absolute;
        width: ${textWidth}px;
        height: ${plateHeight}px;
        border: 1px solid #c4b9a5;
        color: #c4b9a5;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${30 * scale}px;
        font-weight: 500;
        font-size: ${fontSize}px;
        user-select: none;
        z-index: 20;
        background: rgba(46, 84, 209, 0.1);
        backdrop-filter: blur(5px);
        transition: transform 0.2s, box-shadow 0.2s;
      `;
      
      container.appendChild(el);

      // Create physics body with better mobile positioning
      // Ensure plates are created within visible bounds
      const maxY = height * 0.7; // Don't go beyond 70% of container height
      const initialY = width < 640 ? 
        Math.min(20 + i * (plateHeight + spacing * 0.5), maxY) : 
        Math.min(100 + i * (plateHeight + spacing), maxY);
      
      // Ensure plates start in center and visible area
      const startX = Math.max(50, Math.min(width - 50, width / 2));
      const startY = Math.max(30, Math.min(height - 30, initialY));
      
      const body = Matter.Bodies.rectangle(
        startX,
        startY,
        textWidth,
        plateHeight,
        {
          restitution: 0.3,
          friction: 0.1,
          frictionAir: 0.005,
          density: 0.0005,
          chamfer: { radius: 15 * scale },
          render: { fillStyle: 'transparent' }
        }
      );

      Matter.World.add(engine.world, body);
      return { body, el };
    });
    
    bodiesRef.current = bodies;

    // Mouse control
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    
    Matter.World.add(engine.world, mouseConstraint);
    container.style.cursor = 'grab';

    // Handle mouse interactions
    container.addEventListener('mousedown', () => {
      container.style.cursor = 'grabbing';
    });
    
    container.addEventListener('mouseup', () => {
      container.style.cursor = 'grab';
    });

    // Add mouse hover effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const maxDist = 200;
      const forceMultiplier = 0.0005;

      bodiesRef.current.forEach(({ body }) => {
        const dx = body.position.x - mouseX;
        const dy = body.position.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * forceMultiplier;
          const fx = (dx / dist) * force * (mouseX > body.position.x ? -1 : 1);
          const fy = (dy / dist) * force * (mouseY > body.position.y ? -1 : 1);
          
          Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const render = () => {
      Matter.Engine.update(engine);
      
      // Update DOM elements
      bodiesRef.current.forEach(({ body, el }) => {
        el.style.transform = `translate(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`;
      });
      
      renderRef.current = requestAnimationFrame(render);
    };

    // Initial scatter effect for mobile and smaller screens
    if (window.innerWidth < 1024) {
      setIsMobile(true);
      setTimeout(() => {
        bodies.forEach(({ body }, i) => {
          // Very gentle scatter for mobile
          let forceMagnitude = 0.01;
          if (window.innerWidth < 360) {
            forceMagnitude = 0.005; // Very gentle for tiny screens
          } else if (window.innerWidth < 480) {
            forceMagnitude = 0.008; // Gentle for small mobile
          } else if (window.innerWidth < 640) {
            forceMagnitude = 0.01; // Moderate for mobile
          }
          
          // Apply gentle force to keep plates visible
          Matter.Body.applyForce(body, body.position, {
            x: (Math.random() * 20 - 10) * forceMagnitude,
            y: (Math.random() * 10) * forceMagnitude,
          });
        });
      }, 1000); // Longer delay for mobile
    }

    render();
    setIsReady(true);

    // Cleanup
    return () => {
      if (renderRef.current) {
        cancelAnimationFrame(renderRef.current);
        renderRef.current = null;
      }
      
      if (engineRef.current) {
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
        engineRef.current = null;
      }
      
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', () => {});
        container.removeEventListener('mouseup', () => {});
      }
      
      bodiesRef.current = [];
      hasStarted.current = false;
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Initialize ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom top',
      onEnter: startPhysics,
      onEnterBack: startPhysics,
      onLeave: () => {
        // Cleanup will be handled by the useEffect cleanup
      },
      onLeaveBack: () => {
        // Cleanup will be handled by the useEffect cleanup
      },
    });

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      if (window.innerWidth < 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check for mobile
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }

    // Start physics immediately for now
    startPhysics();

    return () => {
      trigger.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundColor: 'rgba(18, 18, 20, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '300px', // Ensure minimum height for mobile
        minWidth: '280px', // Ensure minimum width for mobile
        position: 'relative',
      }}
    >
      {/* Tech stack items will be rendered here by the physics engine */}
      {isReady && (
        <div className="absolute inset-0 pointer-events-none">
          {techStack.map((tech, i) => (
            <div 
              key={i} 
              className="tech-plate absolute top-0 left-0 opacity-0"
              style={{
                width: `${Math.max(plateWidth, tech.length * 10)}px`,
                height: `${plateHeight}px`,
                lineHeight: `${plateHeight}px`,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}