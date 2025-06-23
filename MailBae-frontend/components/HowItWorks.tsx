'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, Filter, MessageSquare, Calendar } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Mail,
    title: 'Connect Your Inbox',
    description: 'Seamlessly integrate with Gmail and Outlook in just one click.',
    details: 'Secure OAuth connection with enterprise-grade encryption.',
  },
  {
    id: 2,
    icon: Filter,
    title: 'Auto-Filter & Classify',
    description: 'AI automatically categorizes and prioritizes your emails.',
    details: 'Smart categorization based on content, sender, and importance.',
  },
  {
    id: 3,
    icon: MessageSquare,
    title: 'AI-Powered Replies',
    description: 'Intelligent responses sent on your behalf with your tone.',
    details: 'Learns your communication style for authentic responses.',
  },
  {
    id: 4,
    icon: Calendar,
    title: 'Get Daily Summaries',
    description: 'Receive concise summaries of your daily email activity.',
    details: 'Customizable reports delivered at your preferred time.',
  },
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in just a few clicks.
          </p>
        </div>

        {/* Steps Carousel */}
        <div className="relative">
          {/* Main Step Display */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-8">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Step Content */}
              <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  {React.createElement(steps[currentStep].icon, {
                    className: 'w-8 h-8 text-blue-500',
                  })}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {steps[currentStep].title}
                </h3>
                <p className="text-lg text-gray-700 mb-2">
                  {steps[currentStep].description}
                </p>
                <p className="text-gray-500">
                  {steps[currentStep].details}
                </p>
              </div>

              {/* Step Visual */}
              <div className="flex-1 lg:ml-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 flex items-center justify-center">
                  {React.createElement(steps[currentStep].icon, {
                    className: 'w-24 h-24 text-blue-500',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
            </button>

            {/* Step Indicators */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
            </button>
          </div>

          {/* Step Counter */}
          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}