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
  fee: string;
  altFee?: string;
  category: string; // This should match a CourseCategory 'id'
  features: string[];
  description: string;
};

type CourseCategory = {
  id: string;
  name: string;
  icon: string;
};

type PageInfo = {
  title: string;
  subtitle: string;
  benefits: string[];
};

type CoursePageData = {
  pageInfo: PageInfo;
  courseCategories: CourseCategory[];
  courses: Course[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: CoursePageData = {
  pageInfo: {
    title: "Our Courses",
    subtitle: "Choose from our comprehensive range of English language courses designed for every level and goal.",
    benefits: [
      "FREE IELTS Registration",
      "Expert Faculty with 17+ Years Experience",
      "Small Batch Sizes for Personal Attention",
    ],
  },
  courseCategories: [
    { id: "general", name: "General English", icon: "✍️" },
    { id: "ielts", name: "IELTS", icon: "🎓" },
    { id: "kids", name: "Kids & Juniors", icon: "👶" },
  ],
  courses: [
    {
      id: "c1",
      title: "Foundation ENGLISH",
      duration: "2.5 / 3 months",
      fee: "6,000/-",
      altFee: "(10,000/-)",
      category: "general",
      features: ["Basic Grammar", "Vocabulary Building"],
      description: "Build a strong foundation in English with our comprehensive program.",
    },
    {
      id: "c7",
      title: "IELTS Regular",
      duration: "2.5 months",
      fee: "9,000/-",
      altFee: "(15,000/-)",
      category: "ielts",
      features: ["All 4 Modules", "Practice Tests"],
      description: "Complete IELTS preparation covering Listening, Reading, Writing, and Speaking.",
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

const StringListEditor: FC<{ list: string[]; setList: (list: string[]) => void; label: string }> = ({ list, setList, label }) => {
    const [newItem, setNewItem] = useState('');
    const handleAddItem = () => { if (newItem.trim()) { setList([...list, newItem.trim()]); setNewItem(''); } };
    const handleRemoveItem = (index: number) => { setList(list.filter((_, i) => i !== index)); };
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>
        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <p className="flex-grow p-2 bg-black/10 rounded-md text-sm text-white/80">{item}</p>
            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-300 text-xl">&times;</button>
          </div>
        ))}
        <div className="flex gap-2">
          <GlassInput value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={`Add new ${label.toLowerCase().slice(0, -1)}...`} className="py-2" />
          <button type="button" onClick={handleAddItem} className="px-4 py-2 text-sm rounded-lg font-semibold bg-teal-500/80 text-white hover:bg-teal-500/100 transition-colors">Add</button>
        </div>
      </div>
    );
};

const CourseModal: FC<{ course: Course | null; categories: CourseCategory[]; onClose: () => void; onSave: (course: Course) => void; }> = ({ course, categories, onClose, onSave }) => {
  const [currentCourse, setCurrentCourse] = useState<Course>(
    course || { id: `c${Date.now()}`, title: '', duration: '', fee: '', altFee: '', category: categories[0]?.id || '', features: [], description: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (features: string[]) => {
    setCurrentCourse(prev => ({...prev, features}));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(currentCourse); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <GlassCard className="border-teal-400/50 border-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{course ? 'Edit Course' : 'Add New Course'}</h2>
              <button type="button" onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-white/90 mb-1">Title</label><GlassInput name="title" value={currentCourse.title} onChange={handleChange} required /></div>
              <div><label className="block text-sm font-medium text-white/90 mb-1">Category</label>
                <select name="category" value={currentCourse.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all">
                  {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-gray-800">{cat.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-white/90 mb-1">Duration</label><GlassInput name="duration" value={currentCourse.duration} onChange={handleChange} /></div>
              <div><label className="block text-sm font-medium text-white/90 mb-1">Fee</label><GlassInput name="fee" value={currentCourse.fee} onChange={handleChange} /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-white/90 mb-1">Alternative Fee (Optional)</label><GlassInput name="altFee" value={currentCourse.altFee || ''} onChange={handleChange} /></div>
            </div>
            
            <div><label className="block text-sm font-medium text-white/90 mb-1">Description</label><GlassTextarea name="description" value={currentCourse.description} onChange={handleChange} /></div>
            
            <StringListEditor list={currentCourse.features} setList={handleFeaturesChange} label="Features" />

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 font-medium">Cancel</button>
              <PrimaryButton type="submit">Save Course</PrimaryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};


// ---------------------------
// Main Page Component
// ---------------------------

type ArrayKeysOf<T> = { [K in keyof T]: T[K] extends any[] ? K : never; }[keyof T];

export default function EditCoursePage() {
  const [pageData, setPageData] = useState<CoursePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/course");
        if (response.ok) { const data = await response.json(); setPageData(data); setIsExistingData(true); } 
        else if (response.status === 404) { setPageData(DEFAULT_DATA); setIsExistingData(false); toast.info("No existing data. Loaded default template."); } 
        else { throw new Error(`Failed to fetch: ${response.statusText}`); }
      } catch (error) { console.error("Error fetching course data:", error); toast.error("Could not fetch data."); setPageData(DEFAULT_DATA); setIsExistingData(false); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!pageData) return;
    setIsSaving(true);
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const response = await fetch("/api/site-setting/course", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Course page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving course data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handlePageInfoUpdate = (field: keyof PageInfo, value: any) => {
    setPageData(prev => prev ? { ...prev, pageInfo: { ...prev.pageInfo, [field]: value } } : null);
  };
  
  const handleListUpdate = <K extends ArrayKeysOf<CoursePageData>>(listKey: K, index: number, field: keyof CoursePageData[K][number], value: string) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends ArrayKeysOf<CoursePageData>>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList }; }); };
  const handleListAdd = <K extends ArrayKeysOf<CoursePageData>>(listKey: K, newItem: CoursePageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList }; }); };

  const handleSaveCourse = (savedCourse: Course) => {
    if (!pageData) return;
    const existingIndex = pageData.courses.findIndex(c => c.id === savedCourse.id);
    const updatedCourses = existingIndex > -1 ? pageData.courses.map(c => c.id === savedCourse.id ? savedCourse : c) : [...pageData.courses, savedCourse];
    setPageData(prev => prev ? { ...prev, courses: updatedCourses } : null);
    setIsModalOpen(false);
    setEditingCourse(null);
    toast.success(`Course "${savedCourse.title}" saved!`);
  };

  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading course editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      {isModalOpen && <CourseModal course={editingCourse} categories={pageData.courseCategories} onClose={() => setIsModalOpen(false)} onSave={handleSaveCourse} />}
      
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div><h1 className="text-3xl md:text-4xl font-bold text-white">Course Page Editor</h1><p className="text-white/80 mt-2">Manage all content for the public courses page.</p></div>
              <PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Title</label><GlassInput value={pageData.pageInfo.title} onChange={e => handlePageInfoUpdate('title', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Subtitle</label><GlassTextarea value={pageData.pageInfo.subtitle} onChange={e => handlePageInfoUpdate('subtitle', e.target.value)} /></div>
              <StringListEditor list={pageData.pageInfo.benefits} setList={(list) => handlePageInfoUpdate('benefits', list)} label="Benefits List"/>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Course Categories</h2>
                <button onClick={() => handleListAdd('courseCategories', {id: `cat${Date.now()}`, name: '', icon: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add</button>
              </div>
              <div className="space-y-3">
                {pageData.courseCategories.map((cat, index) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <GlassInput placeholder="Icon" value={cat.icon} onChange={e => handleListUpdate('courseCategories', index, 'icon', e.target.value)} className="w-16 text-center" />
                    <GlassInput placeholder="Category Name" value={cat.name} onChange={e => handleListUpdate('courseCategories', index, 'name', e.target.value)} />
                    <DangerButton onClick={() => handleListRemove('courseCategories', index)}>Remove</DangerButton>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">Courses</h2>
              <PrimaryButton onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}>Add New Course</PrimaryButton>
            </div>
            <div className="space-y-4">
              {pageData.courses.length > 0 ? pageData.courses.map((course) => (
                <div key={course.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                   <div>
                       <h3 className="font-bold text-white">{course.title}</h3>
                       <p className="text-sm text-white/70">{pageData.courseCategories.find(c => c.id === course.category)?.name || 'Uncategorized'}</p>
                   </div>
                   <div className="flex gap-2 self-end sm:self-center">
                       <button onClick={() => { setEditingCourse(course); setIsModalOpen(true); }} className="px-4 py-2 text-sm rounded-xl font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20">Edit</button>
                       <DangerButton onClick={() => handleListRemove('courses', pageData.courses.findIndex(c => c.id === course.id))}>Delete</DangerButton>
                   </div>
                </div>
              )) : (
                 <p className="text-center text-white/60 py-4">No courses created yet. Click &quot;Add New Course&quot; to start.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}