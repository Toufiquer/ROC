"use client"
import React, { useEffect, useRef, useState } from "react";

// ---------------------------
// Static data
// ---------------------------

type SuccessStory = {
  id: string;
  name: string;
  age: number;
  course: string;
  achievement: string;
  previousScore?: string;
  currentScore: string;
  duration: string;
  image?: string;
  story: string;
  testimonial: string;
  category: string;
  destination?: string;
  university?: string;
  isFeatured: boolean;
};

type Statistic = {
  icon: string;
  value: string;
  label: string;
  color: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

const COMPANY_INFO = {
  name: "Stars English Centre",
  tagline: "Transforming dreams into achievements",
};

const STATISTICS: Statistic[] = [
  {
    icon: "🎓",
    value: "500+",
    label: "Students Trained",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: "🌟",
    value: "95%",
    label: "Success Rate",
    color: "from-green-400 to-green-600"
  },
  {
    icon: "✈️",
    value: "200+",
    label: "Studying Abroad",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: "🏆",
    value: "Band 8+",
    label: "Average IELTS Score",
    color: "from-yellow-400 to-yellow-600"
  },
];

const CATEGORIES: Category[] = [
  { id: "all", name: "All Stories", icon: "📚" },
  { id: "ielts", name: "IELTS Success", icon: "🎯" },
  { id: "study-abroad", name: "Study Abroad", icon: "✈️" },
  { id: "career", name: "Career Growth", icon: "💼" },
  { id: "kids", name: "Kids Achievement", icon: "👶" },
];

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "s1",
    name: "Aisha Rahman",
    age: 24,
    course: "IELTS Executive",
    achievement: "IELTS Band 8.5",
    previousScore: "Band 6.0",
    currentScore: "Band 8.5 (L: 9.0, R: 8.5, W: 8.0, S: 8.5)",
    duration: "3.5 months",
    story: "Aisha came to us with a Band 6.0 score, struggling especially with writing and speaking modules. Through our personalized coaching and intensive practice sessions, she improved dramatically. Our teachers identified her weak areas and provided targeted exercises. She practiced speaking for 30 minutes daily and completed 50+ writing tasks during her course.",
    testimonial: "Stars English Centre changed my life! The teachers are incredibly supportive and the teaching methodology is excellent. I never thought I could achieve Band 8.5, but with their guidance, I did it. Now I'm studying at the University of Toronto!",
    category: "ielts",
    destination: "Canada",
    university: "University of Toronto",
    isFeatured: true,
  },
  {
    id: "s2",
    name: "Mohammad Karim",
    age: 28,
    course: "BASIC TO IELTS",
    achievement: "From Beginner to Band 7.5",
    previousScore: "Beginner Level",
    currentScore: "Band 7.5 (L: 8.0, R: 7.5, W: 7.0, S: 7.5)",
    duration: "6 months",
    story: "Mohammad had very basic English skills when he joined. He couldn't form proper sentences and had limited vocabulary. Our 6-month comprehensive program took him from basics to IELTS readiness. He attended classes 5 days a week and completed all homework diligently. His dedication combined with our structured curriculum led to this amazing transformation.",
    testimonial: "I started with almost zero English knowledge. The teachers at Stars were patient and encouraging. They taught me everything from grammar basics to advanced IELTS strategies. I'm now working in Dubai with an international company!",
    category: "ielts",
    destination: "UAE",
    isFeatured: true,
  },
  {
    id: "s3",
    name: "Nusrat Jahan",
    age: 22,
    course: "IELTS Regular + Spoken English",
    achievement: "Band 8.0 Overall",
    previousScore: "Band 6.5",
    currentScore: "Band 8.0 (L: 8.5, R: 8.0, W: 7.5, S: 8.0)",
    duration: "4 months",
    story: "Nusrat needed Band 7.5 for her master's program in Australia. She was close with Band 6.5 but couldn't break through. Our teachers worked on her pronunciation and helped her expand vocabulary. She joined our speaking club and practiced with peers regularly. The combination of classroom learning and practical application helped her achieve Band 8.0.",
    testimonial: "The speaking club sessions were incredibly helpful. I gained confidence and learned to express my ideas clearly. The mock tests prepared me perfectly for the actual exam. Highly recommended!",
    category: "study-abroad",
    destination: "Australia",
    university: "University of Melbourne",
    isFeatured: false,
  },
  {
    id: "s4",
    name: "Rafiq Ahmed",
    age: 32,
    course: "Corporate Training Program",
    achievement: "Promoted to Manager",
    currentScore: "Advanced Business English Proficiency",
    duration: "5 months",
    story: "Rafiq was a team lead who struggled with presentations and client communication. His company enrolled him in our Corporate Training Program. We focused on business communication, presentation skills, and professional writing. Within 5 months, his confidence soared. He successfully led multiple client meetings and delivered presentations at international conferences.",
    testimonial: "This training was a game-changer for my career. I can now confidently communicate with international clients and lead meetings. I got promoted to Manager within 6 months of completing the course!",
    category: "career",
    isFeatured: false,
  },
  {
    id: "s5",
    name: "Zara Khan (Age 10)",
    age: 10,
    course: "Kids' English Program",
    achievement: "School Topper in English",
    currentScore: "95% in School English Exam",
    duration: "12 months",
    story: "Little Zara was shy and struggled with reading comprehension and creative writing. Her parents enrolled her in our Kids' English program. Through interactive games, storytelling sessions, and fun activities, Zara's interest in English grew. She started reading books voluntarily and participating in class discussions. Her grades improved from 65% to 95%!",
    testimonial: "My daughter loves going to Stars English Centre! She's become confident and her English has improved tremendously. She even won a story-writing competition at school. Thank you to all the wonderful teachers! - Zara's Mother",
    category: "kids",
    isFeatured: false,
  },
  {
    id: "s6",
    name: "Fahim Hassan",
    age: 26,
    course: "IELTS + PTE Academic",
    achievement: "PTE Score 85/90",
    previousScore: "IELTS Band 7.0",
    currentScore: "PTE Overall 85 (L: 88, R: 86, W: 82, S: 84)",
    duration: "3 months",
    story: "Fahim had IELTS Band 7.0 but needed higher scores for immigration. He switched to PTE and joined our PTE Academic course. Our teachers familiarized him with the PTE format and computer-based testing. We provided extensive practice with the Pearson platform and taught him specific strategies for each question type. His hard work paid off with an impressive score of 85!",
    testimonial: "The PTE preparation at Stars was exceptional. The teachers knew exactly what the exam requires. The practice materials were up-to-date and very similar to the actual test. I'm now processing my PR application for Australia!",
    category: "study-abroad",
    destination: "Australia (PR)",
    isFeatured: true,
  },
  {
    id: "s7",
    name: "Sadia Sultana",
    age: 29,
    course: "Advanced Spoken & Phonetics",
    achievement: "Job at International NGO",
    currentScore: "Fluent English Speaker",
    duration: "2.5 months",
    story: "Sadia had good grammar knowledge but lacked speaking fluency and confidence. She often hesitated while speaking and had pronunciation issues. Our Phonetics course helped her correct pronunciation and our speaking sessions built her confidence. She practiced with audio recordings and received personalized feedback. Today, she works as a Communications Officer at an international NGO.",
    testimonial: "I can't thank Stars enough! The phonetics training corrected my pronunciation completely. I sound much more professional now and got my dream job at an international organization. The teachers are simply the best!",
    category: "career",
    isFeatured: false,
  },
  {
    id: "s8",
    name: "Tanvir Islam",
    age: 23,
    course: "IELTS Crash Course",
    achievement: "Band 7.5 in 1.5 Months",
    previousScore: "Band 6.5",
    currentScore: "Band 7.5 (L: 8.0, R: 7.5, W: 7.0, S: 7.5)",
    duration: "1.5 months",
    story: "Tanvir had his university deadline approaching and needed to improve his IELTS score quickly. He joined our intensive crash course with classes 6 days a week. Our focused approach helped him identify and work on his weaknesses rapidly. Daily practice tests and one-on-one feedback sessions accelerated his progress. He achieved his target score and secured admission!",
    testimonial: "The crash course is intense but incredibly effective! If you're short on time, this is the way to go. The daily practice and feedback helped me improve quickly. I got my desired score and I'm heading to the UK next month!",
    category: "study-abroad",
    destination: "United Kingdom",
    university: "University of Manchester",
    isFeatured: false,
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

// Success Story Card Component
function StoryCard({ story }: { story: SuccessStory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] hover:bg-white/15 transition-all duration-300 ${story.isFeatured ? 'ring-2 ring-yellow-400/50' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {story.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/30 border border-yellow-300/50 text-yellow-100">
                ⭐ Featured
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/30 border border-teal-300/50 text-teal-100">
              {story.course}
            </span>
          </div>
          
          {/* Student Info */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {story.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{story.name}</h3>
              <p className="text-sm text-white/70">Age: {story.age} • {story.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="backdrop-blur-md bg-gradient-to-r from-green-400/20 to-blue-400/20 border border-green-300/30 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <h4 className="text-lg font-bold text-white">{story.achievement}</h4>
            {story.previousScore && (
              <p className="text-sm text-white/80">
                Progress: <span className="line-through text-white/60">{story.previousScore}</span> → <span className="text-green-300 font-bold">{story.currentScore}</span>
              </p>
            )}
            {!story.previousScore && (
              <p className="text-sm text-white/80">{story.currentScore}</p>
            )}
          </div>
        </div>
      </div>

      {/* Destination */}
      {story.destination && (
        <div className="flex items-center gap-2 mb-4 text-sm text-white/90">
          <span className="text-teal-300">✈️</span>
          <span>Destination: <strong>{story.destination}</strong></span>
        </div>
      )}

      {story.university && (
        <div className="flex items-center gap-2 mb-4 text-sm text-white/90">
          <span className="text-teal-300">🎓</span>
          <span>University: <strong>{story.university}</strong></span>
        </div>
      )}

      {/* Story Preview */}
      <p className="text-sm text-white/80 mb-4 leading-relaxed">
        {isExpanded ? story.story : `${story.story.substring(0, 150)}...`}
      </p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-teal-300 hover:text-teal-200 transition-colors mb-4"
      >
        {isExpanded ? '↑ Show Less' : '↓ Read Full Story'}
      </button>

      {/* Testimonial */}
      {isExpanded && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-white/90 italic leading-relaxed">
            &quot;{story.testimonial}&quot;
          </p>
        </div>
      )}

      {/* Share Button */}
      <button className="w-full px-4 py-2 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
        Share Story 📤
      </button>
    </div>
  );
}

export default function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredStories = SUCCESS_STORIES.filter(story => {
    return selectedCategory === "all" || story.category === selectedCategory;
  });

  const featuredStories = SUCCESS_STORIES.filter(story => story.isFeatured);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-12">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
              Success Stories
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {COMPANY_INFO.tagline} - Real students, real achievements, real transformations
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATISTICS.map((stat, idx) => (
                <div key={idx} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:scale-105 transition-all duration-300">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <p className="text-3xl font-bold text-teal-300 mb-1">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Stories */}
          {featuredStories.length > 0 && (
            <div className="mb-10">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>⭐</span> Featured Success Stories
                </h2>
                <p className="text-white/80 text-sm mt-2">Outstanding achievements by our students</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category) => (
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

          {/* All Stories */}
          <div className="mb-10">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white">All Success Stories</h2>
              <p className="text-white/80 text-sm mt-2">
                {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
              </p>
            </div>

            {filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-xl">
                <p className="text-xl text-white/80 mb-4">No stories found in this category.</p>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white hover:scale-105 transition-all duration-300"
                >
                  View All Stories
                </button>
              </div>
            )}
          </div>

          {/* Become Our Next Success Story */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl mb-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Your Success Story Starts Here</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join hundreds of successful students who transformed their lives with Stars English Centre. 
                Our proven teaching methods and dedicated teachers will help you achieve your goals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-white mb-2">Personalized Learning</h3>
                  <p className="text-sm text-white/80">Individual attention and customized study plans</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                  <div className="text-4xl mb-3">👨‍🏫</div>
                  <h3 className="text-lg font-bold text-white mb-2">Expert Teachers</h3>
                  <p className="text-sm text-white/80">17+ years of experience and proven results</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                  <div className="text-4xl mb-3">📈</div>
                  <h3 className="text-lg font-bold text-white mb-2">Guaranteed Progress</h3>
                  <p className="text-sm text-white/80">Track your improvement with regular assessments</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#courses"
                  className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Enroll Now
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 rounded-full font-semibold border border-white/30 backdrop-blur-md bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  Book Free Consultation
                </a>
              </div>
            </div>
          </div>

          {/* Testimonial Submission */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-lg font-bold text-white mb-2">Are You Our Student?</h3>
            <p className="text-white/80 text-sm mb-4">Share your success story and inspire others!</p>
            <button className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Submit Your Story
            </button>
          </div>
 
        </section>
      </div>
    </main>
  );
}