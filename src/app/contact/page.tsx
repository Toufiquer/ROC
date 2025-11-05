'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, PhoneCall, MessageCircle, Send, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('✅ Message sent successfully!');
      setFormData({ name: '', email: '', mobile: '', message: '' });
    } catch {
      setStatus('❌ Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  const contactInfo = [
    { icon: Phone, label: 'Call Us', value: '+880 1991 075127', href: 'tel:+8801991075127' },
    { icon: Mail, label: 'Email Us', value: 'hello@example.com', href: 'mailto:hello@example.com' },
    { icon: MapPin, label: 'Visit Us', value: 'Dhaka, Bangladesh', href: '#' },
  ];

  return (
    <>
      <div className="min-h-screen pt-[75px] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-gray-800 relative overflow-hidden">
        {floatingParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-6xl mx-4 grid md:grid-cols-2 gap-8 mb-20 md:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold mb-4 text-white bg-clip-text"
              >
                Let&apos;s Connect
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg leading-relaxed"
              >
                Have a question or want to work together? Drop us a message and we&apos;ll get back to you as soon as possible.
              </motion.p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition-all group"
                >
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{info.label}</p>
                    <p className="text-white font-semibold">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-white/90">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 transition-all"
                  placeholder="John Doe"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-white/90">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 transition-all"
                  placeholder="john@example.com"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <label htmlFor="mobile" className="block text-sm font-semibold mb-2 text-white/90">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 transition-all"
                  placeholder="+880 1XXX XXXXXX"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-white/90">
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-transparent focus:outline-none bg-white/20 backdrop-blur-sm text-white placeholder:text-white/50 transition-all resize-none"
                  placeholder="Tell us about your project or inquiry..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 shadow-lg"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Message
                  </>
                )}
              </motion.button>
            </form>

            {status && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 text-center font-semibold text-lg ${status.startsWith('✅') ? 'text-green-300' : 'text-red-300'}`}
              >
                {status}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 flex md:hidden justify-around py-4 z-50 shadow-2xl">
          <Link href="/" className="flex flex-col items-center text-white/80 hover:text-white transition-colors">
            <Home size={24} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>

          <Link
            href="https://wa.me/8801700123456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1 font-medium">WhatsApp</span>
          </Link>

          <Link href="tel:+8801991075127" className="flex flex-col items-center text-white/80 hover:text-white transition-colors">
            <PhoneCall size={24} />
            <span className="text-xs mt-1 font-medium">Contact</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Contact;
