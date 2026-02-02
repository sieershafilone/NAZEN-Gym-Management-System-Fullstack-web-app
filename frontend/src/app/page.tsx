'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Dumbbell,
  Users,
  Calendar,
  CreditCard,
  ChartBar,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Check
} from 'lucide-react';
import { Button, Card, Spinner, BrandLogo } from '@/components/ui';
import { plansAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { MembershipPlan } from '@/types';

const features = [
  {
    icon: Users,
    title: 'Member Management',
    description: 'Complete member profiles with health data, membership tracking, and attendance.',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Razorpay integration with UPI, cards, and GST-compliant invoices.',
  },
  {
    icon: Calendar,
    title: 'QR Attendance',
    description: 'Quick check-in with QR codes. Track attendance history and patterns.',
  },
  {
    icon: ChartBar,
    title: 'Progress Tracking',
    description: 'Monitor weight, measurements, and strength gains with visual charts.',
  },
  {
    icon: Dumbbell,
    title: 'Workout Plans',
    description: 'Pre-built workout templates including PPL, Bro Split, and Full Body.',
  },
  {
    icon: Shield,
    title: 'Secure & Fast',
    description: 'Enterprise-grade security with blazing fast performance.',
  },
];

export default function HomePage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await plansAPI.getAll({ active: true });
        // Handle potentially different response structures
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-400/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/">
                <BrandLogo variant="default" className="scale-110" />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {['features', 'gallery', 'plans', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
            <Link href="/login">
              <Button size="sm" className="h-10 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </nav >

      {/* Hero Section */}
      < section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" >
        {/* Background Visuals */}
        < div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzNCwyMTIsMTg4LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-2 mb-10 transition-all hover:bg-white/[0.05] group">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Kupwara&apos;s <span className="text-white">Premium Fitness</span> Center
              </span>
            </div>

            <h1 className="text-6xl md:text-[6.5rem] font-black mb-10 leading-[0.9] tracking-tighter">
              EVOLVE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">FITNESS</span>
              <span className="text-cyan-400 glow-text"> JOURNEY</span>
            </h1>

            <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-12 font-bold uppercase tracking-widest leading-relaxed">
              Join <span className="text-white">ULIFTS-ONE MORE REP</span> – THE PREMIER GYM IN DRUGMULLA,
              DESIGNED FOR THE <span className="text-white">DEDICATED</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login">
                <Button size="lg" className="h-16 px-12 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] group shadow-xl">
                  Get Started
                  <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <a href="#plans">
                <Button size="lg" variant="secondary" className="h-16 px-12 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] border-white/5 hover:bg-white/5 transition-all">
                  View Plans
                </Button>
              </a>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-center gap-12 mt-24">
              <div className="text-center group">
                <p className="text-5xl font-black text-white tracking-tighter group-hover:text-cyan-400 transition-colors">500+</p>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-black mt-2">Active Members</p>
              </div>
              <div className="w-px h-16 bg-white/5" />
              <div className="text-center group">
                <p className="text-5xl font-black text-white tracking-tighter group-hover:text-cyan-400 transition-colors">75+</p>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-black mt-2">Gym Equipment</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 group cursor-pointer">
          <div className="w-8 h-12 border-2 border-white/5 rounded-full flex items-start justify-center p-2 group-hover:border-cyan-400/30 transition-all duration-500">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section >

      {/* Gallery Section */}
      < section id="gallery" className="py-32 bg-white/[0.01] border-y border-white/5 relative overflow-hidden" >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
              GYM <span className="text-cyan-400 glow-text">GALLERY</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-10" />
            <p className="text-zinc-500 max-w-2xl mx-auto font-black uppercase text-[10px] tracking-[0.3em]">
              Checkout our members and facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Screenshot_1.png',
              'Screenshot_2.png',
              'Screenshot_27.png',
              'Screenshot_3.png',
              'Screenshot_4.png',
              'Screenshot_5.png',
              'WhatsApp Image 2026-02-02 at 12.47.49 PM.jpeg',
              'WhatsApp Image 2026-02-02 at 12.47.59 PM.jpeg',
              'WhatsApp Image 2026-02-02 at 12.48.18 PM.jpeg',
              'WhatsApp Image 2026-02-02 at 12.48.31 PM.jpeg',
              'WhatsApp Image 2026-02-02 at 12.52.41 PM.jpeg'
            ].map((imgName, index) => (
              <motion.div
                key={imgName}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative group aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-cyan-400/30 transition-all duration-700 shadow-2xl"
              >
                <Image
                  src={`/images/${imgName}`}
                  alt={`Gym Photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="w-10 h-1 bg-cyan-400 mb-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-100" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-200">PHOTO {index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* Features Section */}
      < section id="features" className="py-32 relative" >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-tight">
              OUR <span className="text-cyan-400 glow-text">FEATURES</span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto font-black uppercase text-[10px] tracking-[0.3em]">
              Everything you need to reach your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="default" className="h-full group p-10 rounded-[3rem] border-white/10 bg-white/[0.03] backdrop-blur-3xl transition-all duration-500 shadow-xl hover:border-cyan-400/20">
                  <div className="w-20 h-20 bg-[#0D0D0D] border border-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:border-cyan-400/30 transition-all group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="w-10 h-10 text-white group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                  <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* Plans Section */}
      < section id="plans" className="py-32 bg-white/[0.01] border-y border-white/5" >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-tight">
              MEMBERSHIP <span className="text-cyan-400 glow-text">PLANS</span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto font-black uppercase text-[10px] tracking-[0.3em]">
              Select the best plan for your needs.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20 bg-[#0D0D0D] rounded-[3rem] border border-white/5 border-dashed">
              <p className="text-zinc-600 font-black uppercase tracking-widest">No active plans found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    variant="default"
                    className="relative flex flex-col p-12 rounded-[3.5rem] bg-white/[0.03] backdrop-blur-3xl border-white/10 shadow-xl transition-all duration-700 min-h-[500px]"
                  >
                    <div className="text-center mb-10">
                      <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-6">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-6xl font-black text-white tracking-tighter glow-primary group-hover:scale-110 transition-transform">
                          {formatCurrency(plan.finalPrice || plan.basePrice)}
                        </span>
                      </div>
                      <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.2em] mt-6">
                        {plan.durationDays} DAYS PLAN
                      </p>
                    </div>

                    <div className="space-y-4 mb-12 flex-1 pt-10 border-t border-white/5">
                      {plan.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                          <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/login" className="mt-auto">
                      <Button className="w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest group bg-white text-black hover:bg-cyan-400 transition-colors">
                        JOIN NOW
                        <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section >

      {/* Contact Section */}
      < section id="contact" className="py-32" >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                  FIND <br />
                  <span className="text-cyan-400 glow-text">US</span>
                </h2>
                <p className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em] leading-loose max-w-lg">
                  Visit our gym in <span className="text-white">Drugmulla</span>.
                  Equipped with high-quality fitness equipment.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: MapPin, label: 'ADDRESS', value: 'NH 701, FOREST BLOCK, DRUGMULLA, KUPWARA' },
                  { icon: Phone, label: 'PHONE', value: '+91 6005314228' },
                  { icon: Clock, label: 'OPENING HOURS', value: 'MON-SAT: 0600 - 2200 | SUN: 0800 - 1400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-8 group">
                    <div className="w-16 h-16 bg-[#0D0D0D] border border-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:border-cyan-400/30 transition-all">
                      <item.icon className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-2">{item.label}</h4>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[600px] w-full rounded-[3.5rem] overflow-hidden border border-white/5 group bg-[#0D0D0D] shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3288.9865168336455!2d74.2826682!3d34.477866299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e11f007b6d1065%3A0x415fd7b9ad5f56ea!2sUlifts%20Gym!5e0!3m2!1sen!2sin!4v1770022441721!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 border-white/10 group-hover:opacity-100 transition-all duration-[2s] scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 pointer-events-none border-[20px] border-[#0D0D0D]" />
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 relative bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <Link href="/">
              <BrandLogo
                variant="default"
                className="hover:scale-125 transition-all duration-1000"
                withGlow={true}
              />
            </Link>

            <div className="text-center md:text-right space-y-4">
              <p className="text-zinc-700 font-bold uppercase text-[10px] tracking-[0.4em]">
                © 2026 ULIFTS GYM. ALL RIGHTS RESERVED.
              </p>
              <div className="h-px w-12 bg-white/5 ml-auto hidden md:block" />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-loose">
                MADE BY <span className="text-white">SIEER LONE</span> <br />
                PHONE: +91 6005314228 <br />
                EMAIL: SIEERSHAFILONE@GMAIL.COM
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


