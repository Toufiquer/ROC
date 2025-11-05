"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type ContactInfo = {
  icon: string;
  title: string;
  value: string;
  link?: string;
};

type SocialMedia = {
  name: string;
  icon: string;
  url: string;
  color: string;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLink: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const COMPANY_INFO = {
  name: "Stars English Centre",
  tagline: "Private care program for all courses and corporate Training.",
  mainPhone: "+880 1234-567890",
  mainEmail: "info@starsenglish.com",
  whatsapp: "+880 1234-567890",
};

const CONTACT_METHODS: ContactInfo[] = [
  {
    icon: "📞",
    title: "Call Us",
    value: "+880 1234-567890",
    link: "tel:+8801234567890"
  },
  {
    icon: "📧",
    title: "Email Us",
    value: "info@starsenglish.com",
    link: "mailto:info@starsenglish.com"
  },
  {
    icon: "💬",
    title: "WhatsApp",
    value: "+880 1234-567890",
    link: "https://wa.me/8801234567890"
  },
  {
    icon: "🕐",
    title: "Working Hours",
    value: "Sat-Thu: 9AM-8PM",
  },
];

const SOCIAL_MEDIA: SocialMedia[] = [
  {
    name: "Facebook",
    icon: "f",
    url: "https://facebook.com/starsenglish",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Instagram",
    icon: "📷",
    url: "https://instagram.com/starsenglish",
    color: "from-pink-500 to-purple-600"
  },
  {
    name: "LinkedIn",
    icon: "in",
    url: "https://linkedin.com/company/starsenglish",
    color: "from-blue-600 to-blue-700"
  },
  {
    name: "YouTube",
    icon: "▶",
    url: "https://youtube.com/starsenglish",
    color: "from-red-500 to-red-600"
  },
];

const BRANCHES: Branch[] = [
  {
    id: "b1",
    name: "Main Campus",
    address: "House 123, Road 4, Dhanmondi, Dhaka 1209",
    phone: "+880 1234-567890",
    email: "main@starsenglish.com",
    hours: "Sat-Thu: 9:00 AM - 8:00 PM",
    mapLink: "https://maps.google.com"
  },
  {
    id: "b2",
    name: "Gulshan Branch",
    address: "Plot 45, Road 11, Gulshan-1, Dhaka 1212",
    phone: "+880 1234-567891",
    email: "gulshan@starsenglish.com",
    hours: "Sat-Thu: 10:00 AM - 7:00 PM",
    mapLink: "https://maps.google.com"
  },
  {
    id: "b3",
    name: "Uttara Branch",
    address: "House 67, Road 8, Sector 4, Uttara, Dhaka 1230",
    phone: "+880 1234-567892",
    email: "uttara@starsenglish.com",
    hours: "Sat-Thu: 9:00 AM - 7:00 PM",
    mapLink: "https://maps.google.com"
  },
];

const FAQS: FAQ[] = [
  {
    id: "faq1",
    question: "What are your class timings?",
    answer: "We offer flexible timings including morning (9 AM - 12 PM), afternoon (2 PM - 5 PM), and evening batches (6 PM - 9 PM). Weekend batches are also available."
  },
  {
    id: "faq2",
    question: "Do you provide online classes?",
    answer: "Yes! We offer both online and offline classes. Our online classes are conducted via Zoom with full interactive features and recorded sessions for revision."
  },
  {
    id: "faq3",
    question: "What is your refund policy?",
    answer: "We offer a full refund if you withdraw within the first week of enrollment. After that, refunds are calculated on a pro-rata basis minus registration fees."
  },
  {
    id: "faq4",
    question: "How can I enroll in a course?",
    answer: "You can enroll by visiting any of our branches, calling us, or filling out the online registration form. Our counselors will guide you through the process."
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

// FAQ Item Component
function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-white font-semibold pr-4">{faq.question}</span>
        <span className="text-teal-300 text-xl shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <p className="text-white/80 text-sm mt-3 leading-relaxed">
          {faq.answer}
        </p>
      )}
    </div>
  );
}

// Branch Card Component
function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-4">{branch.name}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-teal-300 text-lg shrink-0">📍</span>
          <p className="text-sm text-white/90">{branch.address}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-teal-300 text-lg">📞</span>
          <a href={`tel:${branch.phone}`} className="text-sm text-white/90 hover:text-white transition-colors">
            {branch.phone}
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-teal-300 text-lg">📧</span>
          <a href={`mailto:${branch.email}`} className="text-sm text-white/90 hover:text-white transition-colors">
            {branch.email}
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-teal-300 text-lg">🕐</span>
          <p className="text-sm text-white/90">{branch.hours}</p>
        </div>
      </div>

      <a
        href={branch.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        View on Map
      </a>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Have questions? We&quot;d love to hear from you. Send us a message and we&quot;ll respond as soon as possible.
            </p>
          </div>

          {/* Quick Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {CONTACT_METHODS.map((method, idx) => (
              <div
                key={idx}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3">{method.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                {method.link ? (
                  <a
                    href={method.link}
                    className="text-sm text-teal-300 hover:text-teal-200 transition-colors break-words"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-sm text-white/80">{method.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Contact Form */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+880 1234-567890"
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
                  >
                    <option value="" className="bg-gray-800">Select a subject</option>
                    <option value="course-inquiry" className="bg-gray-800">Course Inquiry</option>
                    <option value="admission" className="bg-gray-800">Admission Process</option>
                    <option value="fees" className="bg-gray-800">Fees & Payment</option>
                    <option value="schedule" className="bg-gray-800">Class Schedule</option>
                    <option value="other" className="bg-gray-800">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column - Info & Social */}
            <div className="space-y-8">
              {/* Map or Image Placeholder */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Visit Us</h2>
                <div className="aspect-video bg-gradient-to-br from-teal-400/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <p className="text-white/60 text-center">🗺️<br/>Map View</p>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Our main campus is conveniently located in Dhanmondi, with easy access to public transportation. 
                  We also have branches in Gulshan and Uttara for your convenience.
                </p>
              </div>

              {/* Social Media */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Connect With Us</h2>
                <div className="grid grid-cols-2 gap-4">
                  {SOCIAL_MEDIA.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 hover:scale-105 transition-all duration-300 flex flex-col items-center gap-2 group`}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${social.color} flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all`}>
                        {social.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Branches Section */}
          <div className="mb-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white">Our Branches</h2>
              <p className="text-white/80 text-sm mt-2">Visit any of our convenient locations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BRANCHES.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl mb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <FAQItem key={faq.id} faq={faq} />
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-lg font-bold text-white mb-2">Need Immediate Assistance?</h3>
            <p className="text-white/80 text-sm mb-4">Our support team is available during working hours</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${COMPANY_INFO.mainPhone}`}
                className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Call Now
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                className="px-6 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
 
        </section>
      </div>
    </main>
  );
}