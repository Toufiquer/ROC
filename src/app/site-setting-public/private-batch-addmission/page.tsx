"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
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
  color: string;
};

type AdmissionStep = {
  step: number;
  title: string;
  description: string;
  icon: string;
};

type AdmissionData = {
  companyName: string;
  pageTitle: string;
  pageSubtitle: string;
  admissionStatus: string;
  offers: string[];
  batchTypes: BatchType[];
  courses: Course[];
  admissionSteps: AdmissionStep[];
  requirements: string[];
  paymentMethods: {
    name: string;
    icon: string;
  }[];
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
};

const ADMISSION_DATA: AdmissionData = {
  companyName: "Stars English Centre",
  pageTitle: "Private Batch Admission",
  pageSubtitle: "Secure Your Seat in Our Exclusive Private Care Program",
  admissionStatus: "🔥 ADMISSION IS OPEN - LIMITED SEATS AVAILABLE!",
  offers: [
    "FREE IELTS Registration Support",
    "100% Service Oriented Approach",
    "Small Batch Sizes for Personalized Attention",
    "Expert Teachers with 17+ Years Experience",
    "Flexible Schedule Options",
    "Money Back Guarantee*"
  ],
  batchTypes: [
    {
      id: "regular",
      name: "Regular Batch",
      icon: "📚",
      description: "Perfect for students seeking quality education at affordable prices",
      studentLimit: "10-15 students",
      benefits: [
        "Interactive group learning",
        "Comprehensive study materials",
        "Regular mock tests",
        "Experienced instructors",
        "Weekend batch options"
      ],
      color: "from-blue-400 to-cyan-400"
    },
    {
      id: "executive",
      name: "Executive Batch",
      icon: "⭐",
      description: "Premium experience for professionals and serious learners",
      studentLimit: "6-8 students",
      benefits: [
        "Ultra-small batch size",
        "Personalized attention",
        "Flexible timing options",
        "Extended course duration",
        "One-on-one doubt clearing",
        "Premium study materials",
        "Priority support"
      ],
      color: "from-purple-400 to-pink-400"
    }
  ],
  courses: [
    {
      id: "c1",
      title: "Foundation ENGLISH",
      duration: "2.5 / 3 months",
      regularFee: "6,000/-",
      executiveFee: "10,000/-",
      features: ["Basic to Intermediate", "Grammar Fundamentals", "Speaking Practice", "Writing Skills"]
    },
    {
      id: "c2",
      title: "ADVANCED SPOKEN & PHONETICS",
      duration: "2.5 months",
      regularFee: "6,000/-",
      executiveFee: "10,000/-",
      features: ["Pronunciation Training", "Accent Reduction", "Fluency Development", "Public Speaking"]
    },
    {
      id: "c3",
      title: "Grammar & Freehand WRITING",
      duration: "2.5 months",
      regularFee: "6,000/-",
      executiveFee: "10,000/-",
      features: ["Advanced Grammar", "Essay Writing", "Creative Writing", "Error Correction"]
    },
    {
      id: "c4",
      title: "PTE Academic / UK VI",
      duration: "2.5 months",
      regularFee: "9,000/-",
      executiveFee: "15,000/-",
      features: ["All Modules Covered", "Mock Tests", "Score Strategies", "Expert Guidance"]
    },
    {
      id: "c5",
      title: "IELTS Regular",
      duration: "2.5 months",
      regularFee: "9,000/-",
      executiveFee: "15,000/-",
      features: ["4 Modules Training", "Band 7+ Focused", "Weekly Mock Tests", "Speaking Practice"]
    },
    {
      id: "c6",
      title: "IELTS Executive",
      duration: "3.5 months",
      regularFee: "10,200/-",
      executiveFee: "17,000/-",
      features: ["Comprehensive Prep", "Band 8+ Strategies", "Personal Feedback", "Intensive Training"]
    },
    {
      id: "c7",
      title: "IELTS Crash Course",
      duration: "1.5 months",
      regularFee: "9,300/-",
      executiveFee: "15,500/-",
      features: ["Fast-Track Program", "Intensive Sessions", "Quick Revision", "Test Strategies"]
    },
    {
      id: "c8",
      title: "BASIC TO IELTS",
      duration: "6 months",
      regularFee: "18,000/-",
      executiveFee: "30,000/-",
      features: ["Complete Journey", "Foundation + IELTS", "Beginner Friendly", "Guaranteed Progress"]
    }
  ],
  admissionSteps: [
    {
      step: 1,
      title: "Choose Your Course",
      description: "Select the course and batch type that matches your goals and schedule",
      icon: "📋"
    },
    {
      step: 2,
      title: "Fill Application Form",
      description: "Complete the online admission form with your details and preferences",
      icon: "✍️"
    },
    {
      step: 3,
      title: "Level Assessment",
      description: "Take a quick placement test to determine your current English level",
      icon: "📝"
    },
    {
      step: 4,
      title: "Make Payment",
      description: "Pay the course fee through your preferred payment method",
      icon: "💳"
    },
    {
      step: 5,
      title: "Confirm Your Seat",
      description: "Receive confirmation and batch schedule details via email/SMS",
      icon: "✅"
    }
  ],
  requirements: [
    "Valid National ID / Birth Certificate (for age verification)",
    "1 Copy of Recent Passport Size Photo",
    "Previous English Course Certificate (if any)",
    "Guardian's Contact Number (for students under 18)",
    "Email Address for Communication"
  ],
  paymentMethods: [
    { name: "Cash", icon: "💵" },
    { name: "Bank Transfer", icon: "🏦" },
    { name: "bKash", icon: "📱" },
    { name: "Nagad", icon: "💰" },
    { name: "Rocket", icon: "🚀" },
    { name: "Card Payment", icon: "💳" }
  ],
  benefits: [
    {
      icon: "👨‍🏫",
      title: "Expert Instructors",
      description: "Learn from teachers with 17+ years of experience"
    },
    {
      icon: "📚",
      title: "Complete Materials",
      description: "All study materials and books included in course fee"
    },
    {
      icon: "🎯",
      title: "Result Oriented",
      description: "95% success rate with proven teaching methodology"
    },
    {
      icon: "🔄",
      title: "Flexible Batches",
      description: "Morning, day, evening, and weekend options available"
    },
    {
      icon: "✅",
      title: "FREE IELTS Support",
      description: "Registration guidance and exam preparation included"
    },
    {
      icon: "🏆",
      title: "Certificate",
      description: "Course completion certificate recognized nationwide"
    }
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

export default function AdmissionPage() {
  const data = ADMISSION_DATA;
  const [selectedBatch, setSelectedBatch] = useState<string>("regular");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    batchType: "regular",
    preferredTime: "",
    address: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! Our team will contact you shortly.");
    setShowForm(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      course: "",
      batchType: "regular",
      preferredTime: "",
      address: ""
    });
  };

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
                {/* Admission Status Badge */}
                <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-md rounded-full border-2 border-red-400/50 animate-pulse">
                  <p className="text-white font-bold text-sm md:text-base">
                    {data.admissionStatus}
                  </p>
                </div>

                <div className="text-6xl mb-4">🎓</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {data.pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  {data.pageSubtitle}
                </p>

                {/* Quick Offers */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {data.offers.slice(0, 3).map((offer, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-sm font-semibold"
                    >
                      ✓ {offer}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="px-10 py-5 bg-gradient-to-r from-purple-500/40 to-pink-500/40 hover:from-purple-500/60 hover:to-pink-500/60 text-white font-bold text-lg rounded-full border-2 border-white/50 hover:border-white/70 transition-all duration-300 hover:scale-110 shadow-2xl"
                >
                  🚀 Apply Now - Book Your Seat!
                </button>
              </div>
            </div>

            {/* Batch Types */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Choose Your Batch Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.batchTypes.map((batch) => (
                  <div
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch.id)}
                    className={`backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedBatch === batch.id
                        ? 'bg-white/20 border-white/60 shadow-white/20'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${batch.color} flex items-center justify-center text-4xl border-4 border-white/30`}>
                      {batch.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center mb-2">
                      {batch.name}
                    </h3>
                    <p className="text-center text-white/80 mb-4">{batch.description}</p>
                    <div className="text-center mb-6">
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white font-semibold border border-white/30">
                        👥 {batch.studentLimit}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {batch.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-green-300 mt-1">✓</span>
                          <span className="text-white/90">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Courses */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Available Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.courses.map((course) => (
                  <div
                    key={course.id}
                    className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer group"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 mb-4">
                      <span>⏱️</span>
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Regular:</span>
                        <span className="text-white font-bold text-lg">৳ {course.regularFee}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">Executive:</span>
                        <span className="text-white font-bold text-lg">৳ {course.executiveFee}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/20 pt-4 mb-4">
                      {course.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-white/80 text-sm mb-2">
                          <span className="text-cyan-300">▸</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, course: course.title });
                        setShowForm(true);
                      }}
                      className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300"
                    >
                      Enroll Now →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Admission Process */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Admission Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {data.admissionSteps.map((step, idx) => (
                  <div key={step.step} className="relative">
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-3xl border-2 border-white/30">
                        {step.icon}
                      </div>
                      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-white/80">{step.description}</p>
                    </div>
                    {idx < data.admissionSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Why Choose Stars English Centre?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/80">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Requirements */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>📋</span> Required Documents
                </h3>
                <div className="space-y-4">
                  {data.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-300 mt-1">✓</span>
                      <span className="text-white/90">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>💳</span> Payment Methods
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.paymentMethods.map((method, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-white font-semibold">{method.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                  <p className="text-white/90 text-sm">
                    💡 <strong>Note:</strong> Installment options available for 6-month courses
                  </p>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Don&quot;t miss this opportunity! Limited seats available. Apply now and secure your spot in our next batch.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-10 py-5 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-full border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  📝 Fill Admission Form
                </button>
                <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg">
                  📞 Contact for Details
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <div
            className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Admission Application</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-white/70 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2 font-semibold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Select Course *</label>
                <select
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">Choose a course</option>
                  {data.courses.map((course) => (
                    <option key={course.id} value={course.title} className="bg-gray-800">
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Batch Type *</label>
                <select
                  name="batchType"
                  required
                  value={formData.batchType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="regular" className="bg-gray-800">Regular Batch</option>
                  <option value="executive" className="bg-gray-800">Executive Batch</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Preferred Time</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">Select time slot</option>
                  <option value="morning" className="bg-gray-800">Morning (8:00 AM - 11:00 AM)</option>
                  <option value="day" className="bg-gray-800">Day (11:00 AM - 2:00 PM)</option>
                  <option value="evening" className="bg-gray-800">Evening (5:00 PM - 8:00 PM)</option>
                  <option value="weekend" className="bg-gray-800">Weekend (Friday-Saturday)</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter your address"
                />
              </div>

              <div className="p-4 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                <p className="text-white/90 text-sm">
                  📌 <strong>Note:</strong> After submitting, our team will contact you within 24 hours to complete the admission process and schedule your placement test.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 hover:from-purple-500/60 hover:to-pink-500/60 text-white font-bold rounded-xl border-2 border-white/50 hover:border-white/70 transition-all duration-300 hover:scale-105"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}