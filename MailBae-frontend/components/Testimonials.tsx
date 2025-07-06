'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechFlow Inc.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    quote: 'MailBae transformed my inbox from chaos to clarity. I save 2+ hours daily and never miss important emails.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Startup Founder',
    company: 'InnovateLab',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    quote: 'The AI responses are so natural, my clients think I\'m personally replying to every email. Game changer!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Watson',
    role: 'Product Manager',
    company: 'DataCore Systems',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    quote: 'Finally, an email tool that actually understands context. The daily summaries keep me in the loop effortlessly.',
    rating: 5,
  },
];

export default function Testimonials() {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3 + (i * 0.1),
        ease: "easeOut"
      }
    })
  };

  const starVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        delay: 0.5 + (i * 0.05),
        ease: "easeOut"
      }
    })
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
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
            Loved by early adopters
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            See what our users say about their MailBae experience
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100"
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={starVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <motion.blockquote 
                className="text-gray-700 text-lg mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                viewport={{ once: true }}
              >
                "{testimonial.quote}"
              </motion.blockquote>

              {/* Author */}
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
                viewport={{ once: true }}
              >
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-8 max-w-2xl mx-auto relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20" />
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/10" />
            
            <div className="relative z-10">
              <motion.h3 
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of satisfied users
              </motion.h3>
              <motion.p 
                className="text-blue-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Start your free trial today and experience the difference
              </motion.p>
              <motion.button 
                className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-3 rounded-2xl font-semibold transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Get Started Free
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}