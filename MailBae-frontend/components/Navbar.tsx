'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Mail className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">MailBae</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              Testimonials
            </button>
            <button onClick={handleLogin} className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-200">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={handleLogin} className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}