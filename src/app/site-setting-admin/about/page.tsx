"use client"
import React, { useState, useEffect, useRef } from 'react';

// Types
type Course = {
  id: string;
  title: string;
  duration: string;
  fee: string;
  altFee?: string;
  note?: string;
};

type CompanyData = {
  name: string;
  tagline: string;
  hooks: string[];
  info: string;
  courses: Course[];
  teachersCount: number;
  experienceAvg: string;
};

// Default data structure
const DEFAULT_DATA: CompanyData = {
  name: "Stars English Centre",
  tagline: "Private care program for all courses and corporate Training.",
  hooks: [
    "FREE IELTS Registration",
    "ADMISSION IS GOING ON !! BOOK YOUR SEAT TODAY !!",
    "Master English Language with Confidence !!",
    "*100%* Service Oriented",
  ],
  info: "We provide private-care style classes across general English, Spoken & Phonetics, IELTS/PTE and long-term kids & juniors programs. Our corporate training packages are tailored to business needs.",
  courses: [
    { id: "c1", title: "Foundation ENGLISH (Regular & Executive)", duration: "2.5 / 3 months", fee: "6,000/-", altFee: "(10,000/-)" },
    { id: "c2", title: "ADVANCED SPOKEN & PHONETICS", duration: "2.5 months", fee: "6,000/-", altFee: "(10,000/-)" },
  ],
  teachersCount: 10,
  experienceAvg: "17+ years",
};

// Animated background component
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(139, 92, 246, 0.3)',
      'rgba(59, 130, 246, 0.3)',
      'rgba(236, 72, 153, 0.3)',
      'rgba(34, 211, 238, 0.3)',
      'rgba(168, 85, 247, 0.3)',
    ];

    for (let i = 0; i < 8; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

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
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
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

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function AboutEditDashboard() {
  const [formData, setFormData] = useState<CompanyData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/site-setting/about');
      
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setIsEditMode(true);
      } else if (response.status === 404) {
        setFormData(DEFAULT_DATA);
        setIsEditMode(false);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setFormData(DEFAULT_DATA);
      setIsEditMode(false);
      setMessage({type: 'error', text: 'Failed to load data. Using defaults.'});
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch('/api/site-setting/about', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      setMessage({type: 'success', text: `Data ${isEditMode ? 'updated' : 'created'} successfully!`});
      setIsEditMode(true);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error saving data:', err);
      setMessage({type: 'error', text: 'Failed to save data. Please try again.'});
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CompanyData, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const addHook = () => {
    setFormData(prev => ({
      ...prev,
      hooks: [...prev.hooks, '']
    }));
  };

  const updateHook = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      hooks: prev.hooks.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHook = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hooks: prev.hooks.filter((_, i) => i !== index)
    }));
  };

  const addCourse = () => {
    const newId = `c${formData.courses.length + 1}`;
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, {
        id: newId,
        title: '',
        duration: '',
        fee: '',
        altFee: '',
        note: ''
      }]
    }));
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((c, i) => 
        i === index ? {...c, [field]: value} : c
      )
    }));
  };

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto"></div>
            <p className="text-white mt-4 text-center">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">About Page Editor</h1>
                <p className="text-white/80 mt-2">
                  {isEditMode ? 'Update existing content' : 'Create new content'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={fetchData}
                  className="px-4 py-2 rounded-xl border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium"
                >
                  Refresh
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-4 rounded-xl backdrop-blur-md border ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border-green-500/30 text-green-100' 
                  : 'bg-red-500/20 border-red-500/30 text-red-100'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Basic Info Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                  placeholder="Enter tagline"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">About Information</label>
                <textarea
                  value={formData.info}
                  onChange={(e) => updateField('info', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all resize-none"
                  placeholder="Enter company information"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Teachers Count</label>
                  <input
                    type="number"
                    value={formData.teachersCount}
                    onChange={(e) => updateField('teachersCount', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Average Experience</label>
                  <input
                    type="text"
                    value={formData.experienceAvg}
                    onChange={(e) => updateField('experienceAvg', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                    placeholder="e.g., 17+ years"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hooks Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Marketing Hooks</h2>
              <button
                onClick={addHook}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg"
              >
                + Add Hook
              </button>
            </div>

            <div className="space-y-3">
              {formData.hooks.map((hook, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={hook}
                    onChange={(e) => updateHook(index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
                    placeholder="Enter hook text"
                  />
                  <button
                    onClick={() => removeHook(index)}
                    className="px-4 py-3 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 transition-all duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Courses</h2>
              <button
                onClick={addCourse}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg"
              >
                + Add Course
              </button>
            </div>

            <div className="space-y-6">
              {formData.courses.map((course, index) => (
                <div key={course.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Course {index + 1}</h3>
                    <button
                      onClick={() => removeCourse(index)}
                      className="px-3 py-1 rounded-lg backdrop-blur-md bg-red-500/20 border border-red-500/30 text-red-200 text-sm hover:bg-red-500/30 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-white/90 text-sm font-medium mb-2">Course Title</label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => updateCourse(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all text-sm"
                        placeholder="Enter course title"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={course.duration}
                        onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all text-sm"
                        placeholder="e.g., 2.5 months"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">Fee</label>
                      <input
                        type="text"
                        value={course.fee}
                        onChange={(e) => updateCourse(index, 'fee', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all text-sm"
                        placeholder="e.g., 6,000/-"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">Alternative Fee (Optional)</label>
                      <input
                        type="text"
                        value={course.altFee || ''}
                        onChange={(e) => updateCourse(index, 'altFee', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all text-sm"
                        placeholder="e.g., (10,000/-)"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">Note (Optional)</label>
                      <input
                        type="text"
                        value={course.note || ''}
                        onChange={(e) => updateCourse(index, 'note', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all text-sm"
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button (Mobile) */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl md:hidden">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEditMode ? 'Update Changes' : 'Create New'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}