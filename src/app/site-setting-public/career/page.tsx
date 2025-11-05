"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type JobPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Full-time, Part-time, Contract
  experience: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
  isUrgent: boolean;
};

type Benefit = {
  icon: string;
  title: string;
  description: string;
};

type CoreValue = {
  icon: string;
  title: string;
  description: string;
};

const COMPANY_INFO = {
  name: "Stars English Centre",
  tagline: "Join our team of passionate educators",
  vision: "Building the future of English education, one teacher at a time",
};

const BENEFITS: Benefit[] = [
  {
    icon: "💰",
    title: "Competitive Salary",
    description: "Industry-leading compensation packages with performance bonuses"
  },
  {
    icon: "📚",
    title: "Professional Development",
    description: "Regular training sessions and certification opportunities"
  },
  {
    icon: "🏥",
    title: "Health Insurance",
    description: "Comprehensive health coverage for you and your family"
  },
  {
    icon: "🏖️",
    title: "Paid Time Off",
    description: "Generous vacation days and public holidays"
  },
  {
    icon: "⚖️",
    title: "Work-Life Balance",
    description: "Flexible schedules and supportive work environment"
  },
  {
    icon: "🎯",
    title: "Career Growth",
    description: "Clear career progression paths and promotion opportunities"
  },
];

const CORE_VALUES: CoreValue[] = [
  {
    icon: "🎓",
    title: "Excellence in Education",
    description: "We strive for the highest teaching standards and student success"
  },
  {
    icon: "🤝",
    title: "Collaborative Culture",
    description: "Teamwork and mutual support drive our success"
  },
  {
    icon: "💡",
    title: "Innovation",
    description: "We embrace new teaching methods and technologies"
  },
  {
    icon: "❤️",
    title: "Student-Centered",
    description: "Every decision we make prioritizes student learning"
  },
];

