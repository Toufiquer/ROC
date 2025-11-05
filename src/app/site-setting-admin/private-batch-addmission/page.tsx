"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type Course = {
  id: string;
  title: string;
  duration: string;
  regularFee: string;
  executiveFee: string;
  features: string[];
};

type BatchType = {
  id: string;
  name: string;
  icon: string;
  description: string;
  studentLimit: string;
  benefits: string[];
};

type AdmissionStep = {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

type Benefit = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type PrivateBatchPageData = {
  pageTitle: string;
  pageSubtitle: string;
  admissionStatus: string;
  offers: string[];
  batchTypes: BatchType[];
  courses: Course[];
  admissionSteps: AdmissionStep[];
  requirements: string[];
  paymentMethods: PaymentMethod[];
  benefits: Benefit[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: PrivateBatchPageData = {
  pageTitle: "Private Batch Admission",
  pageSubtitle: "Secure Your Seat in Our Exclusive Private Care Program",
  admissionStatus: "🔥 ADMISSION IS OPEN!",
  offers: ["FREE IELTS Registration Support", "100% Service Oriented"],
  batchTypes: [
    { id: "regular", name: "Regular Batch", icon: "📚", description: "For students seeking quality education at affordable prices.", studentLimit: "10-15 students", benefits: ["Interactive group learning", "Regular mock tests"] },
    { id: "executive", name: "Executive Batch", icon: "⭐", description: "Premium experience for professionals.", studentLimit: "6-8 students", benefits: ["Ultra-small batch size", "Personalized attention"] },
  ],
  courses: [
    { id: "c1", title: "Foundation ENGLISH", duration: "3 months", regularFee: "6,000/-", executiveFee: "10,000/-", features: ["Basic Grammar", "Speaking Practice"] },
    { id: "c5", title: "IELTS Regular", duration: "2.5 months", regularFee: "9,000/-", executiveFee: "15,000/-", features: ["4 Modules Training", "Band 7+ Focused"] },
  ],
  admissionSteps: [
    { id: "s1", step: 1, title: "Choose Course", description: "Select the course and batch type.", icon: "📋" },
    { id: "s2", step: 2, title: "Fill Form", description: "Complete the online admission form.", icon: "✍️" },
  ],
  requirements: ["Valid National ID / Birth Certificate", "1 Copy of Recent Passport Size Photo"],
  paymentMethods: [ { id: "p1", name: "Cash", icon: "💵" }, { id: "p2", name: "bKash", icon: "📱" } ],
  benefits: [
    { id: "b1", icon: "👨‍🏫", title: "Expert Instructors", description: "Learn from teachers with 17+ years of experience" },
    { id: "b2", icon: "📚", title: "Complete Materials", description: "All study materials included in course fee" },
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

// ---------------------------
// Main Page Component
// ---------------------------

// ✅ CORRECTED: Utility type to get only keys pointing to arrays of objects with an 'id'
type ObjectArrayKeysOf<T> = { [K in keyof T]: T[K] extends { id: string }[] ? K : never; }[keyof T];

export default function EditPrivateBatchPage() {
  const [pageData, setPageData] = useState<PrivateBatchPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/private-batch-program");
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
      const response = await fetch("/api/site-setting/private-batch-program", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handleFieldUpdate = <K extends keyof PrivateBatchPageData>(field: K, value: PrivateBatchPageData[K]) => { setPageData(prev => prev ? { ...prev, [field]: value } : null); };
  
  // ✅ CORRECTED: This handler now only works for arrays of objects, which is safe.
  const handleObjectListItemUpdate = <K extends ObjectArrayKeysOf<PrivateBatchPageData>>(listKey: K, index: number, field: keyof PrivateBatchPageData[K][number], value: any) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  
  const handleListRemove = <K extends keyof PrivateBatchPageData>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey] as any[]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList as any }; }); };
  const handleListAdd = <K extends keyof PrivateBatchPageData>(listKey: K, newItem: PrivateBatchPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey] as any[]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList as any }; }); };
  
  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 className="text-3xl md:text-4xl font-bold text-white">Private Batch Program Page</h1><p className="text-white/80 mt-2">Manage content for the admission page.</p></div><PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton></div></GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Page Title</label><GlassInput value={pageData.pageTitle} onChange={e => handleFieldUpdate('pageTitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Page Subtitle</label><GlassTextarea value={pageData.pageSubtitle} onChange={e => handleFieldUpdate('pageSubtitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Admission Status Badge</label><GlassInput value={pageData.admissionStatus} onChange={e => handleFieldUpdate('admissionStatus', e.target.value)} /></div>
              {/* ✅ CORRECTED: Using StringListEditor for the string[] array */}
              <StringListEditor list={pageData.offers} setList={(list) => handleFieldUpdate('offers', list)} label="Offers List"/>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Batch Types</h2><button onClick={() => handleListAdd('batchTypes', {id: `bt${Date.now()}`, name: '', icon: '', description: '', studentLimit: '', benefits: []})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 shadow-lg">+ Add Batch Type</button></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pageData.batchTypes.map((batch, index) => (
                <div key={batch.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <div className="flex justify-end"><DangerButton onClick={() => handleListRemove('batchTypes', index)}>Remove</DangerButton></div>
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3">
                    <GlassInput placeholder="Icon" value={batch.icon} onChange={e => handleObjectListItemUpdate('batchTypes', index, 'icon', e.target.value)} className="w-20 text-center" />
                    <GlassInput placeholder="Batch Name" value={batch.name} onChange={e => handleObjectListItemUpdate('batchTypes', index, 'name', e.target.value)} />
                  </div>
                  <GlassInput placeholder="Student Limit" value={batch.studentLimit} onChange={e => handleObjectListItemUpdate('batchTypes', index, 'studentLimit', e.target.value)} />
                  <GlassTextarea placeholder="Description" value={batch.description} onChange={e => handleObjectListItemUpdate('batchTypes', index, 'description', e.target.value)} />
                  <StringListEditor list={batch.benefits} setList={(list) => handleObjectListItemUpdate('batchTypes', index, 'benefits', list)} label="Benefits"/>
                </div>
              ))}
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Courses</h2><button onClick={() => handleListAdd('courses', {id: `c${Date.now()}`, title: '', duration: '', regularFee: '', executiveFee: '', features: []})} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium hover:scale-105 shadow-lg">+ Add Course</button></div>
            <div className="space-y-6">
              {pageData.courses.map((course, index) => (
                <div key={course.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-white">Course #{index + 1}</h3><DangerButton onClick={() => handleListRemove('courses', index)}>Remove</DangerButton></div>
                  <div className="space-y-4">
                    <GlassInput placeholder="Course Title" value={course.title} onChange={e => handleObjectListItemUpdate('courses', index, 'title', e.target.value)} />
                    <GlassInput placeholder="Duration" value={course.duration} onChange={e => handleObjectListItemUpdate('courses', index, 'duration', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <GlassInput placeholder="Regular Fee" value={course.regularFee} onChange={e => handleObjectListItemUpdate('courses', index, 'regularFee', e.target.value)} />
                      <GlassInput placeholder="Executive Fee" value={course.executiveFee} onChange={e => handleObjectListItemUpdate('courses', index, 'executiveFee', e.target.value)} />
                    </div>
                    <StringListEditor list={course.features} setList={list => handleObjectListItemUpdate('courses', index, 'features', list)} label="Features" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
                <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Admission Steps</h2><button onClick={() => handleListAdd('admissionSteps', {id: `s${Date.now()}`, step: pageData.admissionSteps.length+1, title: '', description: '', icon: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 shadow-lg">+ Add Step</button></div>
                <div className="space-y-3">
                    {pageData.admissionSteps.map((step, index) => (
                    <div key={step.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2"><span className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-full shrink-0">{index+1}</span><GlassInput placeholder="Icon" value={step.icon} onChange={e => handleObjectListItemUpdate('admissionSteps', index, 'icon', e.target.value)} className="w-16 text-center" /></div>
                            <DangerButton onClick={() => handleListRemove('admissionSteps', index)}>Remove</DangerButton>
                        </div>
                        <GlassInput placeholder="Title" value={step.title} onChange={e => handleObjectListItemUpdate('admissionSteps', index, 'title', e.target.value)} />
                        <GlassTextarea rows={2} placeholder="Description" value={step.description} onChange={e => handleObjectListItemUpdate('admissionSteps', index, 'description', e.target.value)} />
                    </div>
                    ))}
                </div>
            </GlassCard>
            <GlassCard>
                <h2 className="text-2xl font-bold text-white mb-6">Requirements</h2>
                <StringListEditor list={pageData.requirements} setList={(list) => handleFieldUpdate('requirements', list)} label="Required Documents"/>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}