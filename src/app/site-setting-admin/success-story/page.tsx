"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type SuccessStory = {
  id: string;
  name: string;
  age: number;
  course: string;
  achievement: string;
  previousScore?: string;
  currentScore: string;
  duration: string;
  image?: string;
  story: string;
  testimonial: string;
  category: string;
  destination?: string;
  university?: string;
  isFeatured: boolean;
};

type Statistic = {
  id: string;
  icon: string;
  value: string;
  label: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

type SuccessStoryPageData = {
  pageTitle: string;
  pageSubtitle: string;
  statistics: Statistic[];
  categories: Category[];
  stories: SuccessStory[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: SuccessStoryPageData = {
  pageTitle: "Success Stories",
  pageSubtitle: "Transforming dreams into achievements - Real students, real transformations.",
  statistics: [
    { id: "stat1", icon: "🎓", value: "500+", label: "Students Trained" },
    { id: "stat2", icon: "🌟", value: "95%", label: "Success Rate" },
  ],
  categories: [
    { id: "ielts", name: "IELTS Success", icon: "🎯" },
    { id: "study-abroad", name: "Study Abroad", icon: "✈️" },
  ],
  stories: [
    {
      id: "s1",
      name: "Aisha Rahman",
      age: 24,
      course: "IELTS Executive",
      achievement: "IELTS Band 8.5",
      previousScore: "Band 6.0",
      currentScore: "Band 8.5",
      duration: "3.5 months",
      story: "Aisha came to us with a Band 6.0 score and improved dramatically.",
      testimonial: "Stars English Centre changed my life! The teachers are incredibly supportive.",
      category: "ielts",
      destination: "Canada",
      university: "University of Toronto",
      isFeatured: true,
    },
  ],
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

const StoryModal: FC<{ story: SuccessStory | null; categories: Category[]; onClose: () => void; onSave: (story: SuccessStory) => void; }> = ({ story, categories, onClose, onSave }) => {
  const [currentStory, setCurrentStory] = useState<SuccessStory>(
    story || { id: `s${Date.now()}`, name: '', age: 20, course: '', achievement: '', currentScore: '', duration: '', story: '', testimonial: '', category: categories[0]?.id || '', isFeatured: false }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';
    setCurrentStory(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? parseInt(value) || 0 : value }));
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(currentStory); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
      <GlassCard className="border-teal-400/50 border-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">{story ? 'Edit Success Story' : 'Add New Success Story'}</h2><button type="button" onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><label className="block text-sm text-white/90 mb-1">Student Name</label><GlassInput name="name" value={currentStory.name} onChange={handleChange} required /></div>
            <div><label className="block text-sm text-white/90 mb-1">Age</label><GlassInput name="age" type="number" value={currentStory.age} onChange={handleChange} /></div>
            <div className="lg:col-span-2"><label className="block text-sm text-white/90 mb-1">Course Taken</label><GlassInput name="course" value={currentStory.course} onChange={handleChange} /></div>
            <div><label className="block text-sm text-white/90 mb-1">Duration</label><GlassInput name="duration" value={currentStory.duration} onChange={handleChange} /></div>
            <div className="lg:col-span-3"><label className="block text-sm text-white/90 mb-1">Achievement Headline</label><GlassInput name="achievement" value={currentStory.achievement} onChange={handleChange} /></div>
            <div><label className="block text-sm text-white/90 mb-1">Previous Score (Optional)</label><GlassInput name="previousScore" value={currentStory.previousScore || ''} onChange={handleChange} /></div>
            <div className="lg:col-span-2"><label className="block text-sm text-white/90 mb-1">Current Score / Result</label><GlassInput name="currentScore" value={currentStory.currentScore} onChange={handleChange} /></div>
            <div><label className="block text-sm text-white/90 mb-1">Destination (Optional)</label><GlassInput name="destination" value={currentStory.destination || ''} onChange={handleChange} /></div>
            <div className="lg:col-span-2"><label className="block text-sm text-white/90 mb-1">University (Optional)</label><GlassInput name="university" value={currentStory.university || ''} onChange={handleChange} /></div>
            <div><label className="block text-sm text-white/90 mb-1">Category</label><select name="category" value={currentStory.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"><option value="">Select</option>{categories.map(c=><option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2"><input type="checkbox" id="isFeatured" name="isFeatured" checked={currentStory.isFeatured} onChange={handleChange} className="w-5 h-5 accent-yellow-400" /><label htmlFor="isFeatured" className="text-yellow-300 font-semibold">Mark as Featured Story</label></div>
          <div><label className="block text-sm text-white/90 mb-1">Full Story</label><GlassTextarea name="story" value={currentStory.story} onChange={handleChange} rows={5}/></div>
          <div><label className="block text-sm text-white/90 mb-1">Testimonial (Quote)</label><GlassTextarea name="testimonial" value={currentStory.testimonial} onChange={handleChange} rows={3}/></div>
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 font-medium">Cancel</button><PrimaryButton type="submit">Save Story</PrimaryButton></div>
        </form>
      </GlassCard>
    </div></div>
  );
};

// ---------------------------
// Main Page Component
// ---------------------------

type ObjectArrayKeysOf<T> = { [K in keyof T]: T[K] extends { id: string }[] ? K : never; }[keyof T];

export default function EditSuccessStoryPage() {
  const [pageData, setPageData] = useState<SuccessStoryPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/success-story");
        if (response.ok) { const data = await response.json(); setPageData(data); setIsExistingData(true); } 
        else if (response.status === 404) { setPageData(DEFAULT_DATA); setIsExistingData(false); toast.info("No existing data. Loaded default template."); } 
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
      const response = await fetch("/api/site-setting/success-story", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };
  
  const handleFieldUpdate = <K extends keyof SuccessStoryPageData>(field: K, value: SuccessStoryPageData[K]) => { setPageData(prev => prev ? { ...prev, [field]: value } : null); };
  const handleObjectListItemUpdate = <K extends ObjectArrayKeysOf<SuccessStoryPageData>>(listKey: K, index: number, field: keyof SuccessStoryPageData[K][number], value: any) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends ObjectArrayKeysOf<SuccessStoryPageData>>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList }; }); };
  const handleListAdd = <K extends ObjectArrayKeysOf<SuccessStoryPageData>>(listKey: K, newItem: SuccessStoryPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList }; }); };
  const handleSaveStory = (savedStory: SuccessStory) => {
    if (!pageData) return;
    const existingIndex = pageData.stories.findIndex(s => s.id === savedStory.id);
    const updatedStories = existingIndex > -1 ? pageData.stories.map(s => s.id === savedStory.id ? savedStory : s) : [...pageData.stories, savedStory];
    handleFieldUpdate('stories', updatedStories);
    setIsModalOpen(false);
    setEditingStory(null);
    toast.success(`Story for "${savedStory.name}" saved!`);
  };

  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      {isModalOpen && <StoryModal story={editingStory} categories={pageData.categories} onClose={() => setIsModalOpen(false)} onSave={handleSaveStory} />}

      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 className="text-3xl md:text-4xl font-bold text-white">Success Story Page Editor</h1><p className="text-white/80 mt-2">Manage all content for the success stories page.</p></div><PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton></div></GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Page Title</label><GlassInput value={pageData.pageTitle} onChange={e => handleFieldUpdate('pageTitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Page Subtitle</label><GlassTextarea value={pageData.pageSubtitle} onChange={e => handleFieldUpdate('pageSubtitle', e.target.value)} /></div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Statistics</h2><button onClick={() => handleListAdd('statistics', {id: `s${Date.now()}`, icon: '', label: '', value: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 shadow-lg">+ Add</button></div>
              <div className="space-y-3">
                {pageData.statistics.map((stat, index) => (
                  <div key={stat.id} className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] items-center gap-2"><GlassInput placeholder="Icon" value={stat.icon} onChange={e => handleObjectListItemUpdate('statistics', index, 'icon', e.target.value)} className="w-16 text-center" /><GlassInput placeholder="Label" value={stat.label} onChange={e => handleObjectListItemUpdate('statistics', index, 'label', e.target.value)} /><div className="flex items-center gap-2"><GlassInput placeholder="Value" value={stat.value} onChange={e => handleObjectListItemUpdate('statistics', index, 'value', e.target.value)} /><DangerButton onClick={() => handleListRemove('statistics', index)}>X</DangerButton></div></div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Categories</h2><button onClick={() => handleListAdd('categories', {id: `cat${Date.now()}`, name: '', icon: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 shadow-lg">+ Add</button></div>
              <div className="space-y-3">
                {pageData.categories.map((cat, index) => (
                  <div key={cat.id} className="flex items-center gap-2"><GlassInput placeholder="Icon" value={cat.icon} onChange={e => handleObjectListItemUpdate('categories', index, 'icon', e.target.value)} className="w-16 text-center" /><GlassInput placeholder="Name" value={cat.name} onChange={e => handleObjectListItemUpdate('categories', index, 'name', e.target.value)} /><DangerButton onClick={() => handleListRemove('categories', index)}>X</DangerButton></div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Success Stories</h2><PrimaryButton onClick={() => { setEditingStory(null); setIsModalOpen(true); }}>+ Add Story</PrimaryButton></div>
            <div className="space-y-4">
              {pageData.stories.map((story, index) => (
                <div key={story.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div><h3 className="font-bold text-white flex items-center gap-2">{story.name} {story.isFeatured && <span className="text-yellow-300 text-xs">(⭐ Featured)</span>}</h3><p className="text-sm text-purple-200">{story.achievement}</p></div>
                  <div className="flex gap-2 self-end sm:self-center"><button onClick={() => { setEditingStory(story); setIsModalOpen(true); }} className="px-4 py-2 text-sm rounded-xl font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20">Edit</button><DangerButton onClick={() => handleListRemove('stories', index)}>Delete</DangerButton></div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </main>
  );
}