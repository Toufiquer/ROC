"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type MockTest = {
  id: string;
  title: string;
  testType: string;
  duration: string;
  sections: string[];
  difficulty: string;
  description: string;
  features: string[];
  price: string;
  isFree: boolean;
  availableSlots: number;
  nextDate: string;
  icon: string;
};

type TestFeature = {
  icon: string;
  title: string;
  description: string;
};

type Testimonial = {
  id: string;
  name: string;
  score: string;
  image: string;
  text: string;
  course: string;
};

type MockTestData = {
  companyName: string;
  pageTitle: string;
  pageSubtitle: string;
  heroDescription: string;
  mockTests: MockTest[];
  features: TestFeature[];
  benefits: string[];
  testimonials: Testimonial[];
  mockTestProcess: {
    step: number;
    title: string;
    description: string;
    icon: string;
  }[];
  statistics: {
    label: string;
    value: string;
    icon: string;
  }[];
};

const MOCK_TEST_DATA: MockTestData = {
  companyName: "Stars English Centre",
  pageTitle: "Real Mock Test Experience",
  pageSubtitle: "Practice Under Actual Exam Conditions",
  heroDescription: "Experience authentic IELTS, PTE, and English proficiency tests in a real exam environment. Get detailed feedback, band predictions, and performance analysis from expert examiners.",
  mockTests: [
    {
      id: "ielts-full",
      title: "IELTS Full Mock Test",
      testType: "IELTS Academic/General",
      duration: "2 hours 45 minutes",
      sections: ["Listening (30 min)", "Reading (60 min)", "Writing (60 min)", "Speaking (11-14 min)"],
      difficulty: "All Levels",
      description: "Complete IELTS mock test simulating actual exam conditions with all four modules. Get band score prediction and detailed feedback.",
      features: [
        "Authentic test materials",
        "Real exam timing",
        "Band score prediction",
        "Section-wise analysis",
        "Speaking with examiner",
        "Written feedback report"
      ],
      price: "1,500/-",
      isFree: false,
      availableSlots: 12,
      nextDate: "Every Saturday & Sunday",
      icon: "📝"
    },
    {
      id: "ielts-speaking",
      title: "IELTS Speaking Mock",
      testType: "IELTS Speaking Only",
      duration: "11-14 minutes",
      sections: ["Part 1 (4-5 min)", "Part 2 (3-4 min)", "Part 3 (4-5 min)"],
      difficulty: "All Levels",
      description: "One-on-one speaking test with experienced examiner. Record and review your performance with detailed feedback.",
      features: [
        "Face-to-face with examiner",
        "Video recording available",
        "Band prediction",
        "Pronunciation feedback",
        "Fluency analysis",
        "Vocabulary suggestions"
      ],
      price: "500/-",
      isFree: false,
      availableSlots: 20,
      nextDate: "Daily slots available",
      icon: "🎤"
    },
    {
      id: "ielts-writing",
      title: "IELTS Writing Mock",
      testType: "IELTS Writing Only",
      duration: "60 minutes",
      sections: ["Task 1 (20 min)", "Task 2 (40 min)"],
      difficulty: "All Levels",
      description: "Practice both writing tasks with expert evaluation. Get detailed feedback on grammar, vocabulary, coherence, and task achievement.",
      features: [
        "Both tasks evaluated",
        "Band score for each task",
        "Grammar corrections",
        "Vocabulary enhancement tips",
        "Structure suggestions",
        "Model answers provided"
      ],
      price: "700/-",
      isFree: false,
      availableSlots: 30,
      nextDate: "Submit anytime",
      icon: "✍️"
    },
    {
      id: "pte-full",
      title: "PTE Academic Full Test",
      testType: "PTE Academic",
      duration: "2 hours",
      sections: ["Speaking & Writing (77-93 min)", "Reading (32-41 min)", "Listening (45-57 min)"],
      difficulty: "All Levels",
      description: "Complete PTE Academic mock test on computer with AI-based scoring simulation and detailed performance report.",
      features: [
        "Computer-based test",
        "AI scoring simulation",
        "All question types",
        "Score prediction",
        "Skills breakdown",
        "Improvement suggestions"
      ],
      price: "1,200/-",
      isFree: false,
      availableSlots: 8,
      nextDate: "Monday to Friday",
      icon: "💻"
    },
    {
      id: "free-diagnostic",
      title: "FREE Diagnostic Test",
      testType: "English Level Assessment",
      duration: "45 minutes",
      sections: ["Grammar (15 min)", "Vocabulary (10 min)", "Reading (10 min)", "Listening (10 min)"],
      difficulty: "All Levels",
      description: "Free comprehensive test to assess your current English level. Get recommendations for suitable courses.",
      features: [
        "Completely FREE",
        "Level assessment",
        "Strengths & weaknesses",
        "Course recommendations",
        "Study plan suggestions",
        "One-on-one counseling"
      ],
      price: "FREE",
      isFree: true,
      availableSlots: 50,
      nextDate: "Book anytime",
      icon: "🎯"
    },
    {
      id: "grammar-test",
      title: "Grammar Proficiency Test",
      testType: "Grammar Assessment",
      duration: "30 minutes",
      sections: ["Tenses", "Articles", "Prepositions", "Sentence Structure"],
      difficulty: "Intermediate to Advanced",
      description: "Comprehensive grammar test covering all major grammar topics with detailed explanations for each answer.",
      features: [
        "50+ questions",
        "Instant results",
        "Topic-wise scoring",
        "Answer explanations",
        "Grammar tips",
        "Resource recommendations"
      ],
      price: "300/-",
      isFree: false,
      availableSlots: 40,
      nextDate: "Online - Anytime",
      icon: "📖"
    },
    {
      id: "vocabulary-test",
      title: "Vocabulary Power Test",
      testType: "Vocabulary Assessment",
      duration: "25 minutes",
      sections: ["Academic Words", "Idioms", "Collocations", "Phrasal Verbs"],
      difficulty: "All Levels",
      description: "Test your vocabulary knowledge with words from academic and everyday contexts. Get personalized vocabulary learning plan.",
      features: [
        "Level-appropriate words",
        "Context-based questions",
        "Score with percentile",
        "Word lists for practice",
        "Memory techniques",
        "Personalized plan"
      ],
      price: "300/-",
      isFree: false,
      availableSlots: 40,
      nextDate: "Online - Anytime",
      icon: "📚"
    },
    {
      id: "spoken-assessment",
      title: "Spoken English Assessment",
      testType: "Speaking Proficiency",
      duration: "15 minutes",
      sections: ["Introduction", "Topic Discussion", "Pronunciation Check", "Q&A"],
      difficulty: "All Levels",
      description: "Evaluate your speaking skills including fluency, pronunciation, vocabulary usage, and confidence level.",
      features: [
        "Live assessment",
        "Pronunciation analysis",
        "Fluency evaluation",
        "Confidence rating",
        "Improvement areas",
        "Practice exercises"
      ],
      price: "400/-",
      isFree: false,
      availableSlots: 15,
      nextDate: "Weekdays - Call to book",
      icon: "🗣️"
    }
  ],
  features: [
    {
      icon: "🎯",
      title: "Real Exam Simulation",
      description: "Experience actual test conditions with authentic materials and strict timing protocols"
    },
    {
      icon: "👨‍🏫",
      title: "Expert Evaluation",
      description: "Tests evaluated by certified examiners with years of experience"
    },
    {
      icon: "📊",
      title: "Detailed Analytics",
      description: "Comprehensive performance analysis with strengths and weaknesses breakdown"
    },
    {
      icon: "🔄",
      title: "Unlimited Retakes",
      description: "Take mock tests as many times as needed to track your improvement"
    },
    {
      icon: "📱",
      title: "Online & Offline",
      description: "Choose between computer-based or paper-based format based on your preference"
    },
    {
      icon: "⏱️",
      title: "Flexible Scheduling",
      description: "Book your preferred date and time slot according to your convenience"
    }
  ],
  benefits: [
    "Familiarize with actual exam format and question types",
    "Improve time management and test-taking strategies",
    "Identify weak areas and focus your preparation",
    "Reduce exam anxiety through practice",
    "Track your progress with multiple attempts",
    "Get expert tips and recommendations",
    "Predict your expected band/score before actual exam",
    "Receive detailed feedback for improvement"
  ],
  testimonials: [
    {
      id: "t1",
      name: "Sarah Ahmed",
      score: "Band 8.0",
      image: "👩‍🎓",
      text: "The mock tests helped me understand my weaknesses. The feedback was incredibly detailed and helped me improve from 6.5 to 8.0 in just 2 months!",
      course: "IELTS Academic"
    },
    {
      id: "t2",
      name: "Rahul Kumar",
      score: "Band 7.5",
      image: "👨‍💼",
      text: "Real exam conditions! The speaking mock test with the examiner was exactly like the actual IELTS. It boosted my confidence significantly.",
      course: "IELTS General"
    },
    {
      id: "t3",
      name: "Priya Das",
      score: "PTE 79/90",
      image: "👩‍💻",
      text: "The PTE mock test software was amazing. The AI scoring was accurate and helped me practice until I achieved my target score.",
      course: "PTE Academic"
    },
    {
      id: "t4",
      name: "Mehedi Hassan",
      score: "Band 8.5",
      image: "👨‍🎓",
      text: "I took 5 full mock tests before my exam. Each time, the detailed feedback helped me improve. Highly recommend!",
      course: "IELTS Executive"
    }
  ],
  mockTestProcess: [
    {
      step: 1,
      title: "Choose Your Test",
      description: "Select the mock test type based on your target exam and preparation needs",
      icon: "📋"
    },
    {
      step: 2,
      title: "Book Your Slot",
      description: "Choose your preferred date and time. Make payment to confirm booking",
      icon: "📅"
    },
    {
      step: 3,
      title: "Receive Instructions",
      description: "Get detailed instructions via email/SMS about test venue or online access",
      icon: "📧"
    },
    {
      step: 4,
      title: "Take the Test",
      description: "Appear for the mock test under supervised conditions with strict timing",
      icon: "✍️"
    },
    {
      step: 5,
      title: "Get Your Results",
      description: "Receive comprehensive feedback report within 3-5 working days",
      icon: "📊"
    }
  ],
  statistics: [
    { label: "Tests Conducted", value: "5000+", icon: "📝" },
    { label: "Success Rate", value: "95%", icon: "🎯" },
    { label: "Average Improvement", value: "1.5 Bands", icon: "📈" },
    { label: "Expert Examiners", value: "15+", icon: "👨‍🏫" }
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

export default function MockTestPage() {
  const data = MOCK_TEST_DATA;
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("All");

  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    testId: "",
    preferredDate: "",
    preferredTime: "",
    testFormat: "offline"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = (test: MockTest) => {
    setSelectedTest(test);
    setBookingData({ ...bookingData, testId: test.id });
    setShowBooking(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking confirmed for ${selectedTest?.title}! We'll contact you shortly with further details.`);
    setShowBooking(false);
    setBookingData({
      fullName: "",
      email: "",
      phone: "",
      testId: "",
      preferredDate: "",
      preferredTime: "",
      testFormat: "offline"
    });
  };

  const testTypes = ["All", "IELTS", "PTE", "Assessment", "FREE"];
  const filteredTests = data.mockTests.filter(test => {
    if (filterType === "All") return true;
    if (filterType === "FREE") return test.isFree;
    return test.testType.includes(filterType);
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
                <div className="text-6xl mb-4">🎯</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {data.pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
                  {data.pageSubtitle}
                </p>
                <p className="text-base md:text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
                  {data.heroDescription}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
              {data.statistics.map((stat, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center"
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

            {/* Features Grid */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Why Take Mock Tests?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {testTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-6 py-3 rounded-full backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 ${
                      filterType === type
                        ? 'bg-white/30 border-white/60 shadow-xl'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-white font-semibold">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Tests Grid */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Available Mock Tests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className={`backdrop-blur-xl rounded-2xl p-6 border shadow-xl transition-all duration-300 hover:scale-105 ${
                      test.isFree
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/40'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    {/* Free Badge */}
                    {test.isFree && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/80 rounded-full text-white text-xs font-bold">
                        FREE
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-4xl border-2 border-white/30">
                      {test.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white text-center mb-2">
                      {test.title}
                    </h3>

                    {/* Test Type */}
                    <div className="text-center mb-4">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30">
                        {test.testType}
                      </span>
                    </div>

                    {/* Duration & Difficulty */}
                    <div className="flex items-center justify-between mb-4 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        ⏱️ {test.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        📊 {test.difficulty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/80 mb-4 line-clamp-3">
                      {test.description}
                    </p>

                    {/* Sections */}
                    <div className="mb-4">
                      <h4 className="text-white font-semibold text-sm mb-2">Sections:</h4>
                      <div className="space-y-1">
                        {test.sections.slice(0, 3).map((section, idx) => (
                          <div key={idx} className="text-xs text-white/70 flex items-center gap-2">
                            <span className="text-cyan-300">▸</span>
                            <span>{section}</span>
                          </div>
                        ))}
                        {test.sections.length > 3 && (
                          <div className="text-xs text-white/70">
                            +{test.sections.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4 border-t border-white/20 pt-4">
                      <div className="space-y-2">
                        {test.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-white/80">
                            <span className="text-green-300">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-4 p-3 bg-white/10 rounded-lg">
                      <div className="flex justify-between items-center text-xs text-white/80 mb-2">
                        <span>Available Slots:</span>
                        <span className="font-bold text-white">{test.availableSlots}</span>
                      </div>
                      <div className="text-xs text-white/70">
                        📅 {test.nextDate}
                      </div>
                    </div>

                    {/* Price & Book Button */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-2xl font-bold text-white">
                        {test.isFree ? (
                          <span className="text-green-300">FREE</span>
                        ) : (
                          <span>৳ {test.price}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleBooking(test)}
                        className={`px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          test.isFree
                            ? 'bg-green-500/40 hover:bg-green-500/60 border-green-400/50 text-white'
                            : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
                        }`}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Test Process */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {data.mockTestProcess.map((step, idx) => (
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
                    {idx < data.mockTestProcess.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Key Benefits
              </h2>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-300 mt-1 text-xl">✓</span>
                      <span className="text-white/90">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center text-3xl border-2 border-white/30 flex-shrink-0">
                        {testimonial.image}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                        <div className="text-yellow-300 font-semibold">{testimonial.score}</div>
                        <div className="text-xs text-white/70">{testimonial.course}</div>
                      </div>
                    </div>
                    <p className="text-white/80 italic">&quot;{testimonial.text}&quot;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Test Your Skills?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Book your mock test today and get detailed feedback from our expert examiners. Track your progress and achieve your target score!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    const freeTest = data.mockTests.find(t => t.isFree);
                    if (freeTest) handleBooking(freeTest);
                  }}
                  className="px-10 py-5 bg-green-500/40 hover:bg-green-500/60 text-white font-bold text-lg rounded-full border-2 border-green-400/50 hover:border-green-400/70 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  📝 Take FREE Test
                </button>
                <button className="px-10 py-5 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-full border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-105 shadow-lg">
                  📞 Call for Details
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowBooking(false)}
        >
          <div
            className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Book Mock Test</h2>
                <p className="text-white/70 text-sm mt-1">{selectedTest.title}</p>
              </div>
              <button
                onClick={() => setShowBooking(false)}
                className="text-white/70 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            {/* Test Details Summary */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/70">Duration:</span>
                  <div className="text-white font-semibold">{selectedTest.duration}</div>
                </div>
                <div>
                  <span className="text-white/70">Price:</span>
                  <div className="text-white font-semibold">
                    {selectedTest.isFree ? "FREE" : `৳ ${selectedTest.price}`}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">Available Slots:</span>
                  <div className="text-white font-semibold">{selectedTest.availableSlots}</div>
                </div>
                <div>
                  <span className="text-white/70">Next Available:</span>
                  <div className="text-white font-semibold">{selectedTest.nextDate}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2 font-semibold">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={bookingData.fullName}
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
                    value={bookingData.email}
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
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={bookingData.preferredDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Preferred Time *</label>
                  <select
                    name="preferredTime"
                    required
                    value={bookingData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Select time</option>
                    <option value="morning" className="bg-gray-800">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="afternoon" className="bg-gray-800">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="evening" className="bg-gray-800">Evening (6:00 PM - 9:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Test Format *</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="radio"
                      name="testFormat"
                      value="offline"
                      checked={bookingData.testFormat === "offline"}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-white font-semibold">🏢 Offline (Centre)</span>
                  </label>
                  <label className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="radio"
                      name="testFormat"
                      value="online"
                      checked={bookingData.testFormat === "online"}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-white font-semibold">💻 Online</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                <p className="text-white/90 text-sm">
                  📌 <strong>Note:</strong> You will receive confirmation email with detailed instructions within 24 hours. {!selectedTest.isFree && "Payment can be made at the centre or online."}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 hover:from-purple-500/60 hover:to-pink-500/60 text-white font-bold rounded-xl border-2 border-white/50 hover:border-white/70 transition-all duration-300 hover:scale-105"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
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