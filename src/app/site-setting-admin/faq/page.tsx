"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type FAQItem = {
  id: string;
  category: string; // This should match a FAQCategory 'name'
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  name: string;
  icon: string;
};

type ContactInfo = {
  title: string;
  description: string;
  cta: string;
};

type FAQPageData = {
  pageTitle: string;
  pageDescription: string;
  categories: FAQCategory[];
  faqs: FAQItem[];
  contactInfo: ContactInfo;
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: FAQPageData = {
  pageTitle: "Frequently Asked Questions",
  pageDescription: "Find answers to common questions about our courses, registration, schedules, and more.",
  categories: [
    { id: "cat1", name: "General", icon: "ℹ️" },
    { id: "cat2", name: "Courses", icon: "🎓" },
    { id: "cat3", name: "Payment", icon: "💳" },
  ],
  faqs: [
    {
      id: "faq1",
      category: "General",
      question: "What is the class size?",
      answer: "We maintain small batch sizes to ensure personalized attention, typically 10-15 students."
    },
    {
      id: "faq2",
      category: "Courses",
      question: "Do you offer online classes?",
      answer: "Yes! We offer both online and offline classes for most of our courses."
    },
  ],
  contactInfo: {
    title: "Still Have Questions?",
    description: "Our team is here to help you with any queries you may have.",
    cta: "Contact Us Now"
  }
};

// ---------------------------
// Reusable Components
// ---------------------------

function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; const particles: Array<{ x: number; y: number; radius: number; vx: number; vy: number; color: string; }> = []; const colors = [ 'rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(34, 211, 238, 0.3)', 'rgba(168, 85, 247, 0.3)', ]; for (let i = 0; i < 8; i++) { particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 150 + 100, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, color: colors[Math.floor(Math.random() * colors.length)], }); } let hue = 0; function animate() { if (!ctx || !canvas) return; hue += 0.1; const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, `hsl(${hue % 360}, 70%, 15%)`); gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 20%)`); gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 70%, 15%)`); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height); particles.forEach((p) => { ctx.beginPath(); const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius); grad.addColorStop(0, p.color); grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.fillStyle = grad; ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); p.x += p.vx; p.y += p.vy; if (p.x < -p.radius || p.x > canvas.width + p.radius) p.vx *= -1; if (p.y < -p.radius || p.y > canvas.height + p.radius) p.vy *= -1; }); requestAnimationFrame(animate); } animate(); const handleResize = () => { if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }; window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

const GlassCard: FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => ( <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}>{children}</div> );
const GlassInput: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => ( <input {...props} className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"/> );
const GlassTextarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => ( <textarea {...props} rows={3} className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all resize-none"/> );
const PrimaryButton: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => ( <button {...props} className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">{children}</button> );
const DangerButton: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => ( <button {...props} className="px-4 py-2 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 transition-all duration-300 text-sm">{children}</button> );

// ---------------------------
// Main Page Component
// ---------------------------

type ArrayKeysOf<T> = { [K in keyof T]: T[K] extends any[] ? K : never; }[keyof T];

export default function EditFAQPage() {
  const [pageData, setPageData] = useState<FAQPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/faq");
        if (response.ok) { const data = await response.json(); setPageData(data); setIsExistingData(true); } 
        else if (response.status === 404) { setPageData(DEFAULT_DATA); setIsExistingData(false); toast.info("No existing data. Loaded default template."); } 
        else { throw new Error(`Failed to fetch: ${response.statusText}`); }
      } catch (error) { console.error("Error fetching FAQ data:", error); toast.error("Could not fetch data."); setPageData(DEFAULT_DATA); setIsExistingData(false); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!pageData) return;
    setIsSaving(true);
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const response = await fetch("/api/site-setting/faq", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`FAQ page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving FAQ data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handleFieldUpdate = <K extends keyof FAQPageData>(field: K, value: FAQPageData[K]) => {
    setPageData(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleListUpdate = <K extends ArrayKeysOf<FAQPageData>>(listKey: K, index: number, field: keyof FAQPageData[K][number], value: string) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends ArrayKeysOf<FAQPageData>>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList }; }); };
  const handleListAdd = <K extends ArrayKeysOf<FAQPageData>>(listKey: K, newItem: FAQPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList }; }); };
  
  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading FAQ editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div><h1 className="text-3xl md:text-4xl font-bold text-white">FAQ Page Editor</h1><p className="text-white/80 mt-2">Manage all content for the public FAQ page.</p></div>
              <PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Page Title</label><GlassInput value={pageData.pageTitle} onChange={e => handleFieldUpdate('pageTitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Page Description</label><GlassTextarea value={pageData.pageDescription} onChange={e => handleFieldUpdate('pageDescription', e.target.value)} /></div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Categories</h2>
                <button onClick={() => handleListAdd('categories', {id: `cat${Date.now()}`, name: '', icon: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add</button>
              </div>
              <div className="space-y-3">
                {pageData.categories.map((cat, index) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <GlassInput placeholder="Icon" value={cat.icon} onChange={e => handleListUpdate('categories', index, 'icon', e.target.value)} className="w-16 text-center" />
                    <GlassInput placeholder="Category Name" value={cat.name} onChange={e => handleListUpdate('categories', index, 'name', e.target.value)} />
                    <DangerButton onClick={() => handleListRemove('categories', index)}>Remove</DangerButton>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h2 className="text-2xl font-bold text-white mb-6">Contact CTA Section</h2>
              <div className="space-y-4">
                <div><label className="block text-white/90 font-medium mb-2">Title</label><GlassInput value={pageData.contactInfo.title} onChange={e => handleFieldUpdate('contactInfo', {...pageData.contactInfo, title: e.target.value})} /></div>
                <div><label className="block text-white/90 font-medium mb-2">Description</label><GlassTextarea value={pageData.contactInfo.description} onChange={e => handleFieldUpdate('contactInfo', {...pageData.contactInfo, description: e.target.value})} /></div>
                <div><label className="block text-white/90 font-medium mb-2">Button Text</label><GlassInput value={pageData.contactInfo.cta} onChange={e => handleFieldUpdate('contactInfo', {...pageData.contactInfo, cta: e.target.value})} /></div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <button onClick={() => handleListAdd('faqs', {id:`faq${Date.now()}`, category: pageData.categories[0]?.name || '', question:'', answer:''})} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add FAQ</button>
            </div>
            <div className="space-y-6">
              {pageData.faqs.map((faq, index) => (
                <div key={faq.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <select value={faq.category} onChange={e => handleListUpdate('faqs', index, 'category', e.target.value)} className="px-4 py-2 rounded-xl backdrop-blur-md bg-black/20 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all">
                      {pageData.categories.map(cat => <option key={cat.id} value={cat.name} className="bg-gray-800">{cat.name}</option>)}
                      <option value="Uncategorized" className="bg-gray-800 text-gray-400">Uncategorized</option>
                    </select>
                    <DangerButton onClick={() => handleListRemove('faqs', index)}>Remove FAQ</DangerButton>
                  </div>
                  <div className="space-y-4">
                    <GlassInput placeholder="Question" value={faq.question} onChange={e => handleListUpdate('faqs', index, 'question', e.target.value)} />
                    <GlassTextarea placeholder="Answer" rows={4} value={faq.answer} onChange={e => handleListUpdate('faqs', index, 'answer', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}