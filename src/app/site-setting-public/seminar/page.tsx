"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type Seminar = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  speaker: string;
  speakerTitle: string;
  description: string;
  topics: string[];
  location: string;
  capacity: number;
  registered: number;
  type: "upcoming" | "past";
  category: string;
  image?: string;
};

type SeminarCategory = {
  id: string;
  name: string;
  icon: string;
};

const SEMINAR_CATEGORIES: SeminarCategory[] = [
  { id: "all", name: "All Events", icon: "📅" },
  { id: "ielts", name: "IELTS Prep", icon: "🎓" },
  { id: "career", name: "Career", icon: "💼" },
  { id: "study-abroad", name: "Study Abroad", icon: "✈️" },
  { id: "workshop", name: "Workshops", icon: "🛠️" },
];

const SEMINARS_DATA: Seminar[] = [
  {
    id: "s1",
    title: "IELTS Success Strategies for 2025",
    date: "November 15, 2025",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    speaker: "Dr. Sarah Ahmed",
    speakerTitle: "IELTS Expert & Senior Trainer",
    description: "Learn proven strategies to achieve your target IELTS band score. This comprehensive seminar covers all four modules with practical tips and common mistakes to avoid.",
    topics: [
      "Band 7+ Writing Techniques",
      "Speaking Module Mastery",
      "Time Management Tips",
      "Common Mistakes & Solutions",
      "Latest Exam Trends"
    ],
    location: "Stars English Centre Main Campus",
    capacity: 50,
    registered: 38,
    type: "upcoming",
    category: "ielts",
  },
  {
    id: "s2",
    title: "Study Abroad: UK & Canada Universities Guide",
    date: "November 22, 2025",
    time: "2:00 PM - 4:30 PM",
    duration: "2.5 hours",
    speaker: "Mr. Rahul Sharma",
    speakerTitle: "Education Consultant & Former Admissions Officer",
    description: "Comprehensive guide to studying in UK and Canada. Learn about university selection, application process, scholarships, and visa requirements.",
    topics: [
      "Top Universities Overview",
      "Application Process Step-by-Step",
      "Scholarship Opportunities",
      "Visa Requirements & Process",
      "Cost of Living & Budgeting"
    ],
    location: "Online (Zoom)",
    capacity: 100,
    registered: 67,
    type: "upcoming",
    category: "study-abroad",
  },
  {
    id: "s3",
    title: "Business English Communication Workshop",
    date: "December 5, 2025",
    time: "9:00 AM - 1:00 PM",
    duration: "4 hours",
    speaker: "Ms. Priya Gupta",
    speakerTitle: "Corporate Trainer & Communication Expert",
    description: "Enhance your professional English skills with this hands-on workshop. Perfect for working professionals and business students.",
    topics: [
      "Email Writing & Professional Communication",
      "Presentation Skills",
      "Meeting & Negotiation Language",
      "Networking in English",
      "Cultural Communication Differences"
    ],
    location: "Stars English Centre - Seminar Hall",
    capacity: 40,
    registered: 25,
    type: "upcoming",
    category: "workshop",
  },
  {
    id: "s4",
    title: "Career Opportunities After English Proficiency",
    date: "December 12, 2025",
    time: "3:00 PM - 5:00 PM",
    duration: "2 hours",
    speaker: "Mr. Kamal Hassan",
    speakerTitle: "HR Director & Career Coach",
    description: "Discover how English proficiency can transform your career. Learn about international job opportunities and career advancement strategies.",
    topics: [
      "Global Job Market Insights",
      "Resume & Cover Letter Writing",
      "Interview Preparation",
      "Salary Negotiation",
      "Career Growth Strategies"
    ],
    location: "Stars English Centre Main Campus",
    capacity: 60,
    registered: 42,
    type: "upcoming",
    category: "career",
  },
  {
    id: "s5",
    title: "PTE Academic Masterclass",
    date: "December 20, 2025",
    time: "11:00 AM - 2:00 PM",
    duration: "3 hours",
    speaker: "Dr. Michael Thompson",
    speakerTitle: "PTE Certified Trainer",
    description: "Intensive masterclass covering all sections of PTE Academic. Get insider tips and practice with real exam scenarios.",
    topics: [
      "Speaking & Writing Integration",
      "Reading Strategies",
      "Listening Techniques",
      "Scoring System Explained",
      "Practice Test Walkthrough"
    ],
    location: "Online (Zoom)",
    capacity: 80,
    registered: 54,
    type: "upcoming",
    category: "ielts",
  },
  {
    id: "s6",
    title: "Effective English Learning Strategies",
    date: "October 10, 2025",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    speaker: "Ms. Fatima Khan",
    speakerTitle: "Language Learning Expert",
    description: "Past seminar on proven methods to accelerate your English learning journey. Covered memory techniques and practice strategies.",
    topics: [
      "Memory Techniques",
      "Daily Practice Routines",
      "Using Technology for Learning",
      "Overcoming Common Challenges",
      "Building Confidence"
    ],
    location: "Stars English Centre Main Campus",
    capacity: 50,
    registered: 50,
    type: "past",
    category: "workshop",
  },
];

