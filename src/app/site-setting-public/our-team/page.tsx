"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type TeamMember = {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  experience: string;
  education: string;
  image: string;
  bio: string;
};

type TeamData = {
  companyName: string;
  teamTitle: string;
  teamDescription: string;
  totalTeachers: number;
  avgExperience: string;
  members: TeamMember[];
  stats: {
    label: string;
    value: string;
    icon: string;
  }[];
};

const TEAM_DATA: TeamData = {
  companyName: "Stars English Centre",
  teamTitle: "Meet Our Expert Team",
  teamDescription: "Our dedicated team of professional educators brings decades of combined experience in English language instruction, IELTS preparation, and corporate training.",
  totalTeachers: 10,
  avgExperience: "17+ years",
  stats: [
    { label: "Expert Teachers", value: "10+", icon: "👨‍🏫" },
    { label: "Years Experience", value: "17+", icon: "⭐" },
    { label: "Success Rate", value: "95%", icon: "🎯" },
    { label: "Students Taught", value: "5000+", icon: "📚" },
  ],
  members: [
    {
      id: "t1",
      name: "Dr. Sarah Mitchell",
      role: "Academic Director",
      specialization: ["IELTS", "Academic Writing", "Corporate Training"],
      experience: "22 years",
      education: "PhD in Applied Linguistics",
      image: "👩‍🏫",
      bio: "Specializes in IELTS preparation with a proven track record of helping students achieve band 8+ scores."
    },
    {
      id: "t2",
      name: "James Robertson",
      role: "Senior IELTS Instructor",
      specialization: ["IELTS Speaking", "Pronunciation", "Interview Prep"],
      experience: "19 years",
      education: "MA in TESOL",
      image: "👨‍💼",
      bio: "Expert in spoken English and phonetics with Cambridge certification. Former IELTS examiner."
    },
    {
      id: "t3",
      name: "Maria Chen",
      role: "Kids & Juniors Specialist",
      specialization: ["Early Learning", "Creative Teaching", "Young Learners"],
      experience: "15 years",
      education: "BA in Education, CELTA",
      image: "👩‍🎓",
      bio: "Passionate about nurturing young minds with innovative and engaging teaching methods."
    },
    {
      id: "t4",
      name: "Ahmed Rahman",
      role: "Grammar & Writing Expert",
      specialization: ["Grammar", "Academic Writing", "Essay Composition"],
      experience: "18 years",
      education: "MA in English Literature",
      image: "👨‍🏫",
      bio: "Master of grammar instruction with expertise in helping students develop strong writing skills."
    },
    {
      id: "t5",
      name: "Emily Watson",
      role: "Phonetics & Spoken English",
      specialization: ["Pronunciation", "Accent Training", "Public Speaking"],
      experience: "16 years",
      education: "MA in Phonetics & Phonology",
      image: "👩‍💼",
      bio: "Specializes in advanced spoken English and helping students achieve native-like pronunciation."
    },
    {
      id: "t6",
      name: "David Thompson",
      role: "PTE & UK VI Specialist",
      specialization: ["PTE Academic", "Test Strategies", "Score Optimization"],
      experience: "14 years",
      education: "MA in Applied Linguistics",
      image: "👨‍💻",
      bio: "Expert in PTE preparation with deep understanding of test formats and scoring algorithms."
    },
    {
      id: "t7",
      name: "Fatima Khan",
      role: "Foundation English Instructor",
      specialization: ["Basic English", "Beginner Level", "Confidence Building"],
      experience: "20 years",
      education: "BA in English, TEFL Certified",
      image: "👩‍🏫",
      bio: "Dedicated to helping beginners build a strong foundation in English with patience and care."
    },
    {
      id: "t8",
      name: "Michael Brown",
      role: "Corporate Training Lead",
      specialization: ["Business English", "Corporate Communication", "Professional Development"],
      experience: "21 years",
      education: "MBA, DELTA Certification",
      image: "👨‍💼",
      bio: "Specializes in corporate training programs tailored to business professionals and executives."
    },
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

export default function TeamPage() {
  const team = TEAM_DATA;
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {team.teamTitle}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  {team.teamDescription}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
              {team.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* Avatar */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-5xl border-4 border-white/30 group-hover:border-white/50 transition-all duration-300">
                    {member.image}
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-purple-200 text-center mb-3 font-medium">
                    {member.role}
                  </p>

                  {/* Experience */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-yellow-300 text-sm">⏱️</span>
                    <span className="text-white/90 text-sm font-semibold">
                      {member.experience}
                    </span>
                  </div>

                  {/* Specialization Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.specialization.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30"
                      >
                        {spec}
                      </span>
                    ))}
                    {member.specialization.length > 2 && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30">
                        +{member.specialization.length - 2}
                      </span>
                    )}
                  </div>

                  {/* View More Button */}
                  <div className="text-center">
                    <button className="text-sm text-cyan-300 hover:text-cyan-200 font-medium group-hover:underline">
                      View Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Join thousands of successful students who have achieved their English language goals with our expert team.
              </p>
              <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-105 shadow-lg">
                Book Your Seat Today!
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal for Member Details */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="float-right text-white/70 hover:text-white text-2xl"
              onClick={() => setSelectedMember(null)}
            >
              ×
            </button>

            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-6xl border-4 border-white/30">
              {selectedMember.image}
            </div>

            {/* Name & Role */}
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              {selectedMember.name}
            </h2>
            <p className="text-lg text-purple-200 text-center mb-4 font-medium">
              {selectedMember.role}
            </p>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-sm text-white/70 mb-1">Education</div>
                <div className="text-white font-semibold">{selectedMember.education}</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-sm text-white/70 mb-1">Experience</div>
                <div className="text-white font-semibold">{selectedMember.experience}</div>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {selectedMember.specialization.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/20 rounded-full text-sm text-white border border-white/30"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">About</h3>
              <p className="text-white/90 leading-relaxed">{selectedMember.bio}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}