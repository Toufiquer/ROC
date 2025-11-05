"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Type Definitions
// ---------------------------

type Statistic = {
  id: string;
  icon: string;
  value: string;
  label: string;
};

type ScorePlan = {
  id: string;
  targetScore: string;
  title: string;
  description: string;
};

type ScholarshipPathStep = {
  id: string;
  step: number;
  icon: string;
  title: string;
  description: string;
};

type CareerPathPageData = {
  pageTitle: string;
  pageSubtitle: string;
  statistics: Statistic[];
  scorePlans: ScorePlan[];
  scholarshipPathSteps: ScholarshipPathStep[];
  requiredDocuments: string[];
};

// ---------------------------
// Static Data (To be replaced by API fetch)
// ---------------------------

const CAREER_PATH_DATA: CareerPathPageData = {
  pageTitle: "Your Career Path to Global Opportunities",
  pageSubtitle: "Leverage your IELTS score to unlock funded scholarships (GA, TA, RA) and study at top universities abroad. This is your step-by-step guide.",
  statistics: [
    { id: "s1", icon: "🎓", value: "1,000+", label: "Students Abroad" },
    { id: "s2", icon: "💰", value: "80%", label: "Received Funding" },
    { id: "s3", icon: "🌍", value: "15+", label: "Destination Countries" },
    { id: "s4", icon: "📈", value: "7.5+", label: "Avg. Score for Scholarships" },
  ],
  scorePlans: [
    { id: "p1", targetScore: "Band 7+", title: "The Gateway Score", description: "Achieving a 7.0-7.5+ band is the crucial first step. It opens doors to most graduate programs and makes you eligible for funding consideration." },
    { id: "p2", targetScore: "Band 8+", title: "The Competitive Edge", description: "A band score of 8.0 or higher significantly strengthens your profile, making you a top candidate for prestigious scholarships and top-tier universities." },
    { id: "p3", targetScore: "Band 9", title: "The Elite Profile", description: "A near-perfect score positions you for the most competitive, fully-funded PhD programs and prestigious global awards." },
  ],
  scholarshipPathSteps: [
    { id: "step1", step: 1, icon: "🎯", title: "Achieve a High Score", description: "Secure a competitive IELTS (7.5+) and GRE/GMAT score. This is the foundation of your entire application." },
    { id: "step2", step: 2, icon: "🔍", title: "Research & Shortlist", description: "Identify universities and professors whose research aligns with your interests. Look for programs with strong funding records." },
    { id: "step3", step: 3, icon: "✍️", title: "Prepare Documents", description: "Craft a compelling Statement of Purpose (SOP), get strong Letters of Recommendation (LORs), and prepare your academic transcripts." },
    { id: "step4", step: 4, icon: "💰", title: "Apply for Funding", description: "Directly email professors to inquire about Graduate/Teaching/Research Assistantship (GA/TA/RA) openings. Mention your high scores and research interest." },
    { id: "step5", step: 5, icon: "💬", title: "Ace the Interview", description: "Prepare for interviews with professors or admission committees. Clearly articulate your goals, skills, and why you are a good fit." },
    { id: "step6", step: 6, icon: "✈️", title: "Visa & Pre-Departure", description: "Once you have your admission and funding letter, apply for your student visa and prepare for your journey abroad." },
  ],
  requiredDocuments: [
    "Passport & National ID",
    "Academic Transcripts & Certificates",
    "Official IELTS/GRE/GMAT Score Reports",
    "Statement of Purpose (SOP) / Personal Statement",
    "Letters of Recommendation (LORs)",
    "Updated Resume/CV",
    "Financial Documents / Proof of Funds",
  ],
};

// ---------------------------
// Reusable & Page Components
// ---------------------------

function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; const particles: Array<{ x: number; y: number; radius: number; vx: number; vy: number; color: string; }> = []; const colors = [ 'rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(34, 211, 238, 0.3)', 'rgba(168, 85, 247, 0.3)', ]; for (let i = 0; i < 8; i++) { particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 150 + 100, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, color: colors[Math.floor(Math.random() * colors.length)], }); } let hue = 0; function animate() { if (!ctx || !canvas) return; hue += 0.1; const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, `hsl(${hue % 360}, 70%, 15%)`); gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 20%)`); gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 70%, 15%)`); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height); particles.forEach((p) => { ctx.beginPath(); const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius); grad.addColorStop(0, p.color); grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.fillStyle = grad; ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); p.x += p.vx; p.y += p.vy; if (p.x < -p.radius || p.x > canvas.width + p.radius) p.vx *= -1; if (p.y < -p.radius || p.y > canvas.height + p.radius) p.vy *= -1; }); requestAnimationFrame(animate); } animate(); const handleResize = () => { if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }; window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function CareerPathPage() {
  const [data, setData] = useState<CareerPathPageData | null>(null);

  useEffect(() => {
    // In a real app, fetch data from your API
    setData(CAREER_PATH_DATA);
  }, []);

  if (!data) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Career Path...</div>;
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{data.pageTitle}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-4xl mx-auto">{data.pageSubtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.statistics.map(stat => (
                <div key={stat.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <p className="text-3xl font-bold text-teal-300 mb-1">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Score Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Step 1: Achieve a Competitive Score</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data.scorePlans.map(plan => (
                <div key={plan.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                  <div className="text-center mb-4"><span className="px-6 py-2 rounded-full font-bold text-lg bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg">{plan.targetScore}</span></div>
                  <h3 className="text-2xl font-bold text-white text-center mb-3">{plan.title}</h3>
                  <p className="text-sm text-white/80 text-center">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship Path */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Your Path to a Funded Scholarship</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.scholarshipPathSteps.map((step) => (
                <div key={step.id} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-4xl border-2 border-white/30">{step.icon}</div>
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">{step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/80">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Required Application Documents</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.requiredDocuments.map((doc, i) => (
                <div key={i} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-sm font-semibold">✓ {doc}</div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}