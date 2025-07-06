'use client';

import { ArrowRight, Star, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import RotatingText from './ui/RotatingText/RotatingText';

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform values for scroll-based animations
  const previewScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const previewY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(
            ellipse 350px 350px at 10% 10%,
            rgba(99, 102, 241, 0.16) 0%,
            rgba(168, 85, 247, 0.14) 25%,
            rgba(59, 130, 246, 0.12) 50%,
            transparent 75%
          ),
          radial-gradient(
            ellipse 400px 300px at 85% 20%,
            rgba(59, 130, 246, 0.14) 0%,
            rgba(147, 51, 234, 0.12) 30%,
            rgba(99, 102, 241, 0.08) 60%,
            transparent 80%
          ),
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(248, 250, 252, 0.95) 30%,
            rgba(241, 245, 249, 0.9) 60%,
            rgba(255, 255, 255, 1) 100%
          )
        `
      }}
    >
      <motion.div
        className="max-w-6xl mx-auto text-center w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Trial Badge */}
        <motion.div
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium mb-8"
          variants={itemVariants}
        >
          <Star className="w-4 h-4 fill-current" />
          <span>7-day FREE trial</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          variants={itemVariants}
        >
          Don't kill your reachability.{' '}
          <span className="bg-gradient-to-r from-blue-500 to-purple-700 text-transparent bg-clip-text">
            Say goodbye to inbox clutter.
          </span>{' '}
          <span className="text-gray-900">Forever.</span>
        </motion.h1>

        {/* Trusted by section */}
        <motion.h3
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
          variants={itemVariants}
        >
          Trusted by
          <RotatingText
            texts={['professionals', 'freelancers', 'individuals', 'businesses', 'students']}
            mainClassName="px-2 sm:px-2 md:px-3 text-2xl sm:text-3xl lg:text-4xl font-bold overflow-hidden justify-center"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="bg-blue-500 text-white py-1 sm:py-1.5 md:py-2 px-3 rounded-lg inline-flex overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            rotationInterval={2000}
          />
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Tired of drowning in unread emails? MailBae's AI-powered responder sorts, replies, and summarizes your day's mail. So you can focus on what really matters. Zero setup, zero headaches.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
          <motion.button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span>Learn More</span>
          </motion.button>
        </motion.div>

        {/* Dashboard Preview Image */}
        <motion.div
          className="relative max-w-5xl mx-auto mb-16"
          variants={imageVariants}
          style={{
            scale: previewScale,
            y: previewY
          }}
        >
          <div className="relative">
            {/* Enhanced floating container with top and bottom shadows */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                boxShadow: `
                  0 -10px 25px -5px rgba(0, 0, 0, 0.1),
                  0 -4px 6px -2px rgba(0, 0, 0, 0.05),
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04)
                `
              }}
            >
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 pointer-events-none" />

              {/* Main content area with bottom fade effect */}
              <div className="aspect-[16/8] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                {/* Bottom fade gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(
                      to bottom,
                      transparent 0%,
                      transparent 50%,
                      rgba(255, 255, 255, 0.3) 70%,
                      rgba(255, 255, 255, 0.8) 85%,
                      rgba(255, 255, 255, 0.95) 100%
                    )`
                  }}
                />

                {/* Placeholder for dashboard image */}
                <div className="text-center space-y-4 relative z-10">
                  <img
                    src="/dashboard.png"
                    alt="MailBae Dashboard Preview"
                    className="w-full h-full object-cover"
                  />
                  {/* <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded-full w-48 mx-auto" />
                    <div className="h-3 bg-gray-200 rounded-full w-32 mx-auto" />
                  </div> */}
                  {/* <p className="text-gray-500 text-sm font-medium">Dashboard Preview</p> */}
                </div>
              </div>

              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            </motion.div>

            {/* Enhanced background glow effect */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl -z-10 scale-110"
              style={{
                background: `radial-gradient(
                  ellipse at center,
                  rgba(59, 130, 246, 0.15) 0%,
                  rgba(147, 51, 234, 0.1) 50%,
                  transparent 70%
                )`
              }}
            />
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 text-gray-500"
          variants={itemVariants}
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-gray-900">5K+</div>
            <div className="text-sm">Happy Users</div>
          </motion.div>
          <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
          <div className="block sm:hidden w-12 h-px bg-gray-300"></div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-gray-900">1M+</div>
            <div className="text-sm">Emails Processed</div>
          </motion.div>
          <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
          <div className="block sm:hidden w-12 h-px bg-gray-300"></div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm">Uptime</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}