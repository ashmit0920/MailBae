'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Filter, MessageSquare, Calendar } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const steps = [
  {
    id: 1,
    icon: Mail,
    title: 'Connect Your Inbox',
    description: 'Seamlessly integrate with Gmail and Outlook in just one click.',
    details: 'Secure OAuth connection with enterprise-grade encryption.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
  },
  {
    id: 2,
    icon: Filter,
    title: 'Auto-Filter & Classify',
    description: 'AI automatically categorizes and prioritizes your emails.',
    details: 'Smart categorization based on content, sender, and importance.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100',
  },
  {
    id: 3,
    icon: MessageSquare,
    title: 'AI-Powered Replies',
    description: 'Intelligent responses sent on your behalf with your tone.',
    details: 'Learns your communication style for authentic responses.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
  },
  {
    id: 4,
    icon: Calendar,
    title: 'Get Daily Summaries',
    description: 'Receive concise summaries of your daily email activity.',
    details: 'Customizable reports delivered at your preferred time.',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'from-pink-50 to-pink-100',
  },
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000); // Change step every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
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

  const stepContentVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Get started in just a few clicks.
          </motion.p>
        </motion.div>

        {/* Steps Display */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Main Step Display */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-8 overflow-hidden relative"
            variants={itemVariants}
          >
            <div className="flex flex-col lg:flex-row items-center">
              {/* Step Content */}
              <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0 lg:pr-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={stepContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${steps[currentStep].color} rounded-2xl mb-6 text-white`}
                      variants={iconVariants}
                    >
                      {React.createElement(steps[currentStep].icon, {
                        className: 'w-8 h-8',
                      })}
                    </motion.div>
                    <motion.h3
                      className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {steps[currentStep].title}
                    </motion.h3>
                    <motion.p
                      className="text-lg text-gray-700 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {steps[currentStep].description}
                    </motion.p>
                    <motion.p
                      className="text-gray-500"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {steps[currentStep].details}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Step Visual */}
              <div className="flex-1 lg:ml-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    className={`bg-gradient-to-br ${steps[currentStep].bgColor} rounded-2xl p-8 flex items-center justify-center relative overflow-hidden`}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white opacity-50" />
                    </div>

                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                      {React.createElement(steps[currentStep].icon, {
                        className: `w-24 h-24 text-gradient-to-r ${steps[currentStep].color.replace('from-', '').replace('to-', '').split(' ')[0]} relative z-10`,
                        style: {
                          color: steps[currentStep].color.includes('blue') ? '#3B82F6' :
                            steps[currentStep].color.includes('indigo') ? '#6366F1' :
                              steps[currentStep].color.includes('purple') ? '#8B5CF6' : '#EC4899'
                        }
                      })}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Step Indicators */}
          <motion.div
            className="flex justify-center space-x-3"
            variants={itemVariants}
          >
            {steps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`relative h-3 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-blue-500' : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="mt-6 max-w-md mx-auto"
            variants={itemVariants}
          >
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-gray-500 text-sm">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}