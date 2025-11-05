"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  name: string;
  icon: string;
  color: string;
};

type FAQData = {
  companyName: string;
  pageTitle: string;
  pageDescription: string;
  categories: FAQCategory[];
  faqs: FAQItem[];
  contactInfo: {
    title: string;
    description: string;
    cta: string;
  };
};

const FAQ_DATA: FAQData = {
  companyName: "Stars English Centre",
  pageTitle: "Frequently Asked Questions",
  pageDescription: "Find answers to common questions about our courses, registration process, schedules, and more. Can't find what you're looking for? Contact us directly!",
  categories: [
    { name: "All", icon: "📚", color: "from-purple-400 to-pink-400" },
    { name: "General", icon: "ℹ️", color: "from-blue-400 to-cyan-400" },
    { name: "Courses", icon: "🎓", color: "from-green-400 to-emerald-400" },
    { name: "IELTS", icon: "✍️", color: "from-orange-400 to-red-400" },
    { name: "Payment", icon: "💳", color: "from-yellow-400 to-orange-400" },
    { name: "Schedule", icon: "📅", color: "from-indigo-400 to-purple-400" },
  ],
  faqs: [
    {
      id: "faq1",
      category: "General",
      question: "What is Stars English Centre?",
      answer: "Stars English Centre is a premium English language training institute offering private care programs for all courses including IELTS, PTE, Spoken English, Grammar, and specialized courses for Kids and Juniors. We also provide corporate training with over 10+ professional teachers having 17+ years of combined experience."
    },
    {
      id: "faq2",
      category: "General",
      question: "Where is Stars English Centre located?",
      answer: "Our centre is conveniently located in Dhaka. Please contact us for the exact address and directions. We offer both in-person and online classes to accommodate all students."
    },
    {
      id: "faq3",
      category: "General",
      question: "What is the class size?",
      answer: "We maintain small batch sizes to ensure personalized attention. Our regular batches have 10-15 students, while executive batches are even smaller with 6-8 students for more focused learning."
    },
    {
      id: "faq4",
      category: "Courses",
      question: "What courses do you offer?",
      answer: "We offer Foundation English, Advanced Spoken & Phonetics, Grammar & Writing, IELTS (Regular, Executive, Crash Course), PTE Academic, BASIC TO IELTS, Kids' English, and Juniors' English. We also provide specialized corporate training programs."
    },
    {
      id: "faq5",
      category: "Courses",
      question: "How long are the courses?",
      answer: "Course duration varies: Most regular courses are 2.5-3 months, Executive courses run for 3.5 months, Crash courses are 1.5 months, BASIC TO IELTS is 6 months, and Kids/Juniors programs run for 12 months with monthly fees."
    },
    {
      id: "faq6",
      category: "Courses",
      question: "What's the difference between Regular and Executive batches?",
      answer: "Executive batches have smaller class sizes (6-8 students vs 10-15), more personalized attention, flexible timings suitable for working professionals, and extended course duration for in-depth learning. Regular batches are more economical while maintaining high quality."
    },
    {
      id: "faq7",
      category: "Courses",
      question: "Do you offer online classes?",
      answer: "Yes! We offer both online and offline classes for most of our courses. Our online classes are conducted via interactive platforms with live sessions, recorded materials, and personalized feedback."
    },
    {
      id: "faq8",
      category: "IELTS",
      question: "Is IELTS registration really free?",
      answer: "Yes! We provide FREE IELTS registration guidance and support to all our IELTS students. This includes help with the registration process, choosing test dates, and understanding the exam format."
    },
    {
      id: "faq9",
      category: "IELTS",
      question: "What IELTS band score can I expect?",
      answer: "With dedicated effort and regular attendance, most of our students achieve their target band scores. We have a proven track record with many students scoring 7.0-8.5+ bands. Individual results depend on your starting level and commitment."
    },
    {
      id: "faq10",
      category: "IELTS",
      question: "Which IELTS course should I choose?",
      answer: "Choose IELTS Regular (2.5 months) if you have basic English knowledge, IELTS Executive (3.5 months) for more comprehensive preparation, IELTS Crash Course (1.5 months) if you have good English and need quick preparation, or BASIC TO IELTS (6 months) if you're starting from beginner level."
    },
    {
      id: "faq11",
      category: "IELTS",
      question: "Do you provide IELTS practice tests?",
      answer: "Absolutely! We provide regular mock tests simulating actual IELTS exam conditions, detailed performance analysis, individual feedback from experienced instructors, and practice materials for all four modules (Listening, Reading, Writing, Speaking)."
    },
    {
      id: "faq12",
      category: "Payment",
      question: "What are the course fees?",
      answer: "Fees vary by course: Foundation/Spoken/Grammar: BDT 6,000 (Regular) / 10,000 (Executive), IELTS Regular: 9,000, IELTS Executive: 10,200, IELTS Crash: 9,300, PTE: 9,000, BASIC TO IELTS: 18,000, Kids/Juniors: 4,200 admission + 2,400/month. All prices are in BDT."
    },
    {
      id: "faq13",
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept cash payments at our centre, bank transfers, mobile banking (bKash, Nagad, Rocket), and online payments. Installment options are available for longer courses like BASIC TO IELTS and Kids/Juniors programs."
    },
    {
      id: "faq14",
      category: "Payment",
      question: "Is there any discount available?",
      answer: "Yes! We offer early bird discounts for advance registration, sibling discounts for multiple enrollments from the same family, group discounts for corporate training, and special offers during admission seasons. Contact us for current promotions."
    },
    {
      id: "faq15",
      category: "Payment",
      question: "What is your refund policy?",
      answer: "Refunds are available within the first week of course commencement with a deduction of administrative charges. After the first week, fees are non-refundable but can be transferred to future batches subject to conditions."
    },
    {
      id: "faq16",
      category: "Schedule",
      question: "What are the class timings?",
      answer: "We offer flexible timings: Morning batches (8:00 AM - 11:00 AM), Day batches (11:00 AM - 2:00 PM), Evening batches (5:00 PM - 8:00 PM), and Weekend batches (Friday-Saturday). Executive batches have additional flexible timing options."
    },
    {
      id: "faq17",
      category: "Schedule",
      question: "How many classes per week?",
      answer: "Regular courses: 4-5 classes per week (2-3 hours per class). Executive courses: 3-4 classes per week with extended sessions. Kids/Juniors: 2-3 classes per week. Crash courses: 6 intensive classes per week."
    },
    {
      id: "faq18",
      category: "Schedule",
      question: "When do new batches start?",
      answer: "New batches start every month for most courses. IELTS and popular courses have batches starting twice a month. Contact us for the exact start date of the next batch for your desired course."
    },
    {
      id: "faq19",
      category: "Schedule",
      question: "Can I join in the middle of a course?",
      answer: "Yes, if you have prior knowledge relevant to the course level. We'll assess your skills and provide catch-up materials for classes you've missed. However, we recommend joining from the beginning for optimal learning."
    },
    {
      id: "faq20",
      category: "General",
      question: "Do you provide study materials?",
      answer: "Yes! All course fees include comprehensive study materials, practice books, online resources, recorded lectures, handouts, and worksheets. You'll receive both printed and digital materials."
    },
    {
      id: "faq21",
      category: "General",
      question: "Will I get a certificate?",
      answer: "Yes, upon successful completion of your course, you'll receive a certificate from Stars English Centre. For IELTS/PTE courses, we also help you register for the official exam to get your internationally recognized certification."
    },
    {
      id: "faq22",
      category: "Courses",
      question: "What age group is Kids' and Juniors' English for?",
      answer: "Kids' English is designed for children aged 6-10 years, while Juniors' English is for ages 11-15 years. Both programs are structured age-appropriately with engaging, interactive methods."
    },
    {
      id: "faq23",
      category: "General",
      question: "Can I get a trial class?",
      answer: "Yes! We offer FREE trial classes for prospective students. This allows you to experience our teaching methodology, meet the instructors, and see our facilities before enrolling. Contact us to book your trial class."
    },
    {
      id: "faq24",
      category: "General",
      question: "Do you offer corporate training?",
      answer: "Yes! We provide customized corporate training programs for organizations. Our packages are tailored to business communication needs, professional English, presentation skills, and industry-specific language training. Contact us for corporate packages."
    },
  ],
  contactInfo: {
    title: "Still Have Questions?",
    description: "Can't find the answer you're looking for? Our team is here to help you with any queries you may have.",
    cta: "Contact Us Now"
  }
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

export default function FAQPage() {
  const data = FAQ_DATA;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleFAQ = (id: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const filteredFAQs = data.faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            {/* Glassmorphism Header Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-12">
              <div className="text-center">
                <div className="text-6xl mb-4">❓</div>
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
                      placeholder="Search for answers..."
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

            {/* Category Filter */}
            <div className="mb-12">
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
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 mb-16">
              {filteredFAQs.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                  <div className="text-6xl mb-4">🤔</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                  <p className="text-white/80">Try adjusting your search or filter</p>
                </div>
              ) : (
                filteredFAQs.map((faq) => {
                  const isOpen = openFAQs.has(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:bg-white/15 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 border border-white/30">
                              {faq.category}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-cyan-200 transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                        <div
                          className={`text-2xl text-white/80 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </div>
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-5 pt-2 border-t border-white/10">
                          <p className="text-white/90 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Contact CTA */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-center">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {data.contactInfo.title}
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                {data.contactInfo.description}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-105 shadow-lg">
                  {data.contactInfo.cta}
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg">
                  📞 Call Us
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg">
                  📧 Email Us
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-xl font-bold text-white mb-2">View Courses</h3>
                <p className="text-white/80 text-sm mb-4">Explore our comprehensive course offerings</p>
                <button className="text-cyan-300 hover:text-cyan-200 font-semibold">
                  Learn More →
                </button>
              </div>
              
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3">👨‍🏫</div>
                <h3 className="text-xl font-bold text-white mb-2">Meet Our Team</h3>
                <p className="text-white/80 text-sm mb-4">Get to know our expert instructors</p>
                <button className="text-cyan-300 hover:text-cyan-200 font-semibold">
                  View Team →
                </button>
              </div>
              
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Book a Trial</h3>
                <p className="text-white/80 text-sm mb-4">Experience our teaching methodology</p>
                <button className="text-cyan-300 hover:text-cyan-200 font-semibold">
                  Book Now →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}