const COMPANY_INFO = {
  name: "Stars English Centre",
  tagline: "Empowering learners through knowledge and expertise",
  benefits: [
    "Expert Speakers",
    "Interactive Sessions",
    "Free for Enrolled Students",
    "Certificate of Attendance",
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

// Seminar Card Component
function SeminarCard({ seminar }: { seminar: Seminar }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const spotsLeft = seminar.capacity - seminar.registered;
  const percentFilled = (seminar.registered / seminar.capacity) * 100;

  return (
    <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] hover:bg-white/15 transition-all duration-300 ${seminar.type === 'past' ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              seminar.type === 'upcoming' 
                ? 'bg-green-400/30 border border-green-300/50 text-green-100' 
                : 'bg-gray-400/30 border border-gray-300/50 text-gray-100'
            }`}>
              {seminar.type === 'upcoming' ? '🔴 Upcoming' : '✓ Past Event'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-400/30 border border-purple-300/50 text-purple-100">
              {seminar.duration}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{seminar.title}</h3>
        </div>
      </div>

      {/* Date & Time */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">📅</span>
          <span>{seminar.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">🕐</span>
          <span>{seminar.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">📍</span>
          <span>{seminar.location}</span>
        </div>
      </div>

      {/* Speaker */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {seminar.speaker.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{seminar.speaker}</p>
            <p className="text-xs text-white/70">{seminar.speakerTitle}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/80 mb-4 leading-relaxed">{seminar.description}</p>

      {/* Topics (Expandable) */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 mb-2"
        >
          {isExpanded ? '▼' : '▶'} Topics Covered
        </button>

        {isExpanded && (
          <ul className="space-y-2 pl-4">
            {seminar.topics.map((topic, idx) => (
              <li key={idx} className="text-sm text-white/80 flex items-center gap-2">
                <span className="text-teal-300">✓</span> {topic}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Capacity */}
      {seminar.type === 'upcoming' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/70 mb-2">
            <span>Registration</span>
            <span>{seminar.registered} / {seminar.capacity} registered</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                percentFilled > 80 ? 'bg-red-400' : percentFilled > 50 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
          <p className="text-xs text-white/70 mt-1">
            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {seminar.type === 'upcoming' ? (
          <>
            <button 
              disabled={spotsLeft <= 0}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 ${
                spotsLeft <= 0 
                  ? 'bg-gray-400/50 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {spotsLeft <= 0 ? 'Fully Booked' : 'Register Now'}
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
              Details
            </button>
          </>
        ) : (
          <button className="flex-1 px-4 py-2 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
            View Recording
          </button>
        )}
      </div>
    </div>
  );
}

export default function SeminarsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);

  const filteredSeminars = SEMINARS_DATA.filter(seminar => {
    const matchesCategory = selectedCategory === "all" || seminar.category === selectedCategory;
    const matchesType = showPastEvents ? seminar.type === "past" : seminar.type === "upcoming";
    return matchesCategory && matchesType;
  });

  const upcomingCount = SEMINARS_DATA.filter(s => s.type === 'upcoming').length;
  const pastCount = SEMINARS_DATA.filter(s => s.type === 'past').length;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                Seminars & Workshops
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                Join our expert-led seminars and workshops to enhance your English skills and explore global opportunities
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {COMPANY_INFO.benefits.map((benefit, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 border border-white/30 backdrop-blur-md text-white">
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-teal-300">{upcomingCount}</p>
                  <p className="text-sm text-white/80">Upcoming Events</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-teal-300">{pastCount}</p>
                  <p className="text-sm text-white/80">Past Events</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-teal-300">500+</p>
                  <p className="text-sm text-white/80">Participants</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-3xl font-bold text-teal-300">4.8/5</p>
                  <p className="text-sm text-white/80">Average Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-3">
                {SEMINAR_CATEGORIES.map((category) => (
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

            {/* Type Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-sm text-white/80">Show Past Events</span>
              <button
                onClick={() => setShowPastEvents(!showPastEvents)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  showPastEvents ? 'bg-teal-400' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    showPastEvents ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Seminars Grid */}
          {filteredSeminars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredSeminars.map((seminar) => (
                <SeminarCard key={seminar.id} seminar={seminar} />
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-xl mb-10">
              <p className="text-xl text-white/80 mb-4">No {showPastEvents ? 'past' : 'upcoming'} seminars found in this category.</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300"
              >
                View All Events
              </button>
            </div>
          )}

          {/* Newsletter Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Never Miss an Event</h2>
                <p className="text-white/90 mb-4">
                  Subscribe to our newsletter and get notified about upcoming seminars, workshops, and special events.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Early bird registration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Exclusive content & materials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-300">✓</span> Event recordings access
                  </li>
                </ul>
              </div>

              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Subscribe Now</h3>
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
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="terms" className="w-4 h-4" />
                    <label htmlFor="terms" className="text-xs text-white/70">
                      I agree to receive event notifications and updates
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Subscribe
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