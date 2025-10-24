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

    // Initialize physics engine with realistic gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
      enableSleeping: true,
      
    });
    engineRef.current = engine;

    const { width, height } = container.getBoundingClientRect();
    const wallThickness = 50;

    // Create walls
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }), // Top
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }), // Bottom
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }), // Left
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }), // Right
    ];
    Matter.World.add(engine.world, walls);

    // Determine scale factor based on viewport
    let scale = 1;
    if (width < 480) {
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

      // Create physics body
      const body = Matter.Bodies.rectangle(
        width / 2,
        100 + i * (plateHeight + spacing),
        textWidth,
        plateHeight,
        {
          restitution: 0.5,
          friction: 0.2,
          frictionAir: 0.01,
          density: 0.001,
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
          const forceMagnitude = window.innerWidth < 640 ? 0.03 : 0.05;
          Matter.Body.applyForce(body, body.position, {
            x: (Math.random() * 100 - 50) * forceMagnitude,
            y: (Math.random() * 100) * forceMagnitude,
          });
        });
      }, 500);
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