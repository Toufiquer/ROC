"use client"
import React, { useEffect, useState, FC, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ---------------------------
// Type Definitions
// ---------------------------

type TeamMember = {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  experience: string;
  education: string;
  image: string; // For emoji or image URL
  bio: string;
};

type Stat = {
  id: string;
  label: string;
  value: string;
  icon: string;
};

type OurTeamPageData = {
  teamTitle: string;
  teamDescription: string;
  stats: Stat[];
  members: TeamMember[];
};

// ---------------------------
// Default Data
// ---------------------------

const DEFAULT_DATA: OurTeamPageData = {
  teamTitle: "Meet Our Expert Team",
  teamDescription: "Our dedicated team of professional educators brings decades of combined experience.",
  stats: [
    { id: "s1", label: "Expert Teachers", value: "10+", icon: "👨‍🏫" },
    { id: "s2", label: "Years Experience", value: "17+", icon: "⭐" },
  ],
  members: [
    {
      id: "t1",
      name: "Dr. Sarah Mitchell",
      role: "Academic Director",
      specialization: ["IELTS", "Academic Writing"],
      experience: "22 years",
      education: "PhD in Applied Linguistics",
      image: "👩‍🏫",
      bio: "Specializes in IELTS preparation with a proven track record."
    },
    {
      id: "t2",
      name: "James Robertson",
      role: "Senior IELTS Instructor",
      specialization: ["IELTS Speaking", "Pronunciation"],
      experience: "19 years",
      education: "MA in TESOL",
      image: "👨‍💼",
      bio: "Expert in spoken English and phonetics. Former IELTS examiner."
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

const TeamMemberModal: FC<{ member: TeamMember | null; onClose: () => void; onSave: (member: TeamMember) => void; }> = ({ member, onClose, onSave }) => {
  const [currentMember, setCurrentMember] = useState<TeamMember>(
    member || { id: `t${Date.now()}`, name: '', role: '', specialization: [], experience: '', education: '', image: '👤', bio: '' }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setCurrentMember(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(currentMember); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <GlassCard className="border-teal-400/50 border-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">{member ? 'Edit Team Member' : 'Add New Member'}</h2><button type="button" onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-white/90 mb-1">Full Name</label><GlassInput name="name" value={currentMember.name} onChange={handleChange} required /></div>
              <div><label className="block text-sm font-medium text-white/90 mb-1">Role / Position</label><GlassInput name="role" value={currentMember.role} onChange={handleChange} /></div>
              <div><label className="block text-sm font-medium text-white/90 mb-1">Image (Emoji or URL)</label><GlassInput name="image" value={currentMember.image} onChange={handleChange} /></div>
              <div><label className="block text-sm font-medium text-white/90 mb-1">Experience</label><GlassInput name="experience" value={currentMember.experience} onChange={handleChange} placeholder="e.g., 15 years" /></div>
              <div className="lg:col-span-2"><label className="block text-sm font-medium text-white/90 mb-1">Education</label><GlassInput name="education" value={currentMember.education} onChange={handleChange} placeholder="e.g., MA in TESOL" /></div>
            </div>
            <div><label className="block text-sm font-medium text-white/90 mb-1">Bio / Short Description</label><GlassTextarea name="bio" value={currentMember.bio} onChange={handleChange} rows={4}/></div>
            <StringListEditor list={currentMember.specialization} setList={(list) => setCurrentMember(p => ({...p, specialization: list}))} label="Specializations" />
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 font-medium">Cancel</button><PrimaryButton type="submit">Save Member</PrimaryButton></div>
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

export default function EditOurTeamPage() {
  const [pageData, setPageData] = useState<OurTeamPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-setting/our-team");
        if (response.ok) { const data = await response.json(); setPageData(data); setIsExistingData(true); } 
        else if (response.status === 404) { setPageData(DEFAULT_DATA); setIsExistingData(false); toast.info("No existing data. Loaded default template."); } 
        else { throw new Error(`Failed to fetch: ${response.statusText}`); }
      } catch (error) { console.error("Error fetching team data:", error); toast.error("Could not fetch data."); setPageData(DEFAULT_DATA); setIsExistingData(false); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!pageData) return;
    setIsSaving(true);
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const response = await fetch("/api/site-setting/our-team", { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageData), });
      if (!response.ok) throw new Error(`Failed to save: ${response.statusText}`);
      toast.success(`Team page ${isExistingData ? 'updated' : 'created'} successfully!`);
      setIsExistingData(true);
    } catch (error) { console.error("Error saving team data:", error); toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handleFieldUpdate = <K extends keyof OurTeamPageData>(field: K, value: OurTeamPageData[K]) => { setPageData(prev => prev ? { ...prev, [field]: value } : null); };
  const handleListUpdate = <K extends ArrayKeysOf<OurTeamPageData>>(listKey: K, index: number, field: keyof OurTeamPageData[K][number], value: string) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.map((item, i) => i === index ? { ...item, [field]: value } : item); return { ...prev, [listKey]: updatedList }; }); };
  const handleListRemove = <K extends ArrayKeysOf<OurTeamPageData>>(listKey: K, index: number) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = list.filter((_, i) => i !== index); return { ...prev, [listKey]: updatedList }; }); };
  const handleListAdd = <K extends ArrayKeysOf<OurTeamPageData>>(listKey: K, newItem: OurTeamPageData[K][number]) => { setPageData(prev => { if (!prev) return null; const list = prev[listKey]; const updatedList = [...list, newItem]; return { ...prev, [listKey]: updatedList }; }); };

  const handleSaveMember = (savedMember: TeamMember) => {
    if (!pageData) return;
    const existingIndex = pageData.members.findIndex(m => m.id === savedMember.id);
    const updatedMembers = existingIndex > -1 ? pageData.members.map(m => m.id === savedMember.id ? savedMember : m) : [...pageData.members, savedMember];
    handleFieldUpdate('members', updatedMembers);
    setIsModalOpen(false);
    setEditingMember(null);
    toast.success(`Team member "${savedMember.name}" saved!`);
  };

  if (isLoading) { return ( <main className="min-h-screen relative overflow-hidden"><AnimatedBackground /><div className="relative z-10 flex items-center justify-center min-h-screen"><GlassCard><div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div><p className="text-white mt-4 text-center">Loading team editor...</p></GlassCard></div></main> ); }
  if (!pageData) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" />
      {isModalOpen && <TeamMemberModal member={editingMember} onClose={() => setIsModalOpen(false)} onSave={handleSaveMember} />}
      
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div><h1 className="text-3xl md:text-4xl font-bold text-white">Our Team Page Editor</h1><p className="text-white/80 mt-2">Manage all content for the public team page.</p></div>
              <PrimaryButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
            <div className="space-y-4">
              <div><label className="block text-white/90 font-medium mb-2">Page Title</label><GlassInput value={pageData.teamTitle} onChange={e => handleFieldUpdate('teamTitle', e.target.value)} /></div>
              <div><label className="block text-white/90 font-medium mb-2">Page Description</label><GlassTextarea value={pageData.teamDescription} onChange={e => handleFieldUpdate('teamDescription', e.target.value)} /></div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Statistics</h2>
                <button onClick={() => handleListAdd('stats', {id: `s${Date.now()}`, icon: '', label: '', value: ''})} className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg">+ Add Stat</button>
              </div>
              <div className="space-y-3">
                {pageData.stats.map((stat, index) => (
                  <div key={stat.id} className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] items-center gap-2">
                    <GlassInput placeholder="Icon" value={stat.icon} onChange={e => handleListUpdate('stats', index, 'icon', e.target.value)} className="w-16 text-center" />
                    <GlassInput placeholder="Label" value={stat.label} onChange={e => handleListUpdate('stats', index, 'label', e.target.value)} />
                    <div className="flex items-center gap-2">
                        <GlassInput placeholder="Value" value={stat.value} onChange={e => handleListUpdate('stats', index, 'value', e.target.value)} />
                        <DangerButton onClick={() => handleListRemove('stats', index)}>X</DangerButton>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">Team Members</h2>
              <PrimaryButton onClick={() => { setEditingMember(null); setIsModalOpen(true); }}>Add New Member</PrimaryButton>
            </div>
            <div className="space-y-4">
              {pageData.members.length > 0 ? pageData.members.map((member) => (
                <div key={member.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                   <div className="flex items-center gap-4"><div className="text-3xl w-12 h-12 flex items-center justify-center bg-black/20 rounded-full">{member.image}</div><div><h3 className="font-bold text-white">{member.name}</h3><p className="text-sm text-purple-200">{member.role}</p></div></div>
                   <div className="flex gap-2 self-end sm:self-center"><button onClick={() => { setEditingMember(member); setIsModalOpen(true); }} className="px-4 py-2 text-sm rounded-xl font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20">Edit</button><DangerButton onClick={() => handleListRemove('members', pageData.members.findIndex(m => m.id === member.id))}>Delete</DangerButton></div>
                </div>
              )) : ( <p className="text-center text-white/60 py-4">No team members added yet.</p> )}
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}