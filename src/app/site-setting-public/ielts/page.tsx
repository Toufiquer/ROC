"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Type Definitions (Shared with Admin Page)
// ---------------------------

type Statistic = {
  id: string;
  icon: string;
  value: string;
  label: string;
};

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type ScorePlan = {
  id: string;
  targetScore: string;
  title: string;
  description: string;
  strategies: string[];
};

type CurriculumSection = {
  id: string;
  title: string; // e.g., "Lectures 1-10"
  topics: string[];
};

type Curriculum = {
  listening: CurriculumSection[];
  reading: CurriculumSection[];
  writing: CurriculumSection[];
  speaking: CurriculumSection[];
};

type IELTSPageData = {
  pageTitle: string;
  pageSubtitle: string;
  statistics: Statistic[];
  features: Feature[];
  scorePlans: ScorePlan[];
  curriculum: Curriculum;
};

// ---------------------------
// Static Data (This would be replaced by an API fetch in a real app)
// ---------------------------

const IELTS_DATA: IELTSPageData = {
  pageTitle: "Master the IELTS Exam",
  pageSubtitle: "Achieve your target band score with our comprehensive 100-lecture program, expert strategies, and personalized guidance.",
  statistics: [
    { id: "stat1", icon: "📈", value: "+1.5", label: "Avg. Band Improvement" },
    { id: "stat2", icon: "👨‍🏫", value: "15+", label: "Expert Tutors" },
    { id: "stat3", icon: "✅", value: "50+", label: "Mock Tests Available" },
    { id: "stat4", icon: "🎯", value: "95%", label: "Student Success Rate" },
  ],
  features: [
    { id: "feat1", icon: "📚", title: "100-Lecture Curriculum", description: "A structured, step-by-step program covering every aspect of the IELTS exam in depth." },
    { id: "feat2", icon: "🎯", title: "Personalized Strategy", description: "We identify your weaknesses and provide a tailored study plan to maximize your score." },
    { id: "feat3", icon: "✍️", title: "Authentic Materials", description: "Practice with official Cambridge materials and our proprietary, exam-standard questions." },
    { id: "feat4", icon: "🗣️", title: "One-on-One Speaking", description: "Regular speaking sessions with certified examiners to build fluency and confidence." },
    { id: "feat5", icon: "📊", title: "Detailed Feedback", description: "Receive comprehensive feedback on writing and speaking tasks with actionable advice." },
    { id: "feat6", icon: "🏆", title: "Proven Track Record", description: "Join thousands of students who have achieved their dreams of studying and working abroad." },
  ],
  scorePlans: [
    { id: "plan1", targetScore: "Band 7", title: "Achieve Band 7: The Solid Foundation", description: "This plan focuses on mastering the fundamentals, avoiding common errors, and building confidence across all modules.", strategies: ["Mastering Task 1 & 2 Structures", "Effective Paraphrasing Techniques", "Improving Listening for Specific Details", "Developing Coherent Speaking Responses"] },
    { id: "plan2", targetScore: "Band 8", title: "Target Band 8: The Advanced Approach", description: "Move beyond the basics to showcase a strong command of English with advanced vocabulary and complex sentence structures.", strategies: ["Advanced Lexical Resource Usage", "Complex Grammatical Structures", "Critical Reading & Inference Skills", "Nuanced and Fluent Speaking"] },
    { id: "plan3", targetScore: "Band 9", title: "Aim for Band 9: The Expert Level", description: "This elite plan is for those aiming for perfection, focusing on native-like fluency, precision, and sophisticated language use.", strategies: ["Sophisticated Vocabulary & Idiomatic Language", "Flawless Grammatical Accuracy", "Mastering Tone and Style in Writing", "Natural and Effortless Pronunciation"] },
  ],
  curriculum: {
    listening: [{ id: "l1", title: "Lectures 1-25", topics: ["Understanding accents", "Identifying distractors", "Map & diagram labeling", "Note completion strategies"] }],
    reading: [{ id: "r1", title: "Lectures 26-50", topics: ["Skimming & scanning techniques", "True/False/Not Given questions", "Matching headings", "Inference and opinion questions"] }],
    writing: [{ id: "w1", title: "Lectures 51-75", topics: ["Task 1: Graph, chart, and table analysis", "Task 2: Essay structures (all types)", "Cohesion and coherence", "Advanced vocabulary for writing"] }],
    speaking: [{ id: "s1", title: "Lectures 76-100", topics: ["Part 1: Fluency and coherence", "Part 2: Structuring your talk (CUE card)", "Part 3: Abstract topic discussion", "Pronunciation and intonation"] }],
  },
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

function CurriculumModule({ title, sections }: { title: string; sections: CurriculumSection[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-4 flex justify-between items-center text-left">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className={`text-2xl text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div className={`transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 pt-2 border-t border-white/20">
          {sections.map(section => (
            <div key={section.id} className="mb-3">
              <h4 className="font-semibold text-teal-300 mb-2">{section.title}</h4>
              <ul className="space-y-1 pl-4">
                {section.topics.map((topic, i) => <li key={i} className="text-sm text-white/80 flex items-start gap-2"><span className="text-cyan-300 shrink-0">•</span><span>{topic}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IELTSPage() {
  const [data, setData] = useState<IELTSPageData | null>(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we use the static data and simulate a fetch
    const fetchData = async () => {
      // const response = await fetch('/api/site-setting/ielts');
      // const fetchedData = await response.json();
      setData(IELTS_DATA);
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{data.pageTitle}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">{data.pageSubtitle}</p>
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

          {/* Features Section */}
          <div className="mb-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose Our IELTS Program?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.features.map(feature => (
                <div key={feature.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Score Plan Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Your Roadmap to Success</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data.scorePlans.map(plan => (
                <div key={plan.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform duration-300">
                  <div className="text-center mb-4"><span className="px-6 py-2 rounded-full font-bold text-lg bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg">{plan.targetScore}</span></div>
                  <h3 className="text-2xl font-bold text-white text-center mb-3">{plan.title}</h3>
                  <p className="text-sm text-white/80 text-center mb-4">{plan.description}</p>
                  <ul className="space-y-2">
                    {plan.strategies.map((strategy, i) => <li key={i} className="text-sm text-white/90 flex items-start gap-2"><span className="text-green-300 mt-1">✓</span><span>{strategy}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="mb-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-8">The 100-Lecture Curriculum</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              <CurriculumModule title="🎧 Listening Module" sections={data.curriculum.listening} />
              <CurriculumModule title="📖 Reading Module" sections={data.curriculum.reading} />
              <CurriculumModule title="✍️ Writing Module" sections={data.curriculum.writing} />
              <CurriculumModule title="🗣️ Speaking Module" sections={data.curriculum.speaking} />
            </div>
          </div>
          
        </section>
      </div>
    </main>
  );
}