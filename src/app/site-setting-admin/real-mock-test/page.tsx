"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type MockTest = {
  id: string;
  title: string;
  testType: string;
  duration: string;
  sections: string[];
  difficulty: string;
  description: string;
  features: string[];
  price: string;
  isFree: boolean;
  availableSlots: number;
  nextDate: string;
  icon: string;
};

type TestFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type Testimonial = {
  id: string;
  name: string;
  score: string;
  image: string;
  text: string;
  course: string;
};

type ProcessStep = {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
};

type Statistic = {
  id: string;
  label: string;
  value: string;
  icon: string;
};

type RealMockTestPageData = {
  pageTitle: string;
  pageSubtitle: string;
  heroDescription: string;
  mockTests: MockTest[];
  features: TestFeature[];
  benefits: string[];
  testimonials: Testimonial[];
  mockTestProcess: ProcessStep[];
  statistics: Statistic[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: RealMockTestPageData = {
  pageTitle: "Real Mock Test Experience",
  pageSubtitle: "Practice Under Actual Exam Conditions",
  heroDescription: "Experience authentic tests in a real exam environment. Get detailed feedback from expert examiners.",
  mockTests: [
    { id: "ielts-full", title: "IELTS Full Mock Test", testType: "IELTS Academic/General", duration: "2h 45m", sections: ["Listening", "Reading", "Writing", "Speaking"], difficulty: "All Levels", description: "Complete IELTS mock test simulating actual exam conditions.", features: ["Authentic materials", "Band score prediction"], price: "1,500/-", isFree: false, availableSlots: 12, nextDate: "Every Saturday", icon: "📝" },
    { id: "free-diagnostic", title: "FREE Diagnostic Test", testType: "English Level Assessment", duration: "45 minutes", sections: ["Grammar", "Vocabulary", "Reading"], difficulty: "All Levels", description: "Free test to assess your current English level.", features: ["Completely FREE", "Course recommendations"], price: "FREE", isFree: true, availableSlots: 50, nextDate: "Book anytime", icon: "🎯" }
  ],
  features: [
    { id: "f1", icon: "🎯", title: "Real Exam Simulation", description: "Experience actual test conditions with authentic materials." },
    { id: "f2", icon: "👨‍🏫", title: "Expert Evaluation", description: "Tests evaluated by certified examiners." },
  ],
  benefits: ["Improve time management", "Identify weak areas", "Reduce exam anxiety"],
  testimonials: [
    { id: "t1", name: "Sarah Ahmed", score: "Band 8.0", image: "👩‍🎓", text: "The mock tests were incredibly helpful. The feedback helped me improve from 6.5 to 8.0!", course: "IELTS Academic" }
  ],
  mockTestProcess: [
    { id: "p1", step: 1, title: "Choose Your Test", description: "Select the mock test you need.", icon: "📋" },
    { id: "p2", step: 2, title: "Book Your Slot", description: "Choose your preferred date and time.", icon: "📅" },
  ],
  statistics: [
    { id: "s1", label: "Tests Conducted", value: "5000+", icon: "📝" },
    { id: "s2", label: "Success Rate", value: "95%", icon: "🎯" },
  ]
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
const StringListEditor: FC<{ list: string[]; setList: (list: string[]) => void; label: string }> = ({ list, setList, label }) => {
    const [newItem, setNewItem] = useState('');
    const handleAddItem = () => { if (newItem.trim()) { setList([...list, newItem.trim()]); setNewItem(''); } };
    const handleRemoveItem = (index: number) => { setList(list.filter((_, i) => i !== index)); };
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2"><p className="flex-grow p-2 bg-black/10 rounded-md text-sm text-white/80">{item}</p><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-300 text-xl">&times;</button></div>
        ))}
        <div className="flex gap-2"><GlassInput value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={`Add new...`} className="py-2" /><button type="button" onClick={handleAddItem} className="px-4 py-2 text-sm rounded-lg font-semibold bg-teal-500/80 text-white hover:bg-teal-500/100">Add</button></div>
      </div>
    );
};

const MockTestModal: FC<{ test: MockTest | null; onClose: () => void; onSave: (test: MockTest) => void; }> = ({ test, onClose, onSave }) => {
  const [currentTest, setCurrentTest] = useState<MockTest>(
    test || { id: `mt${Date.now()}`, title: '', testType: '', duration: '', sections: [], difficulty: '', description: '', features: [], price: '', isFree: false, availableSlots: 0, nextDate: '', icon: '📝' }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';
    setCurrentTest(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? parseInt(value) : value }));
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(currentTest); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <GlassCard className="border-teal-400/50 border-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">{test ? 'Edit Mock Test' : 'Add New Mock Test'}</h2><button type="button" onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><label className="block text-sm font-medium text-white/90 mb-1">Title</label><GlassInput name="title" value={currentTest.title} onChange={handleChange} required /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Icon</label><GlassInput name="icon" value={currentTest.icon} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Test Type</label><GlassInput name="testType" value={currentTest.testType} onChange={handleChange} placeholder="e.g., IELTS Academic"/></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Duration</label><GlassInput name="duration" value={currentTest.duration} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Difficulty</label><GlassInput name="difficulty" value={currentTest.difficulty} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Price</label><GlassInput name="price" value={currentTest.price} onChange={handleChange} disabled={currentTest.isFree} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Available Slots</label><GlassInput name="availableSlots" type="number" value={currentTest.availableSlots} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Next Date Info</label><GlassInput name="nextDate" value={currentTest.nextDate} onChange={handleChange} /></div>
          </div>
          <div className="flex items-center gap-2"><input type="checkbox" id="isFree" name="isFree" checked={currentTest.isFree} onChange={handleChange} className="w-5 h-5 accent-teal-400" /><label htmlFor="isFree" className="text-white/90">This is a FREE test</label></div>
          <div><label className="block text-sm font-medium text-white/90 mb-1">Description</label><GlassTextarea name="description" value={currentTest.description} onChange={handleChange} rows={4}/></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StringListEditor list={currentTest.sections} setList={(list) => setCurrentTest(p => ({...p, sections: list}))} label="Sections" />
            <StringListEditor list={currentTest.features} setList={(list) => setCurrentTest(p => ({...p, features: list}))} label="Features" />
          </div>
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 font-medium">Cancel</button><PrimaryButton type="submit">Save Test</PrimaryButton></div>
        </form>
      </GlassCard>
    </div></div>
  );
};