const JOB_OPENINGS: JobPosition[] = [
  {
    id: "job1",
    title: "Senior IELTS Instructor",
    department: "Academic",
    location: "Dhanmondi (Main Campus)",
    type: "Full-time",
    experience: "5+ years",
    salary: "৳45,000 - ৳65,000/month",
    description: "We are seeking an experienced IELTS instructor to join our academic team. The ideal candidate will have a proven track record of helping students achieve high band scores.",
    responsibilities: [
      "Conduct IELTS preparation classes for all four modules",
      "Develop curriculum and teaching materials",
      "Assess student progress and provide personalized feedback",
      "Conduct mock tests and evaluation sessions",
      "Stay updated with latest IELTS exam trends",
    ],
    requirements: [
      "IELTS Band 8.0 or higher (overall)",
      "Bachelor's degree in English, Education, or related field",
      "Minimum 5 years of IELTS teaching experience",
      "CELTA, DELTA, or equivalent certification preferred",
      "Excellent communication and interpersonal skills",
    ],
    benefits: [
      "Performance-based bonuses",
      "Health insurance",
      "Professional development allowance",
      "20 days paid leave",
    ],
    deadline: "December 15, 2025",
    isUrgent: true,
  },
  {
    id: "job2",
    title: "Spoken English Trainer",
    department: "Academic",
    location: "Gulshan Branch",
    type: "Full-time",
    experience: "3+ years",
    salary: "৳35,000 - ৳50,000/month",
    description: "Join our team as a Spoken English Trainer focusing on improving students' communication skills, pronunciation, and confidence.",
    responsibilities: [
      "Teach spoken English and phonetics courses",
      "Design interactive speaking activities",
      "Conduct one-on-one coaching sessions",
      "Organize speaking clubs and events",
      "Monitor and track student progress",
    ],
    requirements: [
      "Bachelor's degree in English or related field",
      "3+ years teaching spoken English",
      "Native or near-native English proficiency",
      "Strong understanding of phonetics",
      "Energetic and engaging teaching style",
    ],
    benefits: [
      "Flexible working hours",
      "Health insurance",
      "Annual increment",
      "Training opportunities",
    ],
    deadline: "December 20, 2025",
    isUrgent: false,
  },
  {
    id: "job3",
    title: "Kids English Teacher",
    department: "Academic",
    location: "Uttara Branch",
    type: "Full-time",
    experience: "2+ years",
    salary: "৳30,000 - ৳45,000/month",
    description: "Passionate teacher needed for our Kids English program. Must love working with children and have creative teaching approaches.",
    responsibilities: [
      "Teach English to children aged 6-12",
      "Create fun and engaging lesson plans",
      "Manage classroom behavior effectively",
      "Communicate with parents about progress",
      "Organize educational activities and games",
    ],
    requirements: [
      "Bachelor's degree in Education or English",
      "2+ years experience teaching children",
      "Patient, creative, and energetic personality",
      "Understanding of child psychology",
      "Excellent classroom management skills",
    ],
    benefits: [
      "Child-friendly work environment",
      "Training in child education",
      "Health coverage",
      "15 days paid leave",
    ],
    deadline: "December 25, 2025",
    isUrgent: false,
  },
  {
    id: "job4",
    title: "Academic Coordinator",
    department: "Administration",
    location: "Dhanmondi (Main Campus)",
    type: "Full-time",
    experience: "4+ years",
    salary: "৳50,000 - ৳70,000/month",
    description: "Lead our academic team as a coordinator responsible for curriculum development, teacher training, and quality assurance.",
    responsibilities: [
      "Oversee curriculum development and implementation",
      "Conduct teacher training and workshops",
      "Monitor teaching quality and standards",
      "Coordinate class schedules and assignments",
      "Handle student and parent concerns",
    ],
    requirements: [
      "Master's degree in Education or related field",
      "4+ years in educational coordination",
      "Strong leadership and management skills",
      "Experience in curriculum design",
      "Excellent organizational abilities",
    ],
    benefits: [
      "Leadership role with growth potential",
      "Premium health insurance",
      "Professional development budget",
      "25 days paid leave",
    ],
    deadline: "December 10, 2025",
    isUrgent: true,
  },
  {
    id: "job5",
    title: "Content Developer",
    department: "Academic Support",
    location: "Remote/Hybrid",
    type: "Part-time",
    experience: "2+ years",
    salary: "৳25,000 - ৳35,000/month",
    description: "Create engaging educational content for our courses including worksheets, presentations, and digital materials.",
    responsibilities: [
      "Develop course materials and worksheets",
      "Create digital content and presentations",
      "Design practice tests and assessments",
      "Update existing materials with latest trends",
      "Collaborate with teaching team",
    ],
    requirements: [
      "Bachelor's degree in English or Education",
      "2+ years in content development",
      "Proficiency in MS Office and design tools",
      "Strong writing and editing skills",
      "Understanding of educational pedagogy",
    ],
    benefits: [
      "Flexible remote work",
      "Creative freedom",
      "Project-based bonuses",
      "Skill development opportunities",
    ],
    deadline: "December 30, 2025",
    isUrgent: false,
  },
  {
    id: "job6",
    title: "Corporate Training Specialist",
    department: "Corporate",
    location: "Multiple Locations",
    type: "Full-time",
    experience: "3+ years",
    salary: "৳40,000 - ৳60,000/month",
    description: "Deliver corporate English training programs to businesses. Must be comfortable with professional environments and business English.",
    responsibilities: [
      "Conduct corporate training sessions",
      "Customize programs for client needs",
      "Assess corporate learners' proficiency",
      "Develop business English materials",
      "Build relationships with corporate clients",
    ],
    requirements: [
      "Bachelor's degree in relevant field",
      "3+ years corporate training experience",
      "Business English expertise",
      "Professional demeanor",
      "Excellent presentation skills",
    ],
    benefits: [
      "Corporate exposure",
      "Travel allowance",
      "Performance incentives",
      "Health insurance",
    ],
    deadline: "December 18, 2025",
    isUrgent: false,
  },
];

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

