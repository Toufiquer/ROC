"use client"
import React, { useEffect, useRef } from "react";

// ---------------------------
// Static data
// ---------------------------

type Course = {
  id: string;
  title: string;
  duration: string;
  fee: string;
  altFee?: string;
  note?: string;
};

type CompanyData = {
  name: string;
  tagline: string;
  hooks: string[];
  info: string;
  courses: Course[];
  teachersCount: number;
  experienceAvg: string;
};

const COMPANY_DATA: CompanyData = {
  name: "Stars English Centre",
  tagline: "Private care program for all courses and corporate Training.",
  hooks: [
    "FREE IELTS Registration",
    "ADMISSION IS GOING ON !! BOOK YOUR SEAT TODAY !!",
    "Master English Language with Confidence !!",
    "*100%* Service Oriented",
  ],
  info:
    "We provide private-care style classes across general English, Spoken & Phonetics, IELTS/PTE and long-term kids & juniors programs. Our corporate training packages are tailored to business needs.",
  courses: [
    { id: "c1", title: "Foundation ENGLISH (Regular & Executive)", duration: "2.5 / 3 months", fee: "6,000/-", altFee: "(10,000/-)" },
    { id: "c2", title: "ADVANCED SPOKEN & PHONETICS", duration: "2.5 months", fee: "6,000/-", altFee: "(10,000/-)" },
    { id: "c3", title: "Grammar And Freehand WRITING (Regular & Executive)", duration: "2.5 months", fee: "6,000/-", altFee: "(10,000/-)" },
    { id: "c4", title: "PTE Academic / UK VI", duration: "2.5 months", fee: "9,000/-", altFee: "(15,000/-)" },
    { id: "c5", title: "Kids' English", duration: "12 months", fee: "Admission: 4,200/- | Per month: 2,400/-" },
    { id: "c6", title: "Juniors' English", duration: "12 months", fee: "Admission: 4,200/- | Per month: 2,400/-" },
    { id: "c7", title: "IELTS Regular", duration: "2.5 months", fee: "9,000/-", altFee: "(15,000/-)" },
    { id: "c8", title: "IELTS Executive", duration: "3.5 months", fee: "10,200/-", altFee: "(17,000/-)" },
    { id: "c9", title: "IELTS Crash Course", duration: "1.5 months", fee: "9,300/-", altFee: "(15,500/-)" },
    { id: "c10", title: "BASIC TO IELTS", duration: "6 months", fee: "18,000/-", altFee: "(30,000/-)" },
  ],
  teachersCount: 10,
  experienceAvg: "17+ years",
};

// Animated background component
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(139, 92, 246, 0.3)',  // purple
      'rgba(59, 130, 246, 0.3)',   // blue
      'rgba(236, 72, 153, 0.3)',   // pink
      'rgba(34, 211, 238, 0.3)',   // cyan
      'rgba(168, 85, 247, 0.3)',   // violet
    ];

    // Create particles
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let hue = 0;

    function animate() {
      if (!ctx || !canvas) return;
      
      // Create gradient background that changes color
      hue += 0.1;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${hue % 360}, 70%, 15%)`);
      gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 20%)`);
      gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 70%, 15%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p) => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < -p.radius || p.x > canvas.width + p.radius) p.vx *= -1;
        if (p.y < -p.radius || p.y > canvas.height + p.radius) p.vy *= -1;
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function AboutPage() {
  const company = COMPANY_DATA;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Canvas */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="rounded-3xl overflow-hidden  grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-10 hover:bg-white/15 transition-all duration-300">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">{company.name}</h1>
              <p className="mt-2 text-sm md:text-base text-white/90">{company.tagline}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                {company.hooks.map((h, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300">
                    {h}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-white/90 leading-relaxed">{company.info}</p>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <a href="#admission" className="inline-flex items-center justify-center px-5 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105">
                  Book Your Seat
                </a>
                <a href="#courses" className="inline-flex items-center justify-center px-5 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
                  View Courses
                </a>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
              <h3 className="text-lg font-bold text-white">Quick Facts</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/90">
                <li><strong className="text-teal-300">{company.teachersCount}+</strong> Professional Teachers</li>
                <li>Average Experience: <strong className="text-teal-300">{company.experienceAvg}</strong></li>
                <li>Programs: <strong className="text-teal-300">{company.courses.length}</strong></li>
                <li>Registration: <strong className="text-teal-300">FREE IELTS Registration</strong></li>
              </ul>
            </div>
          </div>

          {/* Courses */}
          <section id="courses" className="mt-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white">Courses</h2>
              <p className="mt-2 text-sm text-white/80">Select a program that fits your goals — details and fees are shown below.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.courses.map((course) => (
                <article key={course.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300 group">
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <p className="mt-2 text-sm text-white/80">Duration: <span className="font-medium text-teal-300">{course.duration}</span></p>
                  <p className="mt-2 text-sm text-white">Fee: <span className="font-bold text-teal-300">{course.fee}</span> {course.altFee && <span className="text-xs text-white/60">{course.altFee}</span>}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <button className="px-3 py-2 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300">Enroll</button>
                    <button className="text-xs underline text-white/70 hover:text-white transition-colors">Details</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Teachers / Why choose us */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Why choose {company.name}?</h2>
              <ul className="mt-4 list-disc pl-5 text-white/90 space-y-2">
                <li>Personalized attention — small batches & one-to-one support.</li>
                <li>Experienced faculty with practical classroom and exam training.</li>
                <li>Modern curriculum with focus on speaking & phonetics.</li>
                <li>Flexible timings and corporate training packages.</li>
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 transition-all duration-300">
              <h2 className="text-xl font-bold text-white">Our Teachers</h2>
              <p className="mt-3 text-white/90">We currently have <strong className="text-teal-300">{company.teachersCount}+</strong> professional teachers with many having over <strong className="text-teal-300">{company.experienceAvg}</strong> of teaching experience. Teachers are selected for both pedagogical knowledge and real-world exam coaching.</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {new Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 hover:bg-white/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-sm font-semibold text-white shadow-lg">T{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-white">Teacher {i + 1}</p>
                      <p className="text-xs text-white/70">Expert, 10+ yrs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Admission CTA */}
          <section id="admission" className="mt-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/15 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold text-white">Admissions Open</h3>
                <p className="mt-2 text-white/90">Admission is going on — limited seats. Reserve now to secure your batch and benefit from personalized coaching.</p>
              </div>

              <div className="flex gap-3 flex-row lg:flex-col">
                <a className="px-5 py-3 rounded-full font-semibold bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" href="#">
                  Apply Now
                </a>
                <a className="px-5 py-3 rounded-full border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300" href="#">
                  Contact Us
                </a>
              </div>
            </div>
          </section>
 
        </section>
      </div>
    </main>
  );
}