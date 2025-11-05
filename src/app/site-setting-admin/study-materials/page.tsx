"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type Material = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  type: string;
  format: string;
  pages?: number;
  duration?: string;
  size?: string;
  downloads: number;
  rating: number;
  thumbnail: string;
  tags: string[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type StudyMaterialsPageData = {
  pageTitle: string;
  pageDescription: string;
  categories: Category[];
  levels: string[];
  types: string[];
  materials: Material[];
  features: Feature[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: StudyMaterialsPageData = {
  pageTitle: "Study Materials & Resources",
  pageDescription: "Access our comprehensive collection of study materials, practice tests, and learning resources.",
  categories: [
    { id: "cat1", name: "IELTS", icon: "✍️" },
    { id: "cat2", name: "Grammar", icon: "📝" },
  ],
  levels: ["Beginner", "Intermediate", "Advanced"],
  types: ["PDF", "Video", "Audio"],
  materials: [
    {
      id: "mat1",
      title: "IELTS Writing Task 2 - Guide",
      description: "Comprehensive guide covering all essay types for achieving band 8+.",
      category: "IELTS",
      level: "Advanced",
      type: "PDF",
      format: "PDF Document",
      pages: 125,
      size: "8.5 MB",
      downloads: 2456,
      rating: 4.9,
      thumbnail: "📄",
      tags: ["Writing", "Essays"]
    },
  ],
  features: [
    { id: "feat1", icon: "🎯", title: "Expertly Curated", description: "All materials designed by our experienced instructors." },
    { id: "feat2", icon: "📱", title: "Mobile Friendly", description: "Access materials on any device for learning on the go." },
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

const MaterialModal: FC<{ material: Material | null; categories: Category[]; levels: string[]; types: string[]; onClose: () => void; onSave: (material: Material) => void; }> = ({ material, categories, levels, types, onClose, onSave }) => {
  const [currentMaterial, setCurrentMaterial] = useState<Material>(
    material || { id: `mat${Date.now()}`, title: '', description: '', category: categories[0]?.name || '', level: levels[0] || '', type: types[0] || '', format: '', pages: 0, duration: '', size: '', downloads: 0, rating: 0, thumbnail: '📄', tags: [] }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setCurrentMaterial(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(currentMaterial); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <GlassCard className="border-teal-400/50 border-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">{material ? 'Edit Material' : 'Add New Material'}</h2><button type="button" onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><label className="block text-sm font-medium text-white/90 mb-1">Title</label><GlassInput name="title" value={currentMaterial.title} onChange={handleChange} required /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Thumbnail Icon</label><GlassInput name="thumbnail" value={currentMaterial.thumbnail} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Category</label><select name="category" value={currentMaterial.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"><option value="">Select</option>{categories.map(c=><option key={c.id} value={c.name} className="bg-gray-800">{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Level</label><select name="level" value={currentMaterial.level} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"><option value="">Select</option>{levels.map(l=><option key={l} value={l} className="bg-gray-800">{l}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Type</label><select name="type" value={currentMaterial.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"><option value="">Select</option>{types.map(t=><option key={t} value={t} className="bg-gray-800">{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Format</label><GlassInput name="format" value={currentMaterial.format} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Pages</label><GlassInput name="pages" type="number" value={currentMaterial.pages || ''} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Duration</label><GlassInput name="duration" value={currentMaterial.duration || ''} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">File Size</label><GlassInput name="size" value={currentMaterial.size || ''} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Downloads</label><GlassInput name="downloads" type="number" value={currentMaterial.downloads} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Rating</label><GlassInput name="rating" type="number" step="0.1" value={currentMaterial.rating} onChange={handleChange} /></div>
          </div>
          <div><label className="block text-sm font-medium text-white/90 mb-1">Description</label><GlassTextarea name="description" value={currentMaterial.description} onChange={handleChange} rows={4}/></div>
          <StringListEditor list={currentMaterial.tags} setList={(list) => setCurrentMaterial(p => ({...p, tags: list}))} label="Tags" />
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 font-medium">Cancel</button><PrimaryButton type="submit">Save Material</PrimaryButton></div>
        </form>
      </GlassCard>
    </div></div>
  );
};


// ---------------------------
// Main Page Component
// ---------------------------

type ObjectArrayKeysOf<T> = { [K in keyof T]: T[K] extends { id: string }[] ? K : never; }[keyof T];

export default function EditStudyMaterialsPage() {
  const [pageData, setPageData] = useState<StudyMaterialsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/study-materials");
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
      const response = await fetch("/api/site-setting/study-materials", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handleFieldUpdate = <K extends keyof StudyMaterialsPageData>(field: K, value: StudyMaterialsPageData[K]) => { setPageData(prev => prev ? { ...prev, [field]: value } : null); };
  const handleObjectListItemUpdate = <K extends ObjectArrayKeysOf<StudyMaterialsPageData>>(listKey: K, index: number, field: keyof StudyMaterialsPageData[K][number], value: any) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends ObjectArrayKeysOf<StudyMaterialsPageData>>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList }; }); };
  const handleListAdd = <K extends ObjectArrayKeysOf<StudyMaterialsPageData>>(listKey: K, newItem: StudyMaterialsPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList }; }); };
  const handleSaveMaterial = (savedMaterial: Material) => {
    if (!pageData) return;
    const existingIndex = pageData.materials.findIndex(m => m.id === savedMaterial.id);
    const updatedMaterials = existingIndex > -1 ? pageData.materials.map(m => m.id === savedMaterial.id ? savedMaterial : m) : [...pageData.materials, savedMaterial];
    handleFieldUpdate('materials', updatedMaterials);
    setIsModalOpen(false);
    setEditingMaterial(null);
    toast.success(`Material "${savedMaterial.title}" saved!`);
  };

  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      {isModalOpen && <MaterialModal material={editingMaterial} categories={pageData.categories} levels={pageData.levels} types={pageData.types} onClose={() => setIsModalOpen(false)} onSave={handleSaveMaterial} />}

      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h1 className="text-3xl md:text-4xl font-bold text-white">Study Materials Page Editor</h1><p className="text-white/80 mt-2">Manage all content for the resources page.</p></div><PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton></div></GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Page Title</label><GlassInput value={pageData.pageTitle} onChange={e => handleFieldUpdate('pageTitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Page Description</label><GlassTextarea value={pageData.pageDescription} onChange={e => handleFieldUpdate('pageDescription', e.target.value)} /></div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Filter Options</h2></div>
              <div className="space-y-6">
                <StringListEditor list={pageData.levels} setList={(list) => handleFieldUpdate('levels', list)} label="Levels"/>
                <StringListEditor list={pageData.types} setList={(list) => handleFieldUpdate('types', list)} label="Material Types"/>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Categories</h2><button onClick={() => handleListAdd('categories', {id: `cat${Date.now()}`, name: '', icon: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 shadow-lg">+ Add</button></div>
              <div className="space-y-3">
                {pageData.categories.map((cat, index) => (
                  <div key={cat.id} className="flex items-center gap-2"><GlassInput placeholder="Icon" value={cat.icon} onChange={e => handleObjectListItemUpdate('categories', index, 'icon', e.target.value)} className="w-16 text-center" /><GlassInput placeholder="Category Name" value={cat.name} onChange={e => handleObjectListItemUpdate('categories', index, 'name', e.target.value)} /><DangerButton onClick={() => handleListRemove('categories', index)}>X</DangerButton></div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Study Materials</h2><PrimaryButton onClick={() => { setEditingMaterial(null); setIsModalOpen(true); }}>+ Add Material</PrimaryButton></div>
            <div className="space-y-4">
              {pageData.materials.map((material, index) => (
                <div key={material.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4"><div className="text-3xl w-12 h-12 flex items-center justify-center bg-black/20 rounded-full">{material.thumbnail}</div><div><h3 className="font-bold text-white">{material.title}</h3><p className="text-sm text-purple-200">{material.category} | {material.level}</p></div></div>
                  <div className="flex gap-2 self-end sm:self-center"><button onClick={() => { setEditingMaterial(material); setIsModalOpen(true); }} className="px-4 py-2 text-sm rounded-xl font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20">Edit</button><DangerButton onClick={() => handleListRemove('materials', index)}>Delete</DangerButton></div>
                </div>
              ))}
            </div>
          </GlassCard>
          
        </div>
      </div>
    </main>
  );
}