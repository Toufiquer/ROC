"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type ContactInfo = {
  id: string;
  icon: string;
  title: string;
  value: string;
  link?: string;
};

type SocialMedia = {
  id: string;
  name: string;
  icon: string;
  url:string;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLink: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

type ContactPageData = {
  hero: {
    title: string;
    subtitle: string;
  };
  contactMethods: ContactInfo[];
  socialMedia: SocialMedia[];
  branches: Branch[];
  faqs: FAQ[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: ContactPageData = {
  hero: {
    title: "Get In Touch",
    subtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
  },
  contactMethods: [
    { id: "cm1", icon: "📞", title: "Call Us", value: "+880 1234-567890", link: "tel:+8801234567890" },
    { id: "cm2", icon: "📧", title: "Email Us", value: "info@starsenglish.com", link: "mailto:info@starsenglish.com" },
  ],
  socialMedia: [
    { id: "sm1", name: "Facebook", icon: "f", url: "https://facebook.com/starsenglish" },
    { id: "sm2", name: "YouTube", icon: "▶", url: "https://youtube.com/starsenglish" },
  ],
  branches: [
    {
      id: "b1",
      name: "Main Campus",
      address: "House 123, Road 4, Dhanmondi, Dhaka 1209",
      phone: "+880 1234-567890",
      email: "main@starsenglish.com",
      hours: "Sat-Thu: 9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
  ],
  faqs: [
    { id: "faq1", question: "What are your class timings?", answer: "We offer flexible timings including morning, afternoon, and evening batches." },
    { id: "faq2", question: "Do you provide online classes?", answer: "Yes! We offer both online and offline classes." },
  ],
};

// ---------------------------
// Reusable Components
// ---------------------------

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: Array<{ x: number; y: number; radius: number; vx: number; vy: number; color: string; }> = [];
    const colors = [ 'rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(34, 211, 238, 0.3)', 'rgba(168, 85, 247, 0.3)', ];
    for (let i = 0; i < 8; i++) { particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 150 + 100, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, color: colors[Math.floor(Math.random() * colors.length)], }); }
    let hue = 0;
    function animate() {
      if (!ctx || !canvas) return;
      hue += 0.1;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${hue % 360}, 70%, 15%)`);
      gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 70%, 20%)`);
      gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 70%, 15%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -p.radius || p.x > canvas.width + p.radius) p.vx *= -1;
        if (p.y < -p.radius || p.y > canvas.height + p.radius) p.vy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
    const handleResize = () => { if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

export default function EditContactPage() {
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/contact");
        if (response.ok) { const data = await response.json(); setPageData(data); setIsExistingData(true); } 
        else if (response.status === 404) { setPageData(DEFAULT_DATA); setIsExistingData(false); toast.info("No existing data. Loaded default template."); } 
        else { throw new Error(`Failed to fetch: ${response.statusText}`); }
      } catch (error) { console.error("Error fetching contact data:", error); toast.error("Could not fetch data."); setPageData(DEFAULT_DATA); setIsExistingData(false); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!pageData) return;
    setIsSaving(true);
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const response = await fetch("/api/site-setting/contact", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Contact page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving contact data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  // ✅ CORRECTED: Simplified handlers call setPageData directly.
  const handleHeroUpdate = (field: keyof ContactPageData['hero'], value: string) => {
    setPageData(prev => prev ? { ...prev, hero: { ...prev.hero, [field]: value } } : null);
  };

  const handleListUpdate = <K extends ArrayKeysOf<ContactPageData>>(
    listKey: K,
    index: number,
    field: keyof ContactPageData[K][number],
    value: string
  ) => {
    setPageData(prev => {
      if (!prev) return null;
      const list = prev[listKey];
      const updatedList = list.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [listKey]: updatedList };
    });
  };
  
  const handleListRemove = <K extends ArrayKeysOf<ContactPageData>>(
    listKey: K,
    index: number
  ) => {
    setPageData(prev => {
      if (!prev) return null;
      const list = prev[listKey];
      const updatedList = list.filter((_, i) => i !== index);
      return { ...prev, [listKey]: updatedList };
    });
  };

  const handleListAdd = <K extends ArrayKeysOf<ContactPageData>>(
    listKey: K,
    newItem: ContactPageData[K][number]
  ) => {
    setPageData(prev => {
      if (!prev) return null;
      const list = prev[listKey];
      const updatedList = [...list, newItem];
      return { ...prev, [listKey]: updatedList };
    });
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <GlassCard>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div>
            <p className="text-white mt-4 text-center">Loading contact editor...</p>
          </GlassCard>
        </div>
      </main>
    );
  }

  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Contact Page Editor</h1>
                <p className="text-white/80 mt-2">Manage all content for the public contact page.</p>
              </div>
              <PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Title</label>
                <GlassInput value={pageData.hero.title} onChange={e => handleHeroUpdate('title', e.target.value)} />
              </div>
              <div>
                <label className="block text-white/90 font-medium mb-2">Subtitle</label>
                <GlassTextarea value={pageData.hero.subtitle} onChange={e => handleHeroUpdate('subtitle', e.target.value)} />
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Contact Methods</h2>
                <button onClick={() => handleListAdd('contactMethods', {id: `cm${Date.now()}`, icon: '❓', title: '', value: '', link: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add</button>
              </div>
              <div className="space-y-4">
                {pageData.contactMethods.map((item, index) => (
                    <div key={item.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex justify-end"><DangerButton onClick={() => handleListRemove('contactMethods', index)}>Remove</DangerButton></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <GlassInput placeholder="Icon (e.g., 📞)" value={item.icon} onChange={e => handleListUpdate('contactMethods', index, 'icon', e.target.value)} />
                            <GlassInput placeholder="Title" value={item.title} onChange={e => handleListUpdate('contactMethods', index, 'title', e.target.value)} />
                        </div>
                        <GlassInput placeholder="Value (e.g., +880..)" value={item.value} onChange={e => handleListUpdate('contactMethods', index, 'value', e.target.value)} />
                        <GlassInput placeholder="Link (e.g., tel:+880..)" value={item.link || ''} onChange={e => handleListUpdate('contactMethods', index, 'link', e.target.value)} />
                    </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Social Media</h2>
                  <button onClick={() => handleListAdd('socialMedia', {id: `sm${Date.now()}`, name: '', icon: '', url: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add</button>
                </div>
                <div className="space-y-4">
                    {pageData.socialMedia.map((item, index) => (
                        <div key={item.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                            <div className="flex justify-end"><DangerButton onClick={() => handleListRemove('socialMedia', index)}>Remove</DangerButton></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <GlassInput placeholder="Name (e.g., Facebook)" value={item.name} onChange={e => handleListUpdate('socialMedia', index, 'name', e.target.value)} />
                                <GlassInput placeholder="Icon (e.g., f)" value={item.icon} onChange={e => handleListUpdate('socialMedia', index, 'icon', e.target.value)} />
                            </div>
                            <GlassInput placeholder="URL (https://...)" value={item.url} onChange={e => handleListUpdate('socialMedia', index, 'url', e.target.value)} />
                        </div>
                    ))}
                </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Branches</h2>
              <button onClick={() => handleListAdd('branches', {id: `b${Date.now()}`, name:'', address:'', phone:'', email:'', hours:'', mapLink:''})} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add Branch</button>
            </div>
            <div className="space-y-6">
              {pageData.branches.map((branch, index) => (
                <div key={branch.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Branch #{index + 1}</h3>
                    <DangerButton onClick={() => handleListRemove('branches', index)}>Remove Branch</DangerButton>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassInput placeholder="Branch Name" value={branch.name} onChange={e => handleListUpdate('branches', index, 'name', e.target.value)} />
                    <GlassInput placeholder="Phone" value={branch.phone} onChange={e => handleListUpdate('branches', index, 'phone', e.target.value)} />
                    <div className="md:col-span-2"><GlassInput placeholder="Address" value={branch.address} onChange={e => handleListUpdate('branches', index, 'address', e.target.value)} /></div>
                    <GlassInput placeholder="Email" value={branch.email} onChange={e => handleListUpdate('branches', index, 'email', e.target.value)} />
                    <GlassInput placeholder="Hours" value={branch.hours} onChange={e => handleListUpdate('branches', index, 'hours', e.target.value)} />
                    <div className="md:col-span-2"><GlassInput placeholder="Google Maps Link" value={branch.mapLink} onChange={e => handleListUpdate('branches', index, 'mapLink', e.target.value)} /></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">FAQs</h2>
              <button onClick={() => handleListAdd('faqs', {id:`faq${Date.now()}`, question:'', answer:''})} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add FAQ</button>
            </div>
            <div className="space-y-6">
              {pageData.faqs.map((faq, index) => (
                <div key={faq.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">FAQ #{index + 1}</h3>
                    <DangerButton onClick={() => handleListRemove('faqs', index)}>Remove FAQ</DangerButton>
                  </div>
                  <div className="space-y-4">
                    <GlassInput placeholder="Question" value={faq.question} onChange={e => handleListUpdate('faqs', index, 'question', e.target.value)} />
                    <GlassTextarea placeholder="Answer" value={faq.answer} onChange={e => handleListUpdate('faqs', index, 'answer', e.target.value)} />
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