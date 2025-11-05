"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
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
  name: string;
  icon: string;
  count: number;
};

type StudyMaterialsData = {
  companyName: string;
  pageTitle: string;
  pageDescription: string;
  categories: Category[];
  levels: string[];
  types: string[];
  materials: Material[];
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
};

const STUDY_MATERIALS_DATA: StudyMaterialsData = {
  companyName: "Stars English Centre",
  pageTitle: "Study Materials & Resources",
  pageDescription: "Access our comprehensive collection of study materials, practice tests, worksheets, and learning resources designed by expert instructors.",
  categories: [
    { name: "All Materials", icon: "📚", count: 45 },
    { name: "IELTS", icon: "✍️", count: 12 },
    { name: "Spoken English", icon: "🗣️", count: 8 },
    { name: "Grammar", icon: "📝", count: 10 },
    { name: "Vocabulary", icon: "📖", count: 7 },
    { name: "Practice Tests", icon: "✅", count: 8 },
  ],
  levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
  types: ["PDF", "Video", "Audio", "Interactive", "Worksheet"],
  materials: [
    {
      id: "mat1",
      title: "IELTS Writing Task 2 - Complete Guide",
      description: "Comprehensive guide covering all essay types, band descriptors, sample answers, and examiner tips for achieving band 8+.",
      category: "IELTS",
      level: "Advanced",
      type: "PDF",
      format: "PDF Document",
      pages: 125,
      size: "8.5 MB",
      downloads: 2456,
      rating: 4.9,
      thumbnail: "📄",
      tags: ["Writing", "Essays", "Band 8+", "Task 2"]
    },
    {
      id: "mat2",
      title: "IELTS Speaking Part 2 - 200 Cue Cards",
      description: "Collection of 200 most common IELTS speaking cue cards with model answers and vocabulary for band 7-9.",
      category: "IELTS",
      level: "Intermediate",
      type: "PDF",
      format: "PDF Document",
      pages: 180,
      size: "6.2 MB",
      downloads: 3201,
      rating: 4.8,
      thumbnail: "🎤",
      tags: ["Speaking", "Cue Cards", "Part 2", "Vocabulary"]
    },
    {
      id: "mat3",
      title: "Advanced Grammar Masterclass",
      description: "In-depth video series covering complex grammar structures, tenses, conditionals, and advanced sentence patterns.",
      category: "Grammar",
      level: "Advanced",
      type: "Video",
      format: "Video Series",
      duration: "8 hours",
      size: "2.1 GB",
      downloads: 1845,
      rating: 4.9,
      thumbnail: "🎥",
      tags: ["Grammar", "Video Lessons", "Advanced", "Tenses"]
    },
    {
      id: "mat4",
      title: "English Pronunciation Guide",
      description: "Complete phonetics guide with audio examples for all English sounds, minimal pairs, and stress patterns.",
      category: "Spoken English",
      level: "Beginner",
      type: "Audio",
      format: "Audio + PDF",
      duration: "5 hours",
      size: "450 MB",
      downloads: 2103,
      rating: 4.7,
      thumbnail: "🔊",
      tags: ["Pronunciation", "Phonetics", "Audio", "Speaking"]
    },
    {
      id: "mat5",
      title: "IELTS Reading Practice Tests - Academic",
      description: "15 full-length IELTS Academic reading tests with answers, explanations, and time management strategies.",
      category: "Practice Tests",
      level: "Intermediate",
      type: "PDF",
      format: "PDF Document",
      pages: 200,
      size: "12.3 MB",
      downloads: 4521,
      rating: 4.8,
      thumbnail: "📖",
      tags: ["Reading", "Practice Tests", "Academic", "IELTS"]
    },
    {
      id: "mat6",
      title: "Business English Vocabulary Builder",
      description: "Essential business vocabulary, idioms, and expressions for corporate communication and professional settings.",
      category: "Vocabulary",
      level: "Intermediate",
      type: "Interactive",
      format: "Interactive PDF",
      pages: 95,
      size: "5.8 MB",
      downloads: 1672,
      rating: 4.6,
      thumbnail: "💼",
      tags: ["Business", "Vocabulary", "Corporate", "Professional"]
    },
    {
      id: "mat7",
      title: "IELTS Listening Practice Pack",
      description: "20 full IELTS listening tests with transcripts, audio files, and detailed answer explanations.",
      category: "Practice Tests",
      level: "Intermediate",
      type: "Audio",
      format: "Audio + PDF",
      duration: "10 hours",
      size: "1.2 GB",
      downloads: 3876,
      rating: 4.9,
      thumbnail: "🎧",
      tags: ["Listening", "Practice Tests", "Audio", "IELTS"]
    },
    {
      id: "mat8",
      title: "Everyday Conversation Phrases",
      description: "500+ common phrases and expressions used in daily English conversations with pronunciation tips.",
      category: "Spoken English",
      level: "Beginner",
      type: "PDF",
      format: "PDF Document",
      pages: 75,
      size: "3.2 MB",
      downloads: 5234,
      rating: 4.7,
      thumbnail: "💬",
      tags: ["Conversation", "Phrases", "Daily English", "Speaking"]
    },
    {
      id: "mat9",
      title: "Advanced Vocabulary 3000 Words",
      description: "Comprehensive list of 3000 advanced English words with definitions, examples, and memory techniques.",
      category: "Vocabulary",
      level: "Advanced",
      type: "Interactive",
      format: "Interactive PDF",
      pages: 250,
      size: "15.4 MB",
      downloads: 2943,
      rating: 4.8,
      thumbnail: "📚",
      tags: ["Vocabulary", "Advanced", "Words", "Memory Techniques"]
    },
    {
      id: "mat10",
      title: "Grammar Worksheets Collection",
      description: "100+ printable grammar worksheets covering all levels from basic to advanced with answer keys.",
      category: "Grammar",
      level: "Beginner",
      type: "Worksheet",
      format: "PDF Worksheets",
      pages: 150,
      size: "7.8 MB",
      downloads: 4102,
      rating: 4.6,
      thumbnail: "📋",
      tags: ["Grammar", "Worksheets", "Practice", "Exercises"]
    },
    {
      id: "mat11",
      title: "IELTS Writing Task 1 - Academic",
      description: "Complete guide for IELTS Academic Writing Task 1 with graph descriptions, trends, and sample reports.",
      category: "IELTS",
      level: "Intermediate",
      type: "PDF",
      format: "PDF Document",
      pages: 98,
      size: "6.7 MB",
      downloads: 3567,
      rating: 4.7,
      thumbnail: "📊",
      tags: ["Writing", "Task 1", "Graphs", "Academic"]
    },
    {
      id: "mat12",
      title: "English Idioms & Expressions",
      description: "500 common English idioms and expressions with meanings, examples, and usage in context.",
      category: "Vocabulary",
      level: "Intermediate",
      type: "PDF",
      format: "PDF Document",
      pages: 120,
      size: "5.1 MB",
      downloads: 2789,
      rating: 4.8,
      thumbnail: "🎭",
      tags: ["Idioms", "Expressions", "Vocabulary", "Context"]
    },
  ],
  features: [
    {
      icon: "🎯",
      title: "Expertly Curated",
      description: "All materials designed by our experienced instructors with 17+ years of teaching experience"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access materials on any device - phone, tablet, or computer for learning on the go"
    },
    {
      icon: "🔄",
      title: "Regular Updates",
      description: "Content updated regularly to reflect latest exam patterns and teaching methodologies"
    },
    {
      icon: "✅",
      title: "Quality Assured",
      description: "Every material reviewed and tested to ensure accuracy and effectiveness"
    },
  ]
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

export default function StudyMaterialsPage() {
  const data = STUDY_MATERIALS_DATA;
  const [selectedCategory, setSelectedCategory] = useState<string>("All Materials");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredMaterials = data.materials.filter((material) => {
    const matchesCategory = selectedCategory === "All Materials" || material.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || material.level === selectedLevel;
    const matchesSearch = searchQuery === "" || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Glassmorphism Header Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-12">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {data.pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  {data.pageDescription}
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search materials by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-xl">
                      🔍
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {data.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {data.categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-6 py-3 rounded-full backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.name
                        ? 'bg-white/30 border-white/60 shadow-xl'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="text-white font-semibold">{category.name}</span>
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs text-white/90">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level & View Mode Filter */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLevel("All")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedLevel === "All"
                      ? 'bg-white/30 text-white border-2 border-white/60'
                      : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  All Levels
                </button>
                {data.levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedLevel === level
                        ? 'bg-white/30 text-white border-2 border-white/60'
                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === "grid"
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === "list"
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  ☰ List
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-center">
              <p className="text-white/80 text-sm">
                Showing <span className="font-bold text-white">{filteredMaterials.length}</span> materials
              </p>
            </div>

            {/* Materials Grid/List */}
            {filteredMaterials.length === 0 ? (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-white mb-2">No materials found</h3>
                <p className="text-white/80">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className={`backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group ${
                      viewMode === "list" ? "flex gap-6 p-6" : "p-6"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className={`${
                      viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "w-20 h-20 mx-auto mb-4"
                    } rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-5xl border-2 border-white/30 group-hover:border-white/50 transition-all`}>
                      {material.thumbnail}
                    </div>

                    <div className="flex-1">
                      {/* Category Badge & Level */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30">
                          {material.category}
                        </span>
                        <span className="px-3 py-1 bg-purple-400/30 rounded-full text-xs text-white/90 border border-purple-300/40">
                          {material.level}
                        </span>
                        <span className="px-3 py-1 bg-cyan-400/30 rounded-full text-xs text-white/90 border border-cyan-300/40">
                          {material.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                        {material.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-white/80 mb-4 line-clamp-2">
                        {material.description}
                      </p>

                      {/* Details */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-white/70 flex-wrap">
                        {material.pages && (
                          <span className="flex items-center gap-1">
                            📄 {material.pages} pages
                          </span>
                        )}
                        {material.duration && (
                          <span className="flex items-center gap-1">
                            ⏱️ {material.duration}
                          </span>
                        )}
                        {material.size && (
                          <span className="flex items-center gap-1">
                            💾 {material.size}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-yellow-300">
                          <span>⭐</span>
                          <span className="text-white font-semibold">{material.rating}</span>
                        </div>
                        <div className="text-xs text-white/70">
                          📥 {material.downloads.toLocaleString()} downloads
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {material.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2">
                        <span>📥</span>
                        <span>Download Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-16 backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need More Resources?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Enroll in our courses to get access to exclusive premium materials, personalized feedback, and direct support from our expert instructors.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-105 shadow-lg">
                  View All Courses
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}