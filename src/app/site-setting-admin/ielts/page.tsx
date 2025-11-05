"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions (Shared with Public Page)
// ---------------------------

type Statistic = { id: string; icon: string; value: string; label: string; };
type Feature = { id: string; icon: string; title: string; description: string; };
type ScorePlan = { id: string; targetScore: string; title: string; description: string; strategies: string[]; };
type CurriculumSection = { id: string; title: string; topics: string[]; };
type Curriculum = { listening: CurriculumSection[]; reading: CurriculumSection[]; writing: CurriculumSection[]; speaking: CurriculumSection[]; };
type IELTSPageData = { pageTitle: string; pageSubtitle: string; statistics: Statistic[]; features: Feature[]; scorePlans: ScorePlan[]; curriculum: Curriculum; };

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: IELTSPageData = {
  pageTitle: "Master the IELTS Exam",
  pageSubtitle: "Achieve your target band score with our comprehensive program.",
  statistics: [{ id: "stat1", icon: "📈", value: "+1.5", label: "Avg. Band Improvement" }],
  features: [{ id: "feat1", icon: "📚", title: "100-Lecture Curriculum", description: "A structured program covering every aspect." }],
  scorePlans: [{ id: "plan1", targetScore: "Band 7", title: "Achieve Band 7", description: "This plan focuses on mastering the fundamentals.", strategies: ["Mastering Task 1 & 2 Structures"] }],
  curriculum: {
    listening: [{ id: "l1", title: "Lectures 1-25", topics: ["Understanding accents", "Note completion"] }],
    reading: [{ id: "r1", title: "Lectures 26-50", topics: ["Skimming & scanning", "True/False/Not Given"] }],
    writing: [{ id: "w1", title: "Lectures 51-75", topics: ["Task 1 analysis", "Task 2 essay structures"] }],
    speaking: [{ id: "s1", title: "Lectures 76-100", topics: ["Part 1 fluency", "Part 2 CUE card"] }],
  },
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
const GlassInput: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => ( <input {...props} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50"/> );
const GlassTextarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => ( <textarea {...props} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50"/> );
const PrimaryButton: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => ( <button {...props} className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 shadow-lg disabled:opacity-50">{children}</button> );
const DangerButton: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => ( <button {...props} className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 text-sm">{children}</button> );

// ✅ CORRECTED: Full implementation of StringListEditor
const StringListEditor: FC<{ list: string[]; setList: (list: string[]) => void; label: string }> = ({ list, setList, label }) => {
    const [newItem, setNewItem] = useState('');
    const handleAddItem = () => { if (newItem.trim()) { setList([...list, newItem.trim()]); setNewItem(''); } };
    const handleRemoveItem = (index: number) => { setList(list.filter((_, i) => i !== index)); };
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <p className="flex-grow p-2 bg-black/20 rounded-md text-sm text-white/80">{item}</p>
            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-300 text-xl">&times;</button>
          </div>
        ))}
        <div className="flex gap-2">
          <GlassInput value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={`Add new...`} className="py-2" />
          <button type="button" onClick={handleAddItem} className="px-4 py-2 text-sm rounded-lg font-semibold bg-teal-500/80 text-white hover:bg-teal-500/100">Add</button>
        </div>
      </div>
    );
};

// ---------------------------
// Main Page Component
// ---------------------------

type ObjectArrayKeysOf<T> = { [K in keyof T]: T[K] extends { id: string }[] ? K : never; }[keyof T];

export default function EditIELTSPage() {
  const [pageData, setPageData] = useState<IELTSPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/ielts");
        if (response.ok) { const data = await response.json(); setPageData(data); setIsExistingData(true); } 
        else if (response.status === 404) { setPageData(DEFAULT_DATA); setIsExistingData(false); toast.info("No data found. Loaded default template."); } 
        else { throw new Error(`Failed to fetch: ${response.statusText}`); }
      } catch (error) { console.error("Error fetching data:", error); toast.error("Could not fetch data."); setPageData(DEFAULT_DATA); setIsExistingData(false); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!pageData) return;
    setIsSaving(true);
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const response = await fetch("/api/site-setting/ielts", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };
  
  const handleFieldUpdate = <K extends keyof IELTSPageData>(field: K, value: IELTSPageData[K]) => { setPageData(prev => prev ? { ...prev, [field]: value } : null); };
  const handleObjectListItemUpdate = <K extends ObjectArrayKeysOf<IELTSPageData>>(listKey: K, index: number, field: keyof IELTSPageData[K][number], value: any) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends ObjectArrayKeysOf<IELTSPageData>>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList }; }); };
  const handleListAdd = <K extends ObjectArrayKeysOf<IELTSPageData>>(listKey: K, newItem: IELTSPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList }; }); };
  const handleCurriculumUpdate = (module: keyof Curriculum, sectionIndex: number, field: keyof CurriculumSection, value: any) => { setPageData(prev => { if (!prev) return null; const updatedModule = prev.curriculum[module].map((sec, i) => i === sectionIndex ? { ...sec, [field]: value } : sec); return { ...prev, curriculum: { ...prev.curriculum, [module]: updatedModule } }; }); };
  const handleCurriculumAdd = (module: keyof Curriculum) => { setPageData(prev => { if (!prev) return null; const newSection = { id: `sec${Date.now()}`, title: 'New Section', topics: [] }; const updatedModule = [...prev.curriculum[module], newSection]; return { ...prev, curriculum: { ...prev.curriculum, [module]: updatedModule } }; }); };
  const handleCurriculumRemove = (module: keyof Curriculum, sectionIndex: number) => { setPageData(prev => { if (!prev) return null; const updatedModule = prev.curriculum[module].filter((_, i) => i !== sectionIndex); return { ...prev, curriculum: { ...prev.curriculum, [module]: updatedModule } }; }); };

  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="relative z-10 p-4 md:p-8 lg:p-12"><div className="max-w-7xl mx-auto space-y-6">
          <GlassCard><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 className="text-3xl font-bold text-white">IELTS Page Editor</h1><p className="text-white/80 mt-2">Manage all content for the public IELTS page.</p></div><PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton></div></GlassCard>
          <GlassCard><h2 className="text-2xl font-bold text-white mb-6">Hero & Stats</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className="block text-white/90 mb-1">Page Title</label><GlassInput value={pageData.pageTitle} onChange={e => handleFieldUpdate('pageTitle', e.target.value)} /></div>
                <div><label className="block text-white/90 mb-1">Page Subtitle</label><GlassTextarea value={pageData.pageSubtitle} onChange={e => handleFieldUpdate('pageSubtitle', e.target.value)} /></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><label className="text-white/90">Statistics</label><button onClick={() => handleListAdd('statistics', {id: `s${Date.now()}`, icon: '', label: '', value: ''})} className="px-3 py-1 text-xs rounded-lg bg-purple-500/80 hover:bg-purple-500/100">+ Add</button></div>
                {pageData.statistics.map((stat, index) => (
                  <div key={stat.id} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2"><GlassInput value={stat.icon} onChange={e => handleObjectListItemUpdate('statistics', index, 'icon', e.target.value)} className="w-16 text-center" /><GlassInput placeholder="Value" value={stat.value} onChange={e => handleObjectListItemUpdate('statistics', index, 'value', e.target.value)} /><GlassInput placeholder="Label" value={stat.label} onChange={e => handleObjectListItemUpdate('statistics', index, 'label', e.target.value)} /><DangerButton onClick={() => handleListRemove('statistics', index)}>X</DangerButton></div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Score Plans (Band 7, 8, 9+)</h2><button onClick={() => handleListAdd('scorePlans', {id: `p${Date.now()}`, targetScore: 'Band X', title: '', description: '', strategies: []})} className="px-4 py-2 text-sm rounded-xl bg-purple-500/80 hover:bg-purple-500/100">+ Add Plan</button></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pageData.scorePlans.map((plan, index) => (
                <div key={plan.id} className="bg-white/5 p-4 rounded-lg space-y-3"><div className="flex justify-end"><DangerButton onClick={() => handleListRemove('scorePlans', index)}>Remove</DangerButton></div><GlassInput value={plan.targetScore} onChange={e => handleObjectListItemUpdate('scorePlans', index, 'targetScore', e.target.value)} /><GlassInput placeholder="Title" value={plan.title} onChange={e => handleObjectListItemUpdate('scorePlans', index, 'title', e.target.value)} /><GlassTextarea placeholder="Description" value={plan.description} onChange={e => handleObjectListItemUpdate('scorePlans', index, 'description', e.target.value)} /><StringListEditor list={plan.strategies} setList={list => handleObjectListItemUpdate('scorePlans', index, 'strategies', list)} label="Strategies"/></div>
              ))}
            </div>
          </GlassCard>

          <GlassCard><h2 className="text-2xl font-bold text-white mb-6">100-Lecture Curriculum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(pageData.curriculum) as Array<keyof Curriculum>).map(moduleKey => (
                <div key={moduleKey} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg capitalize text-teal-300">{moduleKey}</h3><button onClick={() => handleCurriculumAdd(moduleKey)} className="px-3 py-1 text-xs rounded-lg bg-purple-500/80 hover:bg-purple-500/100">+ Add Section</button></div>
                  <div className="space-y-4">
                    {pageData.curriculum[moduleKey].map((section, secIndex) => (
                      <div key={section.id} className="bg-black/20 p-3 rounded-md space-y-2"><div className="flex justify-end"><DangerButton onClick={() => handleCurriculumRemove(moduleKey, secIndex)}>Remove Section</DangerButton></div><GlassInput value={section.title} onChange={e => handleCurriculumUpdate(moduleKey, secIndex, 'title', e.target.value)} /><StringListEditor list={section.topics} setList={list => handleCurriculumUpdate(moduleKey, secIndex, 'topics', list)} label="Topics"/></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

      </div></div>
    </main>
  );
}