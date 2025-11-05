"use client"
import React, { useEffect, useRef, useState } from "react";
import { Metadata } from "next";

// ---------------------------
// Static data
// ---------------------------

type Course = {
  id: string;
  title: string;
  duration: string;
  fee: string;
  altFee?: string;
  category: string;
  features: string[];
  description: string;
};

type CourseCategory = {
  id: string;
  name: string;
  icon: string;
};

const COURSE_CATEGORIES: CourseCategory[] = [
  { id: "all", name: "All Courses", icon: "📚" },
  { id: "general", name: "General English", icon: "✍️" },
  { id: "ielts", name: "IELTS", icon: "🎓" },
  { id: "kids", name: "Kids & Juniors", icon: "👶" },
  { id: "professional", name: "Professional", icon: "💼" },
];

const COURSES_DATA: Course[] = [
  {
    id: "c1",
    title: "Foundation ENGLISH",
    duration: "2.5 / 3 months",
    fee: "6,000/-",
    altFee: "(10,000/-)",
    category: "general",
    features: ["Basic Grammar", "Vocabulary Building", "Speaking Practice", "Writing Fundamentals"],
    description: "Build a strong foundation in English with our comprehensive program covering all basics.",
  },
  {
    id: "c2",
    title: "ADVANCED SPOKEN & PHONETICS",
    duration: "2.5 months",
    fee: "6,000/-",
    altFee: "(10,000/-)",
    category: "general",
    features: ["Accent Training", "Pronunciation", "Fluency Development", "Confidence Building"],
    description: "Master the art of speaking English with confidence through advanced phonetics training.",
  },
  {
    id: "c3",
    title: "Grammar And Freehand WRITING",
    duration: "2.5 months",
    fee: "6,000/-",
    altFee: "(10,000/-)",
    category: "general",
    features: ["Advanced Grammar", "Essay Writing", "Creative Writing", "Business Writing"],
    description: "Enhance your writing skills with comprehensive grammar and creative writing techniques.",
  },
  {
    id: "c4",
    title: "PTE Academic / UK VI",
    duration: "2.5 months",
    fee: "9,000/-",
    altFee: "(15,000/-)",
    category: "professional",
    features: ["PTE Exam Prep", "Mock Tests", "Score Improvement", "Expert Guidance"],
    description: "Prepare for PTE Academic and UK VI with expert trainers and proven strategies.",
  },
  {
    id: "c5",
    title: "Kids' English",
    duration: "12 months",
    fee: "Admission: 4,200/- | Per month: 2,400/-",
    category: "kids",
    features: ["Age-appropriate Content", "Fun Learning", "Interactive Sessions", "Progress Tracking"],
    description: "Specially designed English program for kids with engaging and fun learning methods.",
  },
  {
    id: "c6",
    title: "Juniors' English",
    duration: "12 months",
    fee: "Admission: 4,200/- | Per month: 2,400/-",
    category: "kids",
    features: ["Teen-focused Content", "Exam Preparation", "Communication Skills", "Peer Learning"],
    description: "Comprehensive English program for juniors focusing on academic and communication skills.",
  },
  {
    id: "c7",
    title: "IELTS Regular",
    duration: "2.5 months",
    fee: "9,000/-",
    altFee: "(15,000/-)",
    category: "ielts",
    features: ["All 4 Modules", "Practice Tests", "Band Score Focus", "Study Materials"],
    description: "Complete IELTS preparation covering Listening, Reading, Writing, and Speaking modules.",
  },
  {
    id: "c8",
    title: "IELTS Executive",
    duration: "3.5 months",
    fee: "10,200/-",
    altFee: "(17,000/-)",
    category: "ielts",
    features: ["Extended Training", "Personal Attention", "Flexible Schedule", "Premium Support"],
    description: "Extended IELTS program with personalized attention and flexible timing for working professionals.",
  },
  {
    id: "c9",
    title: "IELTS Crash Course",
    duration: "1.5 months",
    fee: "9,300/-",
    altFee: "(15,500/-)",
    category: "ielts",
    features: ["Quick Preparation", "Intensive Training", "Fast Track", "Exam Tips"],
    description: "Intensive IELTS preparation for those who need quick results with focused training.",
  },
  {
    id: "c10",
    title: "BASIC TO IELTS",
    duration: "6 months",
    fee: "18,000/-",
    altFee: "(30,000/-)",
    category: "ielts",
    features: ["Foundation to Advanced", "Comprehensive Training", "Step-by-step Learning", "Complete Package"],
    description: "Complete package from basic English to IELTS preparation for beginners.",
  },
];

const COMPANY_INFO = {
  name: "Stars English Centre",
  tagline: "Private care program for all courses and corporate Training.",
  benefits: [
    "FREE IELTS Registration",
    "Expert Faculty with 17+ Years Experience",
    "Small Batch Sizes for Personal Attention",
    "Flexible Timings & Weekend Batches",
  ],
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

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white pr-4">{course.title}</h3>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/30 border border-teal-300/50 text-teal-100 shrink-0">
          {course.duration}
        </span>
      </div>

      <p className="text-sm text-white/80 mb-4 leading-relaxed">{course.description}</p>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-teal-300">{course.fee}</span>
          {course.altFee && <span className="text-sm text-white/60 line-through">{course.altFee}</span>}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
        >
          {isExpanded ? '▼' : '▶'} Course Features
        </button>

        {isExpanded && (
          <ul className="mt-3 space-y-2 pl-4">
            {course.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-white/80 flex items-center gap-2">
                <span className="text-teal-300">✓</span> {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button className="flex-1 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          Enroll Now
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
          Details
        </button>
      </div>
    </div>
  );
}

export default function CoursePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                Our Courses
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                Choose from our comprehensive range of English language courses designed for every level and goal
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {COMPANY_INFO.benefits.map((benefit, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 border border-white/30 backdrop-blur-md text-white">
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 mb-8 shadow-xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {COURSE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg scale-105'
                      : 'backdrop-blur-md bg-white/10 border border-white/30 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-xl">
              <p className="text-xl text-white/80">No courses found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
                <p className="text-white/90 mb-4">
                  Join thousands of students who have improved their English skills with Stars English Centre. 
                  Our expert teachers with 17+ years of experience are ready to guide you.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Personalized attention
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Small batch sizes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Proven teaching methods
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Flexible schedules
                  </li>
                </ul>
              </div>

              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Get Started Today</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  />
                  <select className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50">
                    <option value="" className="bg-gray-800">Select Course</option>
                    {COURSES_DATA.map(course => (
                      <option key={course.id} value={course.id} className="bg-gray-800">
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Request Information
                  </button>
                </form>
              </div>
            </div>
          </div>
 
        </section>
      </div>
    </main>
  );
}