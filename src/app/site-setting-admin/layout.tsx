// components/SiteLayout.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react'; // Added useRef and useEffect
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiInfo, FiBriefcase, FiMail, FiBookOpen, FiHelpCircle, FiGlobe,
  FiUsers, FiUserPlus, FiCheckSquare, FiMessageSquare, FiFileText, FiAward, FiMenu
} from 'react-icons/fi';

// --- Type Definitions (No Changes) ---
interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
}
const navLinks: NavLink[] = [
    { name: 'About', path: '/site-setting/about', icon: FiInfo },
    { name: 'Career', path: '/site-setting/career', icon: FiBriefcase },
    { name: 'Contact', path: '/site-setting/contact', icon: FiMail },
    { name: 'Course', path: '/site-setting/course', icon: FiBookOpen },
    { name: 'FAQ', path: '/site-setting/faq', icon: FiHelpCircle },
    { name: 'IELTS', path: '/site-setting/ielts', icon: FiGlobe },
    { name: 'Our Team', path: '/site-setting/our-team', icon: FiUsers },
    { name: 'Private Batch Admission', path: '/site-setting/private-batch-addmission', icon: FiUserPlus },
    { name: 'Real Mock Test', path: '/site-setting/real-mock-test', icon: FiCheckSquare },
    { name: 'Seminar', path: '/site-setting/seminar', icon: FiMessageSquare },
    { name: 'Study Materials', path: '/site-setting/study-materials', icon: FiFileText },
    { name: 'Success Story', path: '/site-setting/success-story', icon: FiAward },
];

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  // --- Layout State and Hooks ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the background canvas

  // --- Background Animation Logic (Merged from AnimatedBackground.tsx) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const colors = [
      'rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)',
      'rgba(236, 72, 153, 0.3)', 'rgba(34, 211, 238, 0.3)',
      'rgba(168, 85, 247, 0.3)',
    ];

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          radius: Math.random() * 150 + 100,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    let hue = 0;
    const animate = () => {
      if (!ctx || !canvas) return;
      hue += 0.1;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${hue % 360}, 70%, 15%)`);
      gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 20%)`);
      gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 70%, 15%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < -p.radius || p.x > canvas.width + p.radius) p.vx *= -1;
        if (p.y < -p.radius || p.y > canvas.height + p.radius) p.vy *= -1;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => setup();
    
    setup();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Component JSX ---
  const glassEffect = 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* The canvas element for the background is now part of this component */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />

      <div className="relative z-10 flex h-screen">
        {/* --- SIDEBAR SECTION --- */}
        <>
          <div
            className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSidebarOpen(false)}
          />

          <aside
            className={`fixed top-0 left-0 h-full w-64 md:w-72 text-slate-100 p-4 z-40
                        transform transition-transform duration-300 ease-in-out
                        md:relative md:translate-x-0 ${glassEffect}
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white tracking-widest bg-clip-text  bg-gradient-to-r from-teal-300 to-purple-400">
                Admin Panel
              </h2>
            </div>
            <nav>
              <ul>
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <li key={link.name} className="mb-2">
                      <Link
                        href={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center p-3 rounded-lg transition-all duration-300
                                    ${isActive
                                      ? 'bg-teal-400/20 text-white font-semibold shadow-[0_0_15px_rgba(56,189,189,0.4)]'
                                      : 'hover:bg-white/5 text-slate-300'
                                    }`}
                      >
                        <link.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-teal-300' : ''}`} />
                        <span className="truncate">{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </>

        {/* --- MAIN CONTENT SECTION --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header
            className={`md:hidden p-4 flex items-center justify-between sticky top-0 ${glassEffect} z-20`}
          >
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-purple-400">
              Menu
            </h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
              aria-label="Open sidebar"
            >
              <FiMenu size={24} className="text-white" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className={`w-full h-full p-6 rounded-2xl ${glassEffect}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}