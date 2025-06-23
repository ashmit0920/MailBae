'use client';

import { ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RotatingText from './ui/RotatingText/RotatingText';

export default function Hero() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Trial Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Star className="w-4 h-4 fill-current" />
          <span>7-day FREE trial</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          MailBae:{' '}
          <span className="bg-gradient-to-r from-blue-500 to-purple-700 text-transparent bg-clip-text inline-block">Your Inbox's BFF</span>
        </h1>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
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
        </h3>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Tired of drowning in unread emails? MailBae's AI-powered responder sorts, replies, and summarizes your day's mail. So you can focus on what really matters. <br></br>Zero setup, zero headaches.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button onClick={handleGetStarted} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200"
          >
            Learn More
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex items-center justify-center space-x-8 text-gray-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">5K+</div>
            <div className="text-sm">Happy Users</div>
          </div>
          <div className="w-px h-12 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1M+</div>
            <div className="text-sm">Emails Processed</div>
          </div>
          <div className="w-px h-12 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}