// ---------------------------
// Main Page Component
// ---------------------------

type ObjectArrayKeysOf<T> = { [K in keyof T]: T[K] extends { id: string }[] ? K : never; }[keyof T];

export default function EditRealMockTestPage() {
  const [pageData, setPageData] = useState<RealMockTestPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/real-mock-test");
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
      const response = await fetch("/api/site-setting/real-mock-test", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handleFieldUpdate = <K extends keyof RealMockTestPageData>(field: K, value: RealMockTestPageData[K]) => { setPageData(prev => prev ? { ...prev, [field]: value } : null); };
  const handleObjectListItemUpdate = <K extends ObjectArrayKeysOf<RealMockTestPageData>>(listKey: K, index: number, field: keyof RealMockTestPageData[K][number], value: any) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends keyof RealMockTestPageData>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey] as any[]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList as any }; }); };
  const handleListAdd = <K extends keyof RealMockTestPageData>(listKey: K, newItem: RealMockTestPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey] as any[]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList as any }; }); };
  const handleSaveTest = (savedTest: MockTest) => {
    if (!pageData) return;
    const existingIndex = pageData.mockTests.findIndex(t => t.id === savedTest.id);
    const updatedTests = existingIndex > -1 ? pageData.mockTests.map(t => t.id === savedTest.id ? savedTest : t) : [...pageData.mockTests, savedTest];
    handleFieldUpdate('mockTests', updatedTests);
    setIsModalOpen(false);
    setEditingTest(null);
    toast.success(`Mock test "${savedTest.title}" saved!`);
  };

  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      {isModalOpen && <MockTestModal test={editingTest} onClose={() => setIsModalOpen(false)} onSave={handleSaveTest} />}

      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 className="text-3xl md:text-4xl font-bold text-white">Real Mock Test Page Editor</h1><p className="text-white/80 mt-2">Manage content for the mock test page.</p></div><PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton></div></GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Page Title</label><GlassInput value={pageData.pageTitle} onChange={e => handleFieldUpdate('pageTitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Page Subtitle</label><GlassInput value={pageData.pageSubtitle} onChange={e => handleFieldUpdate('pageSubtitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Hero Description</label><GlassTextarea value={pageData.heroDescription} onChange={e => handleFieldUpdate('heroDescription', e.target.value)} /></div>
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
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Features</h2><button onClick={() => handleListAdd('features', {id: `f${Date.now()}`, icon: '', title: '', description: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 shadow-lg">+ Add</button></div>
              <div className="space-y-3">
                {pageData.features.map((feature, index) => (
                  <div key={feature.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 space-y-2"><div className="flex justify-between items-center"><div className="flex items-center gap-2"><GlassInput placeholder="Icon" value={feature.icon} onChange={e => handleObjectListItemUpdate('features', index, 'icon', e.target.value)} className="w-16 text-center" /><GlassInput placeholder="Title" value={feature.title} onChange={e => handleObjectListItemUpdate('features', index, 'title', e.target.value)} /></div><DangerButton onClick={() => handleListRemove('features', index)}>Remove</DangerButton></div><GlassTextarea rows={2} placeholder="Description" value={feature.description} onChange={e => handleObjectListItemUpdate('features', index, 'description', e.target.value)} /></div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Available Mock Tests</h2><PrimaryButton onClick={() => { setEditingTest(null); setIsModalOpen(true); }}>+ Add Mock Test</PrimaryButton></div>
            <div className="space-y-4">
              {pageData.mockTests.map((test, index) => (
                <div key={test.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div className="flex items-center gap-4"><div className="text-3xl w-12 h-12 flex items-center justify-center bg-black/20 rounded-full">{test.icon}</div><div><h3 className="font-bold text-white">{test.title}</h3><p className="text-sm text-purple-200">{test.testType}</p></div></div><div className="flex gap-2 self-end sm:self-center"><button onClick={() => { setEditingTest(test); setIsModalOpen(true); }} className="px-4 py-2 text-sm rounded-xl font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20">Edit</button><DangerButton onClick={() => handleListRemove('mockTests', index)}>Delete</DangerButton></div></div>
              ))}
            </div>
          </GlassCard>

          <GlassCard><h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2><StringListEditor list={pageData.benefits} setList={(list) => handleFieldUpdate('benefits', list)} label="Benefits List"/></GlassCard>

        </div>
      </div>
    </main>
  );
}