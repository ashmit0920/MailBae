'use client';

import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  'Unlimited email summaries',
  '24/7 AI auto-responder',
  'Real-time classification',
  'Custom response templates',
  'Priority support',
];

export default function Pricing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.5 + (i * 0.1),
        ease: "easeOut"
      }
    })
  };

  return (
    <section id="pricing" className="py-20 bg-white">
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
            Pricing
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Simple, transparent billing. Start your free trial today.
          </motion.p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          className="max-w-md mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 relative overflow-hidden"
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.25)"
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Popular Badge - Fixed positioning */}
            <motion.div 
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span>Most Popular</span>
              </div>
            </motion.div>

            {/* Plan Name */}
            <motion.div 
              className="text-center mb-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal</h3>
              <p className="text-gray-600">Perfect for individuals</p>
            </motion.div>

            {/* Price */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">$4.99</span>
                <span className="text-lg text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
            </motion.div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center space-x-3"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  variants={featureVariants}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Start Free Trial
            </motion.button>

            {/* Trial Info */}
            <motion.p 
              className="text-center text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              7-day free trial • No credit card required
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            Need a custom solution for your team?
          </p>
          <motion.button 
            className="text-blue-500 hover:text-blue-600 font-semibold underline"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Contact our sales team
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}