// Job Card Component
function JobCard({ job }: { job: JobPosition }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] hover:bg-white/15 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {job.isUrgent && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-400/30 border border-red-300/50 text-red-100">
                🔥 Urgent Hiring
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/30 border border-teal-300/50 text-teal-100">
              {job.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-400/30 border border-purple-300/50 text-purple-100">
              {job.department}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">📍</span>
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">💼</span>
          <span>{job.experience} experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">💰</span>
          <span className="font-semibold">{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <span className="text-teal-300">⏰</span>
          <span>Apply by {job.deadline}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/80 mb-4 leading-relaxed">{job.description}</p>

      {/* Expandable Details */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 mb-2"
        >
          {isExpanded ? '▼' : '▶'} View Full Details
        </button>

        {isExpanded && (
          <div className="space-y-4 pl-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Responsibilities:</h4>
              <ul className="space-y-1">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                    <span className="text-teal-300 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Requirements:</h4>
              <ul className="space-y-1">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                    <span className="text-teal-300 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Benefits:</h4>
              <ul className="space-y-1">
                {job.benefits.map((item, idx) => (
                  <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                    <span className="text-teal-300 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button className="w-full px-4 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
        Apply Now
      </button>
    </div>
  );
}

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const departments = ["all", ...Array.from(new Set(JOB_OPENINGS.map(job => job.department)))];
  const types = ["all", ...Array.from(new Set(JOB_OPENINGS.map(job => job.type)))];

  const filteredJobs = JOB_OPENINGS.filter(job => {
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment;
    const matchesType = selectedType === "all" || job.type === selectedType;
    return matchesDepartment && matchesType;
  });

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
              Join Our Team
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              {COMPANY_INFO.vision}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-teal-300">{JOB_OPENINGS.length}</p>
                <p className="text-sm text-white/80">Open Positions</p>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-teal-300">10+</p>
                <p className="text-sm text-white/80">Team Members</p>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-teal-300">17+</p>
                <p className="text-sm text-white/80">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Why Join Us */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 mb-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Work With Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map((benefit, idx) => (
                <div key={idx} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:scale-105 hover:bg-white/15 transition-all duration-300 text-center">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/80">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 mb-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CORE_VALUES.map((value, idx) => (
                <div key={idx} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-white/80">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Filter by Department</h3>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        selectedDepartment === dept
                          ? 'bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg scale-105'
                          : 'backdrop-blur-md bg-white/10 border border-white/30 text-white hover:bg-white/20'
                      }`}
                    >
                      {dept === "all" ? "All Departments" : dept}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Filter by Type</h3>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg scale-105'
                          : 'backdrop-blur-md bg-white/10 border border-white/30 text-white hover:bg-white/20'
                      }`}
                    >
                      {type === "all" ? "All Types" : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Openings */}
          <div className="mb-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white">Current Openings</h2>
              <p className="text-white/80 text-sm mt-2">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-xl">
                <p className="text-xl text-white/80 mb-4">No positions found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedDepartment("all");
                    setSelectedType("all");
                  }}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300"
                >
                  View All Positions
                </button>
              </div>
            )}
          </div>

          {/* Application Process */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl mb-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How to Apply</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">1</div>
                <h3 className="text-lg font-bold text-white mb-2">Find Position</h3>
                <p className="text-sm text-white/80">Browse through our open positions and find your fit</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">2</div>
                <h3 className="text-lg font-bold text-white mb-2">Submit Application</h3>
                <p className="text-sm text-white/80">Click &quot;Apply Now&quot; and fill out the application form</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">3</div>
                <h3 className="text-lg font-bold text-white mb-2">Interview</h3>
                <p className="text-sm text-white/80">Shortlisted candidates will be contacted for interview</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">4</div>
                <h3 className="text-lg font-bold text-white mb-2">Join Team</h3>
                <p className="text-sm text-white/80">Welcome to Stars English Centre family!</p>
              </div>
            </div>
          </div>

          {/* Contact HR */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-lg font-bold text-white mb-2">Have Questions?</h3>
            <p className="text-white/80 text-sm mb-4">Contact our HR team for more information</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:hr@starsenglish.com"
                className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Email HR
              </a>
              <a
                href="tel:+8801234567890"
                className="px-6 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
              >
                Call HR
              </a>
            </div>
          </div>
 
        </section>
      </div>
    </main>
  